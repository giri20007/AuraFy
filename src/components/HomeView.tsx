'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS } from '@/data/curatedPlaylists';
import { Track, Playlist } from '@/types/music';
import { Play, Pause, Heart, Sparkles } from 'lucide-react';

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

  // Quick access cards
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
    <div className="space-y-8 pb-12">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {greeting}
        </h1>
      </div>

      {/* Quick Access 6-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              className="group flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer transition duration-300 relative"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.isLikedTile ? (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shrink-0">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                ) : (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-16 h-16 object-cover shrink-0"
                  />
                )}
                <span className="font-bold text-sm text-white truncate pr-2">
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
                className={`mr-4 w-11 h-11 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all duration-300 ${
                  isItemPlaying
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                }`}
                title={isItemPlaying ? 'Pause' : 'Play'}
              >
                {isItemPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Curated Playlist Shelves */}
      {CURATED_PLAYLISTS.map((playlist) => (
        <section key={playlist.id} className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setActiveView('playlist');
                }}
                className="text-2xl font-bold text-white hover:underline cursor-pointer"
              >
                {playlist.title}
              </h2>
              <p className="text-xs text-[#b3b3b3] mt-1 line-clamp-1">
                {playlist.description}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPlaylist(playlist);
                setActiveView('playlist');
              }}
              className="text-xs font-bold text-[#b3b3b3] hover:underline uppercase tracking-wider"
            >
              Show all
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {playlist.tracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              const liked = isLiked(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, playlist.tracks)}
                  className="group bg-[#181818] hover:bg-[#282828] p-3.5 rounded-lg cursor-pointer transition-all duration-300 flex flex-col relative"
                >
                  {/* Thumbnail & Floating Play Button */}
                  <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828]">
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
                      className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl transition-all duration-300 ${
                        isTrackPlaying
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                      }`}
                      title={isTrackPlaying ? 'Pause' : 'Play'}
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Track Info */}
                  <h3
                    className={`font-bold text-sm truncate ${
                      isCurrent ? 'text-[#1DB954]' : 'text-white'
                    }`}
                  >
                    {track.title}
                  </h3>
                  <p className="text-xs text-[#b3b3b3] truncate mt-1">
                    {track.artist}
                  </p>

                  {/* Like button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    className={`absolute top-5 right-5 p-1.5 rounded-full bg-black/60 backdrop-blur-sm transition ${
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
