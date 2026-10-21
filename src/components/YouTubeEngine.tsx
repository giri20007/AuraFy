'use client';

import React, { useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, Maximize2 } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function YouTubeEngine() {
  const {
    currentTrack,
    nextTrack,
    registerPlayer,
    isVideoMode,
    setIsVideoMode,
  } = usePlayer();

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    // Load YouTube IFrame API script if not loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    function initPlayer() {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      playerRef.current = new window.YT.Player('yt-player-element', {
        height: '100%',
        width: '100%',
        videoId: currentTrack?.id || '',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: (event: any) => {
            registerPlayer(event.target);
            event.target.setVolume(80);
          },
          onStateChange: (event: any) => {
            // 0 = Ended
            if (event.data === 0) {
              nextTrack();
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player Error code:', event.data);
            // On error (e.g. video blocked or unavailable), try next track
            setTimeout(() => {
              nextTrack();
            }, 1500);
          },
        },
      });
    }
  }, [registerPlayer, nextTrack]);

  return (
    <div
      ref={containerRef}
      className={`fixed transition-all duration-300 z-50 rounded-xl overflow-hidden shadow-2xl border border-white/10 ${
        isVideoMode
          ? 'bottom-28 right-6 w-80 sm:w-96 aspect-video bg-black/90 backdrop-blur-md opacity-100 scale-100'
          : 'pointer-events-none opacity-0 scale-95 bottom-0 right-0 w-1 h-1 -z-50'
      }`}
    >
      {/* Header bar when visible in Video Mode */}
      {isVideoMode && (
        <div className="absolute top-0 inset-x-0 h-9 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-3 z-10 text-xs text-white/80">
          <span className="font-medium truncate max-w-[200px]">
            {currentTrack?.title || 'YouTube Player'}
          </span>
          <button
            onClick={() => setIsVideoMode(false)}
            className="p-1 hover:text-white rounded-full hover:bg-white/10 transition"
            title="Hide Video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* The YouTube iframe element */}
      <div id="yt-player-element" className="w-full h-full" />
    </div>
  );
}
