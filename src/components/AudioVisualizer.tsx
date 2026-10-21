'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';

export default function AudioVisualizer() {
  const { isPlaying } = usePlayer();

  return (
    <div className="flex items-end gap-[2px] h-4 px-1" title={isPlaying ? 'Playing' : 'Paused'}>
      <span
        className={`w-[3px] bg-[#1DB954] rounded-full transition-all duration-150 ${
          isPlaying ? 'animate-bounce-subtle-1 h-3' : 'h-1 bg-white/40'
        }`}
      />
      <span
        className={`w-[3px] bg-[#1DB954] rounded-full transition-all duration-150 ${
          isPlaying ? 'animate-bounce-subtle-2 h-4' : 'h-2 bg-white/40'
        }`}
      />
      <span
        className={`w-[3px] bg-[#1DB954] rounded-full transition-all duration-150 ${
          isPlaying ? 'animate-bounce-subtle-3 h-2.5' : 'h-1.5 bg-white/40'
        }`}
      />
      <span
        className={`w-[3px] bg-[#1DB954] rounded-full transition-all duration-150 ${
          isPlaying ? 'animate-bounce-subtle-1 h-3.5' : 'h-1 bg-white/40'
        }`}
      />
    </div>
  );
}
