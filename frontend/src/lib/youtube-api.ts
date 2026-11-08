export type AudioFormat = {
  formatId: string;
  extension: string;
  codec: string;
  bitrate: number | null;
  filesize: number | null;
};

export type VideoInfo = {
  id: string;
  title: string;
  duration: number | null;
  thumbnail: string | null;
  formats: AudioFormat[];
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
};

export class YoutubeApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "YoutubeApiError";
    this.code = code;
  }
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const youtubeApiPrefix = process.env.NEXT_PUBLIC_YOUTUBE_API_PREFIX ?? "/api/youtube";

function endpoint(path: string) {
  return `${apiBaseUrl}${youtubeApiPrefix}${path}`;
}

async function parseError(response: Response) {
  try {
    const body = (await response.json()) as ApiEnvelope<never>;
    return new YoutubeApiError(
      body.error?.message ?? body.message ?? "The request could not be completed.",
      body.error?.code,
    );
  } catch {
    return new YoutubeApiError("The request could not be completed.");
  }
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const response = await fetch(endpoint("/info"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const body = (await response.json()) as ApiEnvelope<VideoInfo> | VideoInfo;
  const data = "data" in body ? body.data : body;

  if (!data || !("title" in data) || !("id" in data)) {
    throw new YoutubeApiError("The backend returned incomplete video information.");
  }

  return {
    ...data,
    duration: data.duration ?? null,
    thumbnail: data.thumbnail ?? null,
    formats: data.formats ?? [],
  };
}

function filenameFromDisposition(value: string | null, fallback: string) {
  const match = value?.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
  const filename = match?.[1] ?? match?.[2];

  if (!filename) return fallback;

  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function fallbackFilename(title: string, mimeType: string) {
  const safeTitle = title.replace(/[\\/:*?"<>|]/g, "-").trim() || "youtube-audio";
  const extension = {
    "audio/mp4": "m4a",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/webm": "webm",
  }[mimeType];

  return extension && !/\.[a-z0-9]{2,5}$/i.test(safeTitle)
    ? `${safeTitle}.${extension}`
    : safeTitle;
}

function saveBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadAudio(url: string, title?: string): Promise<void> {
  const response = await fetch(endpoint("/download"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const mimeType = contentType.split(";", 1)[0].trim().toLowerCase();
  const contentDisposition = response.headers.get("content-disposition") ?? "";
  const isAttachment = /^attachment(?:;|$)/i.test(contentDisposition.trim());

  if (isAttachment || mimeType.startsWith("audio/") || mimeType === "application/octet-stream") {
    saveBlob(
      await response.blob(),
      filenameFromDisposition(
        response.headers.get("content-disposition"),
        fallbackFilename(title ?? "youtube-audio", mimeType),
      ),
    );
    return;
  }

  let body: ApiEnvelope<{ downloadUrl?: string; filename?: string; status?: string }>;
  try {
    body = (await response.json()) as ApiEnvelope<{
      downloadUrl?: string;
      filename?: string;
      status?: string;
    }>;
  } catch {
    throw new YoutubeApiError("The audio download response is not supported yet.");
  }

  const result = body.data;
  if (result?.downloadUrl) {
    window.location.assign(result.downloadUrl);
    return;
  }

  throw new YoutubeApiError(
    result?.status === "queued" || result?.status === "processing"
      ? "Audio preparation has started, but the job status flow is not connected yet."
      : "The backend download response contract is not ready yet.",
  );
}
