'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Home, Search, Library } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeView, setActiveView, setSelectedPlaylist } = usePlayer();

  return (
    <nav className="md:hidden fixed bottom-2.5 inset-x-4 h-14 glass-dock rounded-full z-40 flex items-center justify-around px-2 select-none">
      <button
        onClick={() => {
          setSelectedPlaylist(null);
          setActiveView('home');
        }}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 ${
          activeView === 'home'
            ? 'bg-white/15 text-white font-bold shadow-inner'
            : 'text-[#a1a1aa] hover:text-white'
        }`}
      >
        <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-[#1DB954]' : ''}`} />
        <span className="text-xs">Home</span>
      </button>

      <button
        onClick={() => {
          setSelectedPlaylist(null);
          setActiveView('search');
        }}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 ${
          activeView === 'search'
            ? 'bg-white/15 text-white font-bold shadow-inner'
            : 'text-[#a1a1aa] hover:text-white'
        }`}
      >
        <Search className={`w-5 h-5 ${activeView === 'search' ? 'text-[#1DB954]' : ''}`} />
        <span className="text-xs">Search</span>
      </button>

      <button
        onClick={() => {
          setSelectedPlaylist(null);
          setActiveView('library');
        }}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 ${
          activeView === 'library' || activeView === 'liked'
            ? 'bg-white/15 text-white font-bold shadow-inner'
            : 'text-[#a1a1aa] hover:text-white'
        }`}
      >
        <Library className={`w-5 h-5 ${activeView === 'library' || activeView === 'liked' ? 'text-[#1DB954]' : ''}`} />
        <span className="text-xs">Library</span>
      </button>
    </nav>
  );
}
