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
      className="md:hidden fixed bottom-[70px] inset-x-2 h-14 rounded-lg bg-[#242424]/95 backdrop-blur-md border border-white/10 shadow-2xl z-40 flex items-center justify-between px-2.5 overflow-hidden cursor-pointer select-none"
      style={{
        backgroundImage: `linear-gradient(90deg, ${activeColor}55 0%, #1e1e1e 100%)`,
      }}
    >
      {/* Left: Thumbnail & Song Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          className="w-10 h-10 rounded-md object-cover shrink-0 shadow"
        />
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs font-bold text-white truncate">
            {currentTrack.title}
          </p>
          <p className="text-[11px] text-[#b3b3b3] truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Right: Like & Play/Pause */}
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => toggleLike(currentTrack)}
          className={`p-1.5 transition ${
            liked ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-[#1DB954]' : ''}`} />
        </button>

        <button
          onClick={togglePlayPause}
          className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-black" />
          ) : (
            <Play className="w-4 h-4 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Thin playback progress bar at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/20">
        <div
          className="h-full bg-[#1DB954] transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
