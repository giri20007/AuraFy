'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { ChevronLeft, ChevronRight, Search, X, Disc3, Download, Bell } from 'lucide-react';

interface TopNavProps {
  scrolled: boolean;
}

export default function TopNav({ scrolled }: TopNavProps) {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setSelectedPlaylist,
  } = usePlayer();

  return (
    <header
      className={`sticky top-0 z-30 px-4 sm:px-6 py-3 flex flex-col gap-3 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#121212]/90 backdrop-blur-2xl shadow-xl border-b border-white/[0.08]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Navigation History & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Back & Forward Circular Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedPlaylist(null);
                setActiveView('home');
              }}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition backdrop-blur-md border border-white/10"
              title="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedPlaylist(null);
                setActiveView('search');
              }}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition backdrop-blur-md border border-white/10 hidden sm:flex"
              title="Go forward"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Search Pill Input (Spotify style) */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'search') setActiveView('search');
              }}
              onFocus={() => {
                if (activeView !== 'search') setActiveView('search');
              }}
              placeholder="What do you want to play?"
              className="w-full bg-[#242424]/80 hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] backdrop-blur-xl text-white text-xs sm:text-sm rounded-full pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-white transition border border-white/10 placeholder:text-white/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Spotify Buttons & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://github.com/giri20007/AuraFy"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 backdrop-blur-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </a>

          {/* User Profile Avatar Circle */}
          <div
            onClick={() => setActiveView('library')}
            className="w-8 h-8 rounded-full bg-[#1DB954] hover:scale-105 transition cursor-pointer flex items-center justify-center text-black font-extrabold text-xs shadow-md border-2 border-black/40"
            title="Profile"
          >
            G
          </div>
        </div>
      </div>
    </header>
  );
}
