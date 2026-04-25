"use client";

import React, { useState } from 'react';

const VideoResult = ({ videoData, originalUrl }) => {
    const [audioLoading, setAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState(null);

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDownloadAudio = async () => {
        setAudioLoading(true);
        setAudioError(null);
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${apiBaseUrl}/api/download/audio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: originalUrl }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to get audio link');
            window.open(data.url, '_blank');
        } catch (err) {
            setAudioError(err.message);
        } finally {
            setAudioLoading(false);
        }
    };

    return (
        <div className="glass rounded-3xl overflow-hidden glass-hover animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative group">
                    <img
                        src={videoData.thumbnail || 'https://via.placeholder.com/480x270'}
                        alt={videoData.title}
                        className="w-full h-full object-cover aspect-video"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/60 px-3 py-1 rounded text-sm font-medium">
                            {videoData.platform}
                        </span>
                    </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                            {videoData.title}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-6">
                            <span>{videoData.uploader}</span>
                            <span>•</span>
                            <span>{formatDuration(videoData.duration)}</span>
                            {videoData.quality && (
                                <>
                                    <span>•</span>
                                    <span className="text-emerald-400 font-semibold">{videoData.quality}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={videoData.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l-3 3m0 0l-3-3m3 3V3m0 18a9 9 0 110-18 9 9 0 010 18z" />
                            </svg>
                            Download Video
                        </a>
                        
                        <button
                            onClick={handleDownloadAudio}
                            disabled={audioLoading}
                            className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50"
                        >
                            {audioLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                    Download MP3
                                </>
                            )}
                        </button>
                    </div>
                    {audioError && (
                        <p className="text-rose-400 text-xs mt-2 text-center">{audioError}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoResult;
