'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { ChevronLeft, ChevronRight, Search, X, Download } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '@/data/languageData';

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
    selectedLanguage,
  } = usePlayer();

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <header
      data-testid="top-nav-bar"
      className={`sticky top-0 z-30 px-4 sm:px-6 py-2.5 flex flex-col gap-2 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#121216]/90 backdrop-blur-2xl shadow-xl border-b border-white/[0.08]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Navigation History & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Back & Forward Circular Buttons */}
          <div className="flex items-center gap-2">
            <button
              data-testid="nav-back-button"
              onClick={() => {
                setSelectedPlaylist(null);
                setActiveView('home');
              }}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition backdrop-blur-md border border-white/10"
              title="Go to Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              data-testid="nav-search-button"
              onClick={() => {
                setSelectedPlaylist(null);
                setActiveView('search');
              }}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition backdrop-blur-md border border-white/10 hidden sm:flex"
              title="Go to Search"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Search Pill Input (Desktop always, Mobile when not in search view) */}
          <div
            className={`relative flex-1 max-w-md ${
              activeView === 'search' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
              <Search className="w-4 h-4 text-[#1DB954]" />
            </div>
            <input
              type="text"
              data-testid="topnav-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'search') setActiveView('search');
              }}
              onFocus={() => {
                if (activeView !== 'search') setActiveView('search');
              }}
              placeholder={`Search in ${currentLang.name}...`}
              className="w-full bg-[#24242e]/80 hover:bg-[#2e2e38] focus:bg-[#2e2e38] backdrop-blur-xl text-white text-xs sm:text-sm rounded-full pl-10 pr-9 py-2 outline-none focus:ring-2 focus:ring-[#1DB954] transition border border-white/10 placeholder:text-white/40 shadow-inner"
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 backdrop-blur-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </a>

          {/* User Profile Avatar Circle */}
          <div
            onClick={() => setActiveView('library')}
            className="w-8 h-8 rounded-full bg-[#1DB954] hover:scale-105 transition cursor-pointer flex items-center justify-center text-black font-extrabold text-xs shadow-md border-2 border-black/40"
            title="Profile / Your Library"
          >
            G
          </div>
        </div>
      </div>
    </header>
  );
}
