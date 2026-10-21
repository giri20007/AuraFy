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
    <div
      className="md:hidden fixed inset-0 z-50 flex flex-col justify-between p-6 select-none animate-slide-up overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${activeColor || '#1e3264'} 0%, #121212 60%, #0a0a0a 100%)`,
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-white pt-2">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-white/80 hover:text-white"
          title="Collapse"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        <div className="text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">
            Playing from
          </p>
          <p className="text-xs font-bold text-white truncate max-w-[200px]">
            AuraFy YouTube Stream
          </p>
        </div>

        <button
          onClick={() => setIsVideoMode(!isVideoMode)}
          className={`p-2 -mr-2 rounded-full transition ${
            isVideoMode ? 'text-[#1DB954]' : 'text-white/70 hover:text-white'
          }`}
          title="Video Mode"
        >
          <Tv className="w-5 h-5" />
        </button>
      </div>

      {/* Middle: Big Album Art */}
      <div className="my-auto px-4 py-6">
        <div className="relative aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="space-y-4 pb-4">
        {/* Track Title, Artist, & Like */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-white truncate">
              {currentTrack.title}
            </h2>
            <p className="text-sm text-[#b3b3b3] truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>

          <button
            onClick={() => toggleLike(currentTrack)}
            className={`p-2 transition ${
              liked ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-[#1DB954]' : ''}`} />
          </button>
        </div>

        {/* Seek Bar & Timestamps */}
        <div className="space-y-1.5">
          <div className="relative flex items-center h-4 cursor-pointer">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
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
        <div className="flex items-center justify-between px-2 pt-2">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition ${
              isShuffle ? 'text-[#1DB954]' : 'text-[#b3b3b3]'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-white active:scale-95 transition"
          >
            <SkipBack className="w-7 h-7 fill-white" />
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
            className="p-2 text-white active:scale-95 transition"
          >
            <SkipForward className="w-7 h-7 fill-white" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition ${
              repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-[#b3b3b3]'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom Auxiliary Buttons (Lyrics & Queue) */}
        <div className="flex items-center justify-between pt-2 px-3 text-white/70">
          <button
            onClick={() => {
              setIsLyricsOpen(true);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <Mic2 className="w-4 h-4 text-[#1DB954]" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={() => {
              setIsQueueOpen(true);
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ListMusic className="w-4 h-4 text-[#1DB954]" />
            <span>Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
