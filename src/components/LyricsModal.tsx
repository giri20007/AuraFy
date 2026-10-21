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
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: activeColor || '#1e3264',
        backgroundImage: `linear-gradient(180deg, ${activeColor} 0%, #000000 100%)`,
      }}
    >
      {/* Top Header */}
      <div className="h-20 px-8 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <Mic2 className="w-6 h-6 text-[#1DB954]" />
          <div>
            <h2 className="font-extrabold text-lg line-clamp-1">
              {currentTrack?.title || 'Lyrics'}
            </h2>
            <p className="text-xs text-white/70">
              {currentTrack?.artist}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition"
          title="Close lyrics"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Lyrics Body */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-16 md:px-24 py-12 flex flex-col items-start select-none no-scrollbar">
        {isLoading ? (
          <div className="m-auto flex flex-col items-center gap-4 text-white/70">
            <Loader2 className="w-10 h-10 animate-spin text-[#1DB954]" />
            <p className="font-bold text-lg">Finding lyrics...</p>
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
                  className={`text-2xl sm:text-3xl md:text-4xl font-extrabold cursor-pointer transition-all duration-300 transform origin-left leading-relaxed ${
                    isActive
                      ? 'text-white scale-105 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]'
                      : isPast
                      ? 'text-white/40 hover:text-white/70'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        ) : plainLyrics ? (
          <div className="m-auto max-w-2xl text-center text-white/80 whitespace-pre-line text-lg sm:text-xl font-medium leading-loose">
            {plainLyrics}
          </div>
        ) : (
          <div className="m-auto text-center text-white/60 space-y-2">
            <Music className="w-12 h-12 mx-auto text-white/30" />
            <p className="text-xl font-bold">Looks like we don&apos;t have the lyrics for this song yet.</p>
            <p className="text-sm">Enjoy the music!</p>
          </div>
        )}
      </div>

      {/* Bottom Footer Spacing (above player bar) */}
      <div className="h-24 shrink-0 pointer-events-none" />
    </div>
  );
}
