import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import type { Payload } from "youtube-dl-exec";
import youtubeDl from "youtube-dl-exec";

class YoutubeService {
  private parseInfo(result: string | Payload): Payload {
    return typeof result === "string" ? (JSON.parse(result) as Payload) : result;
  }

  async getVideoInfo(url: string) {
    const result = await youtubeDl(url, {
      dumpSingleJson: true,
      skipDownload: true,
      noWarnings: true,
      noPlaylist: true,
    });

    const info = this.parseInfo(result);

    return {
      id: info.id,
      title: info.title,
      duration: info.duration,
      thumbnail: info.thumbnail,
      formats: info.formats
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
          (f) => f.vcodec === "none" && f.acodec !== "none",
        )
        .map((f) => ({
          formatId: f.format_id,
          extension: f.ext,
          codec: f.acodec,
          bitrate: f.abr,
          filesize: f.filesize,
        })),
    };
  }

  async downloadAudio(url: string) {
    const tempDir = await mkdtemp(path.join(tmpdir(), "youtube-audio-"));

    try {
      const output = path.join(tempDir, "audio.%(ext)s");

      await youtubeDl(url, {
        format: "bestaudio/best",
        output,
        noPlaylist: true,
        noWarnings: true,
        noProgress: true,
      });

      const info = this.parseInfo(await youtubeDl(url, {
        dumpSingleJson: true,
        skipDownload: true,
        noPlaylist: true,
        noWarnings: true,
      }));

      const files = await readdir(tempDir, { withFileTypes: true });
      const downloadedFile = files.find((file) => file.isFile());

      if (!downloadedFile) {
        throw new Error("yt-dlp completed without producing an audio file");
      }

      const filePath = path.join(tempDir, downloadedFile.name);
      const extension = path.extname(downloadedFile.name);
      const filename = `${info.title}${extension}`;

      return {
        tempDir,
        filePath,
        filename,
        title: info.title,
      };
    } catch (error: unknown) {
      await rm(tempDir, { recursive: true, force: true });

      throw error;
    }
  }
}

const youtubeService = new YoutubeService();

export default youtubeService;
