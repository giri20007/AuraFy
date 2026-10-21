'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Home, Search, Library } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeView, setActiveView, setSelectedPlaylist } = usePlayer();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 z-40 flex items-center justify-around px-4 pb-safe select-none">
      <button
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
        <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-[#1DB954]' : ''}`} />
        <span className={`text-[10px] font-medium ${activeView === 'home' ? 'text-white font-bold' : ''}`}>
          Home
        </span>
      </button>

      <button
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
        <Search className={`w-5 h-5 ${activeView === 'search' ? 'text-[#1DB954]' : ''}`} />
        <span className={`text-[10px] font-medium ${activeView === 'search' ? 'text-white font-bold' : ''}`}>
          Search
        </span>
      </button>

      <button
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
        <Library className={`w-5 h-5 ${activeView === 'library' || activeView === 'liked' ? 'text-[#1DB954]' : ''}`} />
        <span className={`text-[10px] font-medium ${activeView === 'library' || activeView === 'liked' ? 'text-white font-bold' : ''}`}>
          Your Library
        </span>
      </button>
    </nav>
  );
}
