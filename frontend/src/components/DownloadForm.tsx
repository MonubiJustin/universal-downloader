"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { downloadAudio, getVideoInfo, VideoInfo, YoutubeApiError } from "@/lib/youtube-api";

function formatDuration(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) return "Duration unavailable";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function DownloadForm() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Paste a YouTube link to continue.");
      return;
    }

    setError("");
    setVideoInfo(null);
    setIsLoading(true);

    try {
      setVideoInfo(await getVideoInfo(trimmedUrl));
    } catch (requestError) {
      setError(
        requestError instanceof YoutubeApiError
          ? requestError.message
          : "We couldn't retrieve that video. Check the link and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownload() {
    setError("");
    setIsDownloading(true);

    try {
      await downloadAudio(url.trim(), videoInfo?.title);
    } catch (requestError) {
      setError(
        requestError instanceof YoutubeApiError
          ? requestError.message
          : "The audio could not be prepared. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  function reset() {
    setUrl("");
    setVideoInfo(null);
    setError("");
  }

  if (videoInfo) {
    return (
      <section className="result-shell" aria-live="polite">
        <div className="result-media">
          {videoInfo.thumbnail ? (
            <Image
              src={videoInfo.thumbnail}
              alt=""
              fill
              sizes="(max-width: 720px) 100vw, 360px"
              className="result-thumbnail"
              unoptimized
            />
          ) : (
            <div className="thumbnail-fallback" aria-hidden="true">
              <span>♪</span>
            </div>
          )}
        </div>
        <div className="result-copy">
          <p className="eyebrow">Ready to extract</p>
          <h2>{videoInfo.title}</h2>
          <p className="metadata">
            YouTube <span aria-hidden="true">·</span> {formatDuration(videoInfo.duration)}
          </p>
          <p className="quality-note">
            <span className="check-mark" aria-hidden="true">✓</span>
            Best available audio selected automatically
          </p>
          <button
            type="button"
            className="download-button"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? <span className="spinner" aria-hidden="true" /> : <span aria-hidden="true">↓</span>}
            {isDownloading ? "Preparing audio…" : "Download audio"}
          </button>
          {error && <p className="form-error result-error" role="alert">{error}</p>}
          <button type="button" className="reset-button" onClick={reset}>
            Use another link
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="form-wrap">
      <form className="url-form" onSubmit={handleSubmit}>
        <label htmlFor="youtube-url" className="sr-only">YouTube URL</label>
        <div className="url-input-wrap">
          <span className="link-icon" aria-hidden="true">↗</span>
          <input
            id="youtube-url"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="Paste a YouTube link"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <span className="spinner" aria-hidden="true" /> : "Get audio"}
          </button>
        </div>
      </form>
      {isLoading && <p className="status-message">Finding the best audio track…</p>}
      {error && !isLoading && <p className="form-error" role="alert">{error}</p>}
      <p className="form-hint">YouTube links only · No account required</p>
    </div>
  );
}
