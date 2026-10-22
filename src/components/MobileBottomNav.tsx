'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Home, Search, Library } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeView, setActiveView, setSelectedPlaylist } = usePlayer();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#121212]/95 backdrop-blur-xl border-t border-[#282828] z-40 flex items-center justify-around px-4 select-none pb-safe">
      <button
        data-testid="bottom-nav-home"
        onClick={() => {
          setSelectedPlaylist(null);
          setActiveView('home');
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition ${
          activeView === 'home'
            ? 'text-white'
            : 'text-[#b3b3b3] hover:text-white'
        }`}
      >
        <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-white' : ''}`} />
        <span className={`text-[11px] ${activeView === 'home' ? 'text-white font-bold' : 'font-medium'}`}>
          Home
        </span>
      </button>

      <button
        data-testid="bottom-nav-search"
        onClick={() => {
          setSelectedPlaylist(null);
          setActiveView('search');
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition ${
          activeView === 'search'
            ? 'text-white'
            : 'text-[#b3b3b3] hover:text-white'
        }`}
      >
        <Search className={`w-5 h-5 ${activeView === 'search' ? 'text-white' : ''}`} />
        <span className={`text-[11px] ${activeView === 'search' ? 'text-white font-bold' : 'font-medium'}`}>
          Search
        </span>
      </button>

      <button
        data-testid="bottom-nav-library"
        onClick={() => {
          setSelectedPlaylist(null);
          setActiveView('library');
        }}
        className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition ${
          activeView === 'library' || activeView === 'liked'
            ? 'text-white'
            : 'text-[#b3b3b3] hover:text-white'
        }`}
      >
        <Library className={`w-5 h-5 ${activeView === 'library' || activeView === 'liked' ? 'text-white' : ''}`} />
        <span className={`text-[11px] ${activeView === 'library' || activeView === 'liked' ? 'text-white font-bold' : 'font-medium'}`}>
          Your Library
        </span>
      </button>
    </nav>
  );
}
