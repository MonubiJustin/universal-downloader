import { rm } from "node:fs/promises";

import type { NextFunction, Request, Response } from "express";

import type { VideoInfoRequest } from "./ytb.schema";
import youtubeService from "./ytb.services";

function audioContentType(filePath: string) {
  switch (filePath.toLowerCase().split(".").pop()) {
    case "m4a":
      return "audio/mp4";
    case "mp3":
      return "audio/mpeg";
    case "ogg":
    case "opus":
      return "audio/ogg";
    case "wav":
      return "audio/wav";
    case "webm":
      return "audio/webm";
    default:
      return "application/octet-stream";
  }
}

export const getVideoInfo = async (req: Request, res: Response) => {
  const { url } = req.body as VideoInfoRequest;

  const result = await youtubeService.getVideoInfo(url);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const downloadAudio = async (req: Request, res: Response, next: NextFunction) => {
  let download: Awaited<ReturnType<typeof youtubeService.downloadAudio>> | undefined;

  try {
    const { url } = req.body as VideoInfoRequest;

    download = await youtubeService.downloadAudio(url);

    if (!download) return;

    const preparedDownload = download;
    res.setHeader("Content-Type", audioContentType(preparedDownload.filePath));
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    res.download(preparedDownload.filePath, preparedDownload.filename, async (error) => {
      await rm(preparedDownload.tempDir, { recursive: true, force: true });

      if (error && !res.headersSent) {
        next(error);
      }
    });
  } catch (error: unknown) {
    if (download) {
      await rm(download.tempDir, { recursive: true, force: true });
    }

    next(error);
  }
};
