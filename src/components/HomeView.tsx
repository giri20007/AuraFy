'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS } from '@/data/curatedPlaylists';
import { Track, Playlist } from '@/types/music';
import { Play, Pause, Heart } from 'lucide-react';

export default function HomeView() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    setSelectedPlaylist,
    setActiveView,
    likedTracks,
    toggleLike,
    isLiked,
  } = usePlayer();

  const [greeting, setGreeting] = useState<string>('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  interface QuickAccessItem {
    id: string;
    title: string;
    cover: string;
    isLikedTile?: boolean;
    playlist?: Playlist;
    tracks: Track[];
  }

  const quickAccessItems: QuickAccessItem[] = [
    {
      id: 'liked-quick',
      title: 'Liked Songs',
      cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80',
      isLikedTile: true,
      tracks: likedTracks,
    },
    ...CURATED_PLAYLISTS.slice(0, 5).map((pl) => ({
      id: pl.id,
      title: pl.title,
      cover: pl.coverUrl,
      playlist: pl,
      tracks: pl.tracks,
    })),
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-36 md:pb-16 select-none">
      {/* Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {greeting}
        </h1>
      </div>

      {/* Quick Access Grid (Glass Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
        {quickAccessItems.map((item) => {
          const isItemPlaying =
            item.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.isLikedTile) {
                  setActiveView('liked');
                } else if (item.playlist) {
                  setSelectedPlaylist(item.playlist);
                  setActiveView('playlist');
                }
              }}
              className="group flex items-center justify-between glass-card rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 relative h-14 sm:h-16"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                {item.isLikedTile ? (
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0">
                    <Heart className="w-6 sm:w-7 h-6 sm:h-7 text-white fill-white" />
                  </div>
                ) : (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-14 sm:w-16 h-14 sm:h-16 object-cover shrink-0"
                  />
                )}
                <span className="font-bold text-xs sm:text-sm text-white truncate pr-2">
                  {item.title}
                </span>
              </div>

              {/* Hover play button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.tracks.length > 0) {
                    if (isItemPlaying) {
                      togglePlayPause();
                    } else {
                      playTrack(item.tracks[0], item.tracks);
                    }
                  }
                }}
                className={`hidden sm:flex mr-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black items-center justify-center shadow-lg shadow-[#1DB954]/30 transition-all duration-300 ${
                  isItemPlaying
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                }`}
                title={isItemPlaying ? 'Pause' : 'Play'}
              >
                {isItemPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Curated Playlist Shelves (Horizontal touch carousels on mobile, Responsive Glass grid on desktop) */}
      {CURATED_PLAYLISTS.map((playlist) => (
        <section key={playlist.id} className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setActiveView('playlist');
                }}
                className="text-lg sm:text-2xl font-black text-white hover:underline cursor-pointer tracking-tight"
              >
                {playlist.title}
              </h2>
              <p className="text-xs text-[#a1a1aa] mt-0.5 line-clamp-1 hidden sm:block">
                {playlist.description}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPlaylist(playlist);
                setActiveView('playlist');
              }}
              className="text-xs font-bold text-[#a1a1aa] hover:text-white hover:underline uppercase tracking-wider shrink-0"
            >
              Show all
            </button>
          </div>

          {/* Cards with iOS 17 Liquid Glass Look */}
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {playlist.tracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              const liked = isLiked(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, playlist.tracks)}
                  className="group w-36 shrink-0 md:w-auto glass-card p-3 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col relative"
                >
                  {/* Thumbnail & Floating Play Button */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-white/10 shadow-md">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Floating Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          togglePlayPause();
                        } else {
                          playTrack(track, playlist.tracks);
                        }
                      }}
                      className={`absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-[#1DB954]/40 transition-all duration-300 ${
                        isTrackPlaying
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                      }`}
                      title={isTrackPlaying ? 'Pause' : 'Play'}
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-black" />
                      ) : (
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Track Info */}
                  <h3
                    className={`font-bold text-xs sm:text-sm truncate ${
                      isCurrent ? 'text-[#1DB954]' : 'text-white'
                    }`}
                  >
                    {track.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#a1a1aa] truncate mt-0.5 font-medium">
                    {track.artist}
                  </p>

                  {/* Like button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    className={`absolute top-4 right-4 p-1.5 rounded-full glass-pill backdrop-blur-md transition ${
                      liked
                        ? 'opacity-100 text-[#1DB954]'
                        : 'opacity-0 group-hover:opacity-100 text-white/70 hover:text-white'
                    }`}
                    title={liked ? 'Unlike' : 'Like'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#1DB954]' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
