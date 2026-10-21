'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS } from '@/data/curatedPlaylists';
import { Heart, Plus, Trash2, Library } from 'lucide-react';

interface LibraryViewProps {
  onOpenCreateModal: () => void;
}

export default function LibraryView({ onOpenCreateModal }: LibraryViewProps) {
  const {
    likedTracks,
    customPlaylists,
    setSelectedPlaylist,
    setActiveView,
    deletePlaylist,
  } = usePlayer();

  const [filter, setFilter] = useState<'all' | 'custom' | 'curated'>('all');

  const allPlaylists = [...customPlaylists, ...CURATED_PLAYLISTS];
  const displayedPlaylists = allPlaylists.filter((pl) => {
    if (filter === 'custom') return pl.isCustom;
    if (filter === 'curated') return !pl.isCustom;
    return true;
  });

  return (
    <div className="space-y-6 pb-36 md:pb-16 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/30">
            <Library className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Library
          </h1>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="p-2.5 glass-pill hover:bg-white/15 text-white rounded-full transition flex items-center justify-center active:scale-95 shadow"
          title="Create playlist"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Pills with Glass UI */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            filter === 'all'
              ? 'bg-white text-black shadow'
              : 'glass-pill text-[#a1a1aa] hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('custom')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            filter === 'custom'
              ? 'bg-white text-black shadow'
              : 'glass-pill text-[#a1a1aa] hover:text-white'
          }`}
        >
          By You
        </button>
        <button
          onClick={() => setFilter('curated')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            filter === 'curated'
              ? 'bg-white text-black shadow'
              : 'glass-pill text-[#a1a1aa] hover:text-white'
          }`}
        >
          Curated
        </button>
      </div>

      {/* Playlists List with Glass Cards */}
      <div className="space-y-2.5">
        {/* Liked Songs Special Tile */}
        {(filter === 'all' || filter === 'custom') && (
          <div
            onClick={() => setActiveView('liked')}
            className="flex items-center justify-between p-3 rounded-2xl glass-card cursor-pointer transition group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-lg shadow-[#450af5]/30">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white group-hover:text-[#1DB954] transition truncate">
                  Liked Songs
                </p>
                <p className="text-xs text-[#a1a1aa] truncate mt-0.5 font-medium">
                  Playlist • {likedTracks.length} song{likedTracks.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Playlists */}
        {displayedPlaylists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => {
              setSelectedPlaylist(pl);
              setActiveView('playlist');
            }}
            className="flex items-center justify-between p-3 rounded-2xl glass-card cursor-pointer transition group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <img
                src={pl.coverUrl}
                alt={pl.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 shadow border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white group-hover:text-[#1DB954] transition truncate">
                  {pl.title}
                </p>
                <p className="text-xs text-[#a1a1aa] truncate mt-0.5 font-medium">
                  {pl.isCustom ? 'Custom Playlist' : 'Curated'} • {pl.tracks.length} song{pl.tracks.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {pl.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(pl.id);
                }}
                className="p-2 text-white/40 hover:text-red-400 rounded-full transition active:scale-90"
                title="Delete playlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
