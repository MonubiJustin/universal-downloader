"use client";

import React, { useState } from 'react';
import VideoResult from './VideoResult';

const DownloadForm = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [videoData, setVideoData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setVideoData(null);

        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${apiBaseUrl}/api/download/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch video information');
            }

            setVideoData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="mb-12">
                <div className="relative flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Paste video link here (YouTube, Facebook, etc.)..."
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white glass"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/50 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Analyze'
                        )}
                    </button>
                </div>
                {error && (
                    <p className="text-rose-500 mt-4 text-center font-medium">{error}</p>
                )}
            </form>

            {videoData && <VideoResult videoData={videoData} originalUrl={url} />}
        </div>
    );
};

export default DownloadForm;
