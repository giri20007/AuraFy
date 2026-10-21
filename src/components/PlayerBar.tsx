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
    activeColor,
  } = usePlayer();

  const [isHoveringSeek, setIsHoveringSeek] = useState(false);

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
    <footer className="hidden md:flex h-22 bg-[#09090b]/80 backdrop-blur-3xl border-t border-white/10 px-5 items-center justify-between select-none z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {/* LEFT: Currently Playing Track Info */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[200px] max-w-[320px]">
        {currentTrack ? (
          <>
            <div className="relative group shrink-0">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-xl object-cover shadow-lg border border-white/10"
              />
              <button
                onClick={() => setIsVideoMode(!isVideoMode)}
                className={`absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center transition ${
                  isVideoMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                title="Toggle Video Mode"
              >
                <Tv className={`w-5 h-5 ${isVideoMode ? 'text-[#1DB954]' : 'text-white'}`} />
              </button>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </span>
              <span className="text-xs text-[#a1a1aa] truncate hover:underline hover:text-white cursor-pointer mt-0.5">
                {currentTrack.artist}
              </span>
            </div>

            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => toggleLike(currentTrack)}
                className={`p-1.5 transition rounded-full hover:scale-110 active:scale-90 ${
                  liked ? 'text-[#1DB954]' : 'text-white/40 hover:text-white'
                }`}
                title={liked ? 'Remove from Liked' : 'Save to Liked'}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-[#1DB954]' : ''}`} />
              </button>
              <AudioVisualizer />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 opacity-40">
            <div className="w-14 h-14 rounded-xl glass-panel flex items-center justify-center">
              <Play className="w-5 h-5 text-white/40" />
            </div>
            <div className="text-xs text-[#a1a1aa]">
              <p className="font-semibold text-white/70">No song playing</p>
              <p>Pick a track to start</p>
            </div>
          </div>
        )}
      </div>

      {/* CENTER: Player Controls & Scrub Bar */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-4">
        {/* Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 transition rounded-full ${
              isShuffle ? 'text-[#1DB954]' : 'text-[#a1a1aa] hover:text-white'
            }`}
            title={isShuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-1 text-[#a1a1aa] hover:text-white transition hover:scale-105 active:scale-95"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition shadow-xl"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1 text-[#a1a1aa] hover:text-white transition hover:scale-105 active:scale-95"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 transition rounded-full ${
              repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-[#a1a1aa] hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="w-full flex items-center gap-2.5 text-xs text-[#a1a1aa] font-mono">
          <span className="w-10 text-right">
            {formatSecondsToTime(currentTime)}
          </span>

          <div
            className="relative flex-1 flex items-center group py-1.5 cursor-pointer"
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
          >
            <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className={`h-full transition-colors duration-150 ${
                  isHoveringSeek ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div
              className={`absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none transition-opacity ${
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

      {/* RIGHT: Extra Controls */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[170px]">
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-2 rounded-full transition ${
            isLyricsOpen ? 'text-[#1DB954] bg-white/10' : 'text-[#a1a1aa] hover:text-white'
          }`}
          title="Synced Karaoke Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-full transition ${
            isQueueOpen ? 'text-[#1DB954] bg-white/10' : 'text-[#a1a1aa] hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-1.5 group">
          <button
            onClick={toggleMute}
            className="p-1 text-[#a1a1aa] hover:text-white transition"
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

          <div className="relative w-20 sm:w-24 flex items-center">
            <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1ed760] transition-colors"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
            </div>
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

        <button
          onClick={toggleFullscreen}
          className="p-2 text-[#a1a1aa] hover:text-white transition hidden md:block"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
