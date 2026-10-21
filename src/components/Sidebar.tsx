'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS } from '@/data/curatedPlaylists';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Disc3,
  Trash2,
} from 'lucide-react';

interface SidebarProps {
  onOpenCreateModal: () => void;
}

export default function Sidebar({ onOpenCreateModal }: SidebarProps) {
  const {
    activeView,
    setActiveView,
    selectedPlaylist,
    setSelectedPlaylist,
    likedTracks,
    customPlaylists,
    deletePlaylist,
  } = usePlayer();

  const [libraryFilter, setLibraryFilter] = useState<'all' | 'custom' | 'curated'>('all');

  const allPlaylists = [
    ...customPlaylists,
    ...CURATED_PLAYLISTS,
  ];

  const displayedPlaylists = allPlaylists.filter((pl) => {
    if (libraryFilter === 'custom') return pl.isCustom;
    if (libraryFilter === 'curated') return !pl.isCustom;
    return true;
  });

  return (
    <aside className="hidden md:flex w-64 md:w-72 flex-col h-full gap-2 p-2 select-none shrink-0">
      {/* Brand & Main Navigation Block with Glass UI */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
        {/* Brand */}
        <div
          onClick={() => {
            setActiveView('home');
            setSelectedPlaylist(null);
          }}
          className="flex items-center gap-2.5 px-1 py-1 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/30 group-hover:scale-105 transition-transform">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
            AuraFy
            <span className="text-[10px] glass-pill px-2 py-0.5 rounded-full text-[#1DB954] font-bold">
              Glass
            </span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 mt-1 font-semibold text-sm">
          <button
            onClick={() => {
              setActiveView('home');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeView === 'home' && !selectedPlaylist
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className={`w-5 h-5 ${activeView === 'home' && !selectedPlaylist ? 'text-[#1DB954]' : ''}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveView('search');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeView === 'search' && !selectedPlaylist
                ? 'bg-white/15 text-white font-bold shadow-sm'
                : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className={`w-5 h-5 ${activeView === 'search' && !selectedPlaylist ? 'text-[#1DB954]' : ''}`} />
            <span>Search</span>
          </button>
        </nav>
      </div>

      {/* Library Section with Glass UI */}
      <div className="glass-panel rounded-2xl flex-1 flex flex-col min-h-0 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 pb-2 flex items-center justify-between">
          <div
            onClick={() => {
              setActiveView('library');
              setSelectedPlaylist(null);
            }}
            className="flex items-center gap-3 text-[#a1a1aa] hover:text-white cursor-pointer transition"
          >
            <Library className="w-5 h-5" />
            <span className="font-bold text-sm">Your Library</span>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-white/10 rounded-full transition"
            title="Create playlist"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setLibraryFilter('all')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              libraryFilter === 'all'
                ? 'bg-white text-black shadow'
                : 'glass-pill text-[#a1a1aa] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setLibraryFilter('custom')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              libraryFilter === 'custom'
                ? 'bg-white text-black shadow'
                : 'glass-pill text-[#a1a1aa] hover:text-white'
            }`}
          >
            By You
          </button>
          <button
            onClick={() => setLibraryFilter('curated')}
            className={`px-3 py-1 rounded-full font-bold transition ${
              libraryFilter === 'curated'
                ? 'bg-white text-black shadow'
                : 'glass-pill text-[#a1a1aa] hover:text-white'
            }`}
          >
            Curated
          </button>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {/* Liked Songs Special Tile */}
          <div
            onClick={() => {
              setActiveView('liked');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition group ${
              activeView === 'liked'
                ? 'bg-white/15'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${
                activeView === 'liked' ? 'text-[#1DB954]' : 'text-white'
              }`}>
                Liked Songs
              </p>
              <p className="text-xs text-[#a1a1aa] truncate mt-0.5">
                Playlist • {likedTracks.length} song{likedTracks.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* List of custom & curated playlists */}
          {displayedPlaylists.map((pl) => {
            const isSelected = selectedPlaylist?.id === pl.id;
            return (
              <div
                key={pl.id}
                onClick={() => {
                  setSelectedPlaylist(pl);
                  setActiveView('playlist');
                }}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition group ${
                  isSelected ? 'bg-white/15' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    className="w-11 h-11 rounded-lg object-cover shrink-0 shadow border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${
                        isSelected ? 'text-[#1DB954]' : 'text-white'
                      }`}
                    >
                      {pl.title}
                    </p>
                    <p className="text-xs text-[#a1a1aa] truncate mt-0.5">
                      {pl.isCustom ? 'Custom' : 'Curated'} • {pl.tracks.length} song{pl.tracks.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                {pl.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-white/50 hover:text-red-400 rounded transition"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
