'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, ListMusic } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

export default function QueueDrawer() {
  const {
    currentTrack,
    queue,
    removeFromQueue,
    clearQueue,
    playTrack,
    isQueueOpen,
    setIsQueueOpen,
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <aside className="fixed top-0 right-0 bottom-0 md:bottom-22 w-full sm:w-96 glass-dock shadow-2xl z-50 flex flex-col p-5 animate-slide-left border-l border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black shadow-md shadow-[#1DB954]/30">
            <ListMusic className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-base tracking-tight">Play Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-[#a1a1aa] hover:text-white font-bold px-2.5 py-1 rounded-full glass-pill transition"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 text-[#a1a1aa] hover:text-white rounded-full glass-pill transition active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {/* Currently Playing */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
            Now Playing
          </h3>
          {currentTrack ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/15 border border-white/10">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0 shadow border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1DB954] truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-[#a1a1aa] truncate mt-0.5 font-medium">
                  {currentTrack.artist}
                </p>
              </div>
              <AudioVisualizer />
            </div>
          ) : (
            <p className="text-xs text-white/40 italic">Nothing playing right now</p>
          )}
        </div>

        {/* Next Up */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
              Next in Queue ({queue.length})
            </h3>
          </div>

          {queue.length > 0 ? (
            <div className="space-y-1.5">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
                  onClick={() => {
                    const remaining = queue.filter((_, idx) => idx !== index);
                    playTrack(track, remaining);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs text-[#a1a1aa] w-4 text-center font-mono font-bold">
                      {index + 1}
                    </span>
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 shadow border border-white/10"
                    />
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#1DB954]">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#a1a1aa] truncate mt-0.5 font-medium">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#a1a1aa] font-mono">
                      {track.duration}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-[#a1a1aa] hover:text-red-400 transition"
                      title="Remove from queue"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-white/40 space-y-1">
              <p className="text-xs font-semibold">Queue is empty</p>
              <p className="text-[11px]">Hover over any song and click &quot;+&quot; to queue it up next.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
