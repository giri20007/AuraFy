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
    <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-between p-6 select-none animate-slide-up overflow-hidden backdrop-blur-3xl bg-[#09090b]/90">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-40 pointer-events-none transition-colors duration-1000"
        style={{
          backgroundColor: activeColor || '#8400e7',
        }}
      />

      {/* Top Header Bar with iOS Grab Handle */}
      <div className="relative z-10 flex flex-col items-center gap-2 pt-2">
        {/* iOS Grab Handle */}
        <div
          onClick={onClose}
          className="w-12 h-1.5 rounded-full bg-white/20 active:bg-white/40 cursor-pointer transition mb-1"
        />

        <div className="w-full flex items-center justify-between text-white">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-white/70 hover:text-white"
            title="Collapse"
          >
            <ChevronDown className="w-7 h-7" />
          </button>

          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">
              Playing from
            </p>
            <p className="text-xs font-bold text-white truncate max-w-[200px]">
              AuraFy Glass Stream
            </p>
          </div>

          <button
            onClick={() => setIsVideoMode(!isVideoMode)}
            className={`p-2 -mr-2 rounded-full transition ${
              isVideoMode ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'
            }`}
            title="Video Mode"
          >
            <Tv className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center: Large Floating iOS 17 Artwork */}
      <div className="relative z-10 my-auto px-4 py-4">
        <div
          className={`relative aspect-square w-full max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] border border-white/15 transition-transform duration-500 ${
            isPlaying ? 'scale-100' : 'scale-95 opacity-90'
          }`}
        >
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Area: Controls, Slider, Actions */}
      <div className="relative z-10 space-y-4 pb-2">
        {/* Track Title, Artist, & Like Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-black text-white truncate tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-sm text-[#a1a1aa] truncate mt-0.5 font-medium">
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={() => toggleLike(currentTrack)}
            className={`p-2 transition active:scale-90 ${
              liked ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'
            }`}
          >
            <Heart className={`w-7 h-7 ${liked ? 'fill-[#1DB954]' : ''}`} />
          </button>
        </div>

        {/* iOS 17 Fluid Seek Bar */}
        <div className="space-y-1.5">
          <div className="relative flex items-center h-4 cursor-pointer">
            <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
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

          <div className="flex justify-between text-xs text-[#a1a1aa] font-mono">
            <span>{formatSecondsToTime(currentTime)}</span>
            <span>{duration > 0 ? formatSecondsToTime(duration) : currentTrack.duration}</span>
          </div>
        </div>

        {/* Playback Controls Deck */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition ${
              isShuffle ? 'text-[#1DB954]' : 'text-[#a1a1aa]'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-white active:scale-90 transition"
          >
            <SkipBack className="w-8 h-8 fill-white" />
          </button>

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
            className="p-2 text-white active:scale-90 transition"
          >
            <SkipForward className="w-8 h-8 fill-white" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition ${
              repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-[#a1a1aa]'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom Glass Pills (Lyrics & Queue) */}
        <div className="flex items-center justify-between pt-2 px-1 text-white/80">
          <button
            onClick={() => {
              setIsLyricsOpen(true);
              onClose();
            }}
            className="flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-full glass-pill hover:bg-white/15 transition active:scale-95"
          >
            <Mic2 className="w-4 h-4 text-[#1DB954]" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={() => {
              setIsQueueOpen(true);
              onClose();
            }}
            className="flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-full glass-pill hover:bg-white/15 transition active:scale-95"
          >
            <ListMusic className="w-4 h-4 text-[#1DB954]" />
            <span>Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
