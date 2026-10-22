'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { formatSecondsToTime } from '@/lib/utils';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Mic2,
  ListMusic,
  Tv,
  MoreVertical,
  Share2,
} from 'lucide-react';

interface MobileNowPlayingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNowPlayingModal({
  isOpen,
  onClose,
}: MobileNowPlayingModalProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isShuffle,
    repeatMode,
    togglePlayPause,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    nextTrack,
    prevTrack,
    toggleLike,
    isLiked,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueOpen,
    setIsQueueOpen,
    isVideoMode,
    setIsVideoMode,
    activeColor,
  } = usePlayer();

  if (!isOpen || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const targetSeconds = (newPercent / 100) * duration;
    seekTo(targetSeconds);
  };

  return (
    <div
      className="md:hidden fixed inset-0 z-50 flex flex-col justify-between p-6 select-none animate-slide-up overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${activeColor || '#1e3264'} 0%, #121212 55%, #000000 100%)`,
      }}
    >
      {/* 1. Top Header Bar */}
      <div className="flex items-center justify-between text-white pt-2">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-white/80 hover:text-white"
          title="Close"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">
            Playing from playlist
          </p>
          <p className="text-xs font-bold text-white truncate max-w-[200px] mt-0.5">
            Today&apos;s Top Hits
          </p>
        </div>

        <button
          onClick={() => setIsVideoMode(!isVideoMode)}
          className={`p-2 -mr-2 rounded-full transition ${
            isVideoMode ? 'text-[#1ed760]' : 'text-white/70 hover:text-white'
          }`}
          title="Video Mode"
        >
          <Tv className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Middle: Large Square Cover Art (Real Spotify proportions) */}
      <div className="my-auto px-4 py-2">
        <div className="relative aspect-square w-full max-w-[320px] mx-auto rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3. Bottom Controls Area */}
      <div className="space-y-4 pb-2">
        {/* Track Title, Artist, & Like */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-black text-white truncate">
              {currentTrack.title}
            </h2>
            <p className="text-sm text-[#b3b3b3] truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={() => toggleLike(currentTrack)}
            className={`p-2 transition ${
              liked ? 'text-[#1ed760]' : 'text-white/60 hover:text-white'
            }`}
          >
            <Heart className={`w-7 h-7 ${liked ? 'fill-[#1ed760]' : ''}`} />
          </button>
        </div>

        {/* Seek Bar & Timestamps */}
        <div className="space-y-1">
          <div className="relative flex items-center h-4 cursor-pointer">
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercent || 0}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-xs text-[#a7a7a7] font-mono">
            <span>{formatSecondsToTime(currentTime)}</span>
            <span>{duration > 0 ? formatSecondsToTime(duration) : currentTrack.duration}</span>
          </div>
        </div>

        {/* Playback Controls Deck */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition ${
              isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3]'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-white active:scale-95 transition"
          >
            <SkipBack className="w-8 h-8 fill-white" />
          </button>

          {/* Large Circular Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition shadow-2xl"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-black" />
            ) : (
              <Play className="w-7 h-7 fill-black ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-white active:scale-95 transition"
          >
            <SkipForward className="w-8 h-8 fill-white" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3]'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom Lyrics & Queue Pills */}
        <div className="flex items-center justify-between pt-2 px-2 text-white/70">
          <button
            onClick={() => {
              setIsLyricsOpen(true);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-full bg-white/10 hover:bg-white/20 transition active:scale-95"
          >
            <Mic2 className="w-4 h-4 text-[#1ed760]" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={() => {
              setIsQueueOpen(true);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-full bg-white/10 hover:bg-white/20 transition active:scale-95"
          >
            <ListMusic className="w-4 h-4 text-[#1ed760]" />
            <span>Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
