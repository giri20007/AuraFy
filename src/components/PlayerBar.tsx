'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { formatSecondsToTime } from '@/lib/utils';
import AudioVisualizer from './AudioVisualizer';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Mic2,
  ListMusic,
  Tv,
  Maximize2,
  Laptop2,
} from 'lucide-react';

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
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
  } = usePlayer();

  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [isHoveringVol, setIsHoveringVol] = useState(false);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const targetSeconds = (newPercent / 100) * duration;
    seekTo(targetSeconds);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <footer className="hidden md:flex h-[90px] bg-black border-t border-[#282828] px-4 items-center justify-between select-none z-50">
      {/* 1. LEFT: Track Info (30%) */}
      <div className="flex items-center gap-3.5 w-[30%] min-w-[180px] max-w-[340px]">
        {currentTrack ? (
          <>
            <div className="relative group shrink-0">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-md object-cover shadow"
              />
              <button
                onClick={() => setIsVideoMode(!isVideoMode)}
                className={`absolute inset-0 bg-black/60 rounded-md flex items-center justify-center transition ${
                  isVideoMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                title="Toggle Video Mode"
              >
                <Tv className={`w-5 h-5 ${isVideoMode ? 'text-[#1ed760]' : 'text-white'}`} />
              </button>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </span>
              <span className="text-xs text-[#b3b3b3] truncate hover:underline hover:text-white cursor-pointer mt-0.5">
                {currentTrack.artist}
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => toggleLike(currentTrack)}
                className={`p-1 transition rounded-full hover:scale-110 active:scale-95 ${
                  liked ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
                }`}
                title={liked ? 'Remove from Your Library' : 'Save to Your Library'}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-[#1ed760]' : ''}`} />
              </button>
              <AudioVisualizer />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 opacity-30">
            <div className="w-14 h-14 rounded-md bg-[#282828] flex items-center justify-center">
              <Play className="w-5 h-5 text-white/40" />
            </div>
            <div className="text-xs text-[#b3b3b3]">
              <p className="font-semibold text-white/70">No song playing</p>
              <p>Pick a track to start</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. CENTER: Playback Deck & Progress Bar (40%) */}
      <div className="flex flex-col items-center gap-1.5 w-[40%] max-w-2xl px-2">
        {/* Buttons Deck */}
        <div className="flex items-center gap-5">
          {/* Shuffle with Spotify Green Active Dot */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleShuffle}
              className={`p-1 transition ${
                isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            {isShuffle && <span className="w-1 h-1 rounded-full bg-[#1ed760] -mt-0.5" />}
          </div>

          <button
            onClick={prevTrack}
            className="p-1 text-[#b3b3b3] hover:text-white transition active:scale-95"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* White Circular Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1 text-[#b3b3b3] hover:text-white transition active:scale-95"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat with Spotify Green Active Dot */}
          <div className="flex flex-col items-center">
            <button
              onClick={toggleRepeat}
              className={`p-1 transition ${
                repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
            {repeatMode !== 'off' && <span className="w-1 h-1 rounded-full bg-[#1ed760] -mt-0.5" />}
          </div>
        </div>

        {/* Progress Bar & Timestamps (Exact Spotify Look) */}
        <div className="w-full flex items-center gap-2 text-xs text-[#a7a7a7] font-mono">
          <span className="w-10 text-right">
            {formatSecondsToTime(currentTime)}
          </span>

          <div
            className="relative flex-1 flex items-center group py-1.5 cursor-pointer"
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
          >
            {/* Background Track */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className={`h-full transition-colors ${
                  isHoveringSeek ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Slider Dot on Hover */}
            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow pointer-events-none transition-opacity ${
                isHoveringSeek ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: `calc(${progressPercent}% - 6px)`,
              }}
            />

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

          <span className="w-10 text-left">
            {duration > 0 ? formatSecondsToTime(duration) : currentTrack?.duration || '0:00'}
          </span>
        </div>
      </div>

      {/* 3. RIGHT: Auxiliary Controls (30%) */}
      <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
        {/* Lyrics */}
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-1.5 transition ${
            isLyricsOpen ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
          }`}
          title="Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-1.5 transition ${
            isQueueOpen ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Connect Device */}
        <button
          className="p-1.5 text-[#b3b3b3] hover:text-white transition hidden lg:block"
          title="Connect to a device"
        >
          <Laptop2 className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div
          className="flex items-center gap-1.5 group"
          onMouseEnter={() => setIsHoveringVol(true)}
          onMouseLeave={() => setIsHoveringVol(false)}
        >
          <button
            onClick={toggleMute}
            className="p-1 text-[#b3b3b3] hover:text-white transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : volume < 50 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative w-24 flex items-center cursor-pointer">
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  isHoveringVol ? 'bg-[#1ed760]' : 'bg-white'
                } transition-colors`}
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
            </div>

            {/* Volume thumb dot on hover */}
            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow pointer-events-none transition-opacity ${
                isHoveringVol ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: `calc(${isMuted ? 0 : volume}% - 6px)`,
              }}
            />

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-[#b3b3b3] hover:text-white transition hidden md:block"
          title="Full screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
