'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, Heart } from 'lucide-react';

interface MobileMiniPlayerProps {
  onOpenFullPlayer: () => void;
}

export default function MobileMiniPlayer({ onOpenFullPlayer }: MobileMiniPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    toggleLike,
    isLiked,
    activeColor,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  return (
    <div
      onClick={onOpenFullPlayer}
      className="md:hidden fixed bottom-[76px] inset-x-3.5 h-[60px] rounded-2xl glass-dock shadow-2xl z-40 flex items-center justify-between px-3 overflow-hidden cursor-pointer select-none active:scale-[0.99] transition-transform duration-200"
      style={{
        boxShadow: `0 12px 36px -8px ${activeColor || '#8400e7'}40, 0 0 0 1px rgba(255, 255, 255, 0.12)`,
      }}
    >
      {/* Dynamic ambient gradient glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700"
        style={{
          background: `linear-gradient(90deg, ${activeColor || '#8400e7'} 0%, transparent 80%)`,
        }}
      />

      {/* Left: Thumbnail & Song Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
        />
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs font-bold text-white truncate tracking-tight">
            {currentTrack.title}
          </p>
          <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Right: Like & Play/Pause */}
      <div className="flex items-center gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => toggleLike(currentTrack)}
          className={`p-2 transition active:scale-90 ${
            liked ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-[#1DB954]' : ''}`} />
        </button>

        <button
          onClick={togglePlayPause}
          className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-black" />
          ) : (
            <Play className="w-4 h-4 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Thin glowing playback progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/10">
        <div
          className="h-full bg-[#1DB954] shadow-[0_0_8px_#1DB954] transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
