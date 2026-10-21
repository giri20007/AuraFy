'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, Trash2, ListMusic, Play } from 'lucide-react';
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
    <aside className="fixed top-0 right-0 bottom-24 w-80 sm:w-96 bg-[#121212] border-l border-white/10 shadow-2xl z-40 flex flex-col p-4 animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white">
          <ListMusic className="w-5 h-5 text-[#1DB954]" />
          <h2 className="font-bold text-base">Play Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-[#b3b3b3] hover:text-white font-medium px-2 py-1 rounded hover:bg-white/10 transition"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1 text-[#b3b3b3] hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {/* Currently Playing */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
            Now Playing
          </h3>
          {currentTrack ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1DB954] truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-[#b3b3b3] truncate">
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
            <h3 className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
              Next in Queue ({queue.length})
            </h3>
          </div>

          {queue.length > 0 ? (
            <div className="space-y-1">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition cursor-pointer"
                  onClick={() => {
                    const remaining = queue.filter((_, idx) => idx !== index);
                    playTrack(track, remaining);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs text-[#b3b3b3] w-4 text-center font-mono">
                      {index + 1}
                    </span>
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-[#1DB954]">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#b3b3b3] truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#b3b3b3] font-mono">
                      {track.duration}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-[#b3b3b3] hover:text-red-400 transition"
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
              <p className="text-xs font-medium">Queue is empty</p>
              <p className="text-[11px]">Hover over any song and click &quot;+&quot; to queue it up next.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
