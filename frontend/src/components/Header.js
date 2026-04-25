import React from 'react';

const Header = () => {
    return (
        <header className="py-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
                Universal Downloader
            </h1>
            <p className="text-slate-400 text-lg md:text-xl">
                Download your favorite videos and audio in seconds
            </p>
        </header>
    );
};

export default Header;
