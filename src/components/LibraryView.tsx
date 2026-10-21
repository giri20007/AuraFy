'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS } from '@/data/curatedPlaylists';
import { Heart, Plus, Trash2, Library, Disc3 } from 'lucide-react';

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
    <div className="space-y-6 pb-28 md:pb-16 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Library className="w-8 h-8 text-[#1DB954]" />
          <h1 className="text-3xl font-black text-white tracking-tight">
            Your Library
          </h1>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition flex items-center justify-center"
          title="Create playlist"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('custom')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            filter === 'custom'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          By You
        </button>
        <button
          onClick={() => setFilter('curated')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
            filter === 'curated'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Curated
        </button>
      </div>

      {/* Playlists List */}
      <div className="space-y-2">
        {/* Liked Songs Special Tile */}
        {(filter === 'all' || filter === 'custom') && (
          <div
            onClick={() => {
              setActiveView('liked');
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition group"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-md">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white group-hover:text-[#1DB954] transition truncate">
                  Liked Songs
                </p>
                <p className="text-xs text-[#b3b3b3] truncate mt-0.5">
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
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition group"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <img
                src={pl.coverUrl}
                alt={pl.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white group-hover:text-[#1DB954] transition truncate">
                  {pl.title}
                </p>
                <p className="text-xs text-[#b3b3b3] truncate mt-0.5">
                  {pl.isCustom ? 'Custom Playlist' : 'Playlist'} • {pl.tracks.length} song{pl.tracks.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {pl.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(pl.id);
                }}
                className="p-2 text-white/40 hover:text-red-400 rounded-full transition"
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
