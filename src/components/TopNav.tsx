'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { ChevronLeft, ChevronRight, Search, X, ExternalLink } from 'lucide-react';

interface TopNavProps {
  scrolled: boolean;
}

export default function TopNav({ scrolled }: TopNavProps) {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    activeColor,
  } = usePlayer();

  return (
    <header
      className={`sticky top-0 z-40 h-16 px-6 flex items-center justify-between transition-colors duration-300 ${
        scrolled
          ? 'bg-[#121212]/95 backdrop-blur-md shadow-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
      style={{
        backgroundColor: scrolled ? '#121212ee' : 'transparent',
      }}
    >
      {/* Navigation history & search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('home')}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveView('search')}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition"
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/60">
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
            placeholder="What do you want to play? (Search YouTube Music)"
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white text-sm rounded-full pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-white transition border border-transparent focus:border-white/20 placeholder:text-white/40"
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

      {/* Right controls: GitHub, Vercel info, user pill */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/giri20007/AuraFy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/10 shadow-sm"
        >
          <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span className="hidden sm:inline">giri20007/AuraFy</span>
        </a>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 p-1 pl-2 pr-3 bg-black/60 rounded-full border border-white/10">
          <div className="w-7 h-7 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-xs">
            G
          </div>
          <span className="text-xs font-semibold text-white hidden md:inline">
            giri20007
          </span>
        </div>
      </div>
    </header>
  );
}
