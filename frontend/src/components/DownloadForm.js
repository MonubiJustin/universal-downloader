"use client";

import { useState } from "react";
import Image from "next/image";

export default function DownloadForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [videoInfo, setVideoInfo] = useState(null);
    const [formatsLoading, setFormatsLoading] = useState(false);
    const [formats, setFormats] = useState(null);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatSize = (bytes) => {
        if (!bytes) return "Unknown size";
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleFetchInfo = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError("");
        setVideoInfo(null);
        setFormats(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/info`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) throw new Error("Could not fetch video. Check the URL and try again.");
            const data = await res.json();
            setVideoInfo(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchFormats = async () => {
        if (formats) {
            setFormats(null);
            return;
        }

        setFormatsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/formats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) throw new Error("Failed to fetch formats.");
            const data = await res.json();
            setFormats(data.formats);
        } catch (err) {
            console.error(err);
        } finally {
            setFormatsLoading(false);
        }
    };

    const handleReset = () => {
        setUrl("");
        setVideoInfo(null);
        setFormats(null);
        setError("");
    };

    if (videoInfo) {
        return (
            <div className="fade-slide-up w-full max-w-2xl mx-auto space-y-6">
                <div className="glass rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative aspect-video w-full">
                        <Image
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            fill
                            className="object-cover"
                            unoptimized={true} // Usually external images need unoptimized or remotePatterns in config
                        />
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <h2 className="text-xl font-bold leading-tight line-clamp-2">{videoInfo.title}</h2>
                            <p className="text-gray-400 mt-1">
                                {videoInfo.uploader} • <span className="capitalize">{videoInfo.platform}</span> • {formatDuration(videoInfo.duration)}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={videoInfo.downloadUrl}
                                download
                                className="btn-primary flex-1 no-underline"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download MP4
                            </a>
                            <button
                                onClick={handleFetchFormats}
                                className="px-6 py-3 rounded-xl border border-white/10 glass-hover transition-all font-semibold flex items-center justify-center gap-2"
                            >
                                {formatsLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                                {formats ? "Hide Formats" : "Choose Format"}
                            </button>
                        </div>

                        {formats && (
                            <div className="pt-4 border-t border-white/5 space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {formats.map((f, i) => (
                                    <a
                                        key={i}
                                        href={f.url}
                                        download
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-sm px-2 py-1 bg-white/5 rounded-md uppercase">{f.ext}</span>
                                            <span className="text-sm text-gray-300">{f.quality}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500">{formatSize(f.filesize)}</span>
                                            <svg className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <button
                    onClick={handleReset}
                    className="w-full text-center py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                    Download another video
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleFetchInfo} className="relative group">
                <label htmlFor="video-url" className="sr-only">Paste video URL</label>
                <div className="relative">
                    <input
                        id="video-url"
                        type="text"
                        placeholder="Paste your link here..."
                        className="input-field pr-32"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                    />
                    <div className="absolute right-2 top-2 bottom-2">
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="h-full px-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Download"
                            )}
                        </button>
                    </div>
                </div>
            </form>
            {error && (
                <p className="mt-4 text-sm text-red-500 text-center animate-pulse">{error}</p>
            )}
        </div>
    );
}
