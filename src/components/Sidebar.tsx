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
  Trash2,
  ArrowUpDown,
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
    <aside className="hidden md:flex w-64 md:w-72 flex-col h-full gap-2 p-2 select-none shrink-0 bg-black">
      {/* 1. Top Panel: Spotify Logo + Home + Search */}
      <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-5 shadow-lg border border-white/[0.04]">
        {/* Spotify / AuraFy Logo */}
        <div
          onClick={() => {
            setActiveView('home');
            setSelectedPlaylist(null);
          }}
          className="flex items-center gap-2 cursor-pointer group px-1"
        >
          {/* Authentic Spotify Icon */}
          <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center text-black shadow-md shadow-[#1ed760]/30 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10s10-4.476 10-10c0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.208-2.35-1.435-5.308-1.76-8.792-.963-.334.077-.67-.13-.746-.464-.077-.334.13-.67.464-.746 3.808-.87 7.076-.496 9.723 1.119.294.18.387.562.208.846zm1.225-2.724c-.226.367-.71.482-1.077.256-2.69-1.654-6.79-2.134-9.97-1.168-.413.125-.853-.107-.978-.52-.125-.413.107-.853.52-.978 3.633-1.103 8.147-.568 11.249 1.333.367.226.482.71.256 1.077zm.105-2.835C14.692 8.95 8.085 8.732 4.24 9.9c-.496.15-1.022-.134-1.173-.63-.15-.496.134-1.022.63-1.173 4.417-1.34 11.73-1.082 15.568 1.196.446.265.592.842.327 1.288-.265.446-.842.592-1.288.327z"/>
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Spotify
          </span>
        </div>

        {/* Home & Search Links */}
        <nav className="flex flex-col gap-3 font-bold text-sm">
          <button
            onClick={() => {
              setActiveView('home');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-4 transition-colors duration-200 ${
              activeView === 'home' && !selectedPlaylist
                ? 'text-white'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveView('search');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-4 transition-colors duration-200 ${
              activeView === 'search' && !selectedPlaylist
                ? 'text-white'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Search className="w-6 h-6" />
            <span>Search</span>
          </button>
        </nav>
      </div>

      {/* 2. Bottom Panel: Your Library */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col min-h-0 overflow-hidden shadow-lg border border-white/[0.04]">
        {/* Header */}
        <div className="p-4 pb-3 flex items-center justify-between">
          <div
            onClick={() => {
              setActiveView('library');
              setSelectedPlaylist(null);
            }}
            className="flex items-center gap-3 text-[#b3b3b3] hover:text-white cursor-pointer transition font-bold text-sm"
          >
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="p-1.5 text-[#b3b3b3] hover:text-white hover:bg-white/10 rounded-full transition"
            title="Create playlist"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setLibraryFilter('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition ${
              libraryFilter === 'all'
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setLibraryFilter('custom')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition ${
              libraryFilter === 'custom'
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            By You
          </button>
          <button
            onClick={() => setLibraryFilter('curated')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition ${
              libraryFilter === 'curated'
                ? 'bg-white text-black'
                : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            Spotify
          </button>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {/* Liked Songs Tile */}
          <div
            onClick={() => {
              setActiveView('liked');
              setSelectedPlaylist(null);
            }}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition group ${
              activeView === 'liked' ? 'bg-white/15' : 'hover:bg-white/5'
            }`}
          >
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  activeView === 'liked' ? 'text-[#1ed760]' : 'text-white'
                }`}
              >
                Liked Songs
              </p>
              <p className="text-xs text-[#a7a7a7] truncate mt-0.5">
                Playlist • {likedTracks.length} song{likedTracks.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* List of playlists */}
          {displayedPlaylists.map((pl) => {
            const isSelected = selectedPlaylist?.id === pl.id;
            return (
              <div
                key={pl.id}
                onClick={() => {
                  setSelectedPlaylist(pl);
                  setActiveView('playlist');
                }}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition group ${
                  isSelected ? 'bg-white/15' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    className="w-12 h-12 rounded-md object-cover shrink-0 shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isSelected ? 'text-[#1ed760]' : 'text-white'
                      }`}
                    >
                      {pl.title}
                    </p>
                    <p className="text-xs text-[#a7a7a7] truncate mt-0.5">
                      Playlist • {pl.isCustom ? 'You' : 'Spotify'}
                    </p>
                  </div>
                </div>

                {pl.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#b3b3b3] hover:text-red-400 rounded transition"
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
