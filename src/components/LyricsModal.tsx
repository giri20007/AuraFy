'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { LyricLine } from '@/types/music';
import { X, Mic2, Loader2, Music } from 'lucide-react';

export default function LyricsModal() {
  const {
    currentTrack,
    currentTime,
    seekTo,
    isLyricsOpen,
    setIsLyricsOpen,
    activeColor,
  } = usePlayer();

  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [plainLyrics, setPlainLyrics] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentTrack || !isLyricsOpen) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(
      `/api/lyrics?title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(
        currentTrack.artist
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setLyrics(data.lyrics || []);
        setPlainLyrics(data.plainLyrics || '');
      })
      .catch((err) => {
        console.error('Failed to load lyrics:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentTrack, isLyricsOpen]);

  // Find active line index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smooth scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!isLyricsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden backdrop-blur-3xl bg-[#09090b]/85 transition-colors duration-700">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 pointer-events-none transition-colors duration-1000"
        style={{
          backgroundColor: activeColor || '#8400e7',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 h-20 px-6 sm:px-12 flex items-center justify-between text-white shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center">
            <Mic2 className="w-5 h-5 text-[#1DB954]" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg line-clamp-1">
              {currentTrack?.title || 'Lyrics'}
            </h2>
            <p className="text-xs text-[#a1a1aa] font-medium">
              {currentTrack?.artist}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="w-10 h-10 rounded-full glass-pill flex items-center justify-center hover:bg-white/15 transition active:scale-95"
          title="Close lyrics"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Lyrics Body */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 py-12 flex flex-col items-start select-none no-scrollbar">
        {isLoading ? (
          <div className="m-auto flex flex-col items-center gap-4 text-white/70">
            <Loader2 className="w-10 h-10 animate-spin text-[#1DB954]" />
            <p className="font-bold text-base sm:text-lg">Finding lyrics from LRCLIB...</p>
          </div>
        ) : lyrics.length > 0 ? (
          <div className="space-y-6 max-w-4xl w-full">
            {lyrics.map((line, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;

              return (
                <div
                  key={`${line.time}-${index}`}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seekTo(line.time)}
                  className={`text-2xl sm:text-3xl md:text-4xl font-black cursor-pointer transition-all duration-300 transform origin-left leading-relaxed ${
                    isActive
                      ? 'text-white scale-105 drop-shadow-[0_0_24px_rgba(255,255,255,0.8)]'
                      : isPast
                      ? 'text-white/35 hover:text-white/70'
                      : 'text-white/20 hover:text-white/60'
                  }`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        ) : plainLyrics ? (
          <div className="m-auto max-w-2xl text-center text-white/80 whitespace-pre-line text-lg sm:text-xl font-semibold leading-loose">
            {plainLyrics}
          </div>
        ) : (
          <div className="m-auto text-center text-white/60 space-y-2">
            <Music className="w-12 h-12 mx-auto text-white/30" />
            <p className="text-xl font-bold">No synchronized lyrics found for this track</p>
            <p className="text-xs text-[#a1a1aa]">Enjoy the audio!</p>
          </div>
        )}
      </div>

      <div className="h-20 shrink-0 pointer-events-none" />
    </div>
  );
}
