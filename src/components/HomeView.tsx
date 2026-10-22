'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS, TOP_ARTISTS } from '@/data/curatedPlaylists';
import { LANGUAGE_OPTIONS, LANGUAGE_ARTISTS, LANGUAGE_PLAYLISTS } from '@/data/languageData';
import { Track, Playlist, MusicLanguage } from '@/types/music';
import { Play, Pause, Heart, Search, Sparkles } from 'lucide-react';

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
    selectedLanguage,
    setSelectedLanguage,
  } = usePlayer();

  const [greeting, setGreeting] = useState<string>('Welcome');
  const [activeFilter, setActiveFilter] = useState<'all' | 'music' | 'podcasts'>('all');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const currentLangOption = LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];
  const langArtists = LANGUAGE_ARTISTS[selectedLanguage] || LANGUAGE_ARTISTS.all;
  const langPlaylists = LANGUAGE_PLAYLISTS[selectedLanguage] || LANGUAGE_PLAYLISTS.all;

  // Combine playlists for active view
  const displayPlaylists = [
    ...langPlaylists,
    ...(selectedLanguage === 'all' ? CURATED_PLAYLISTS : []),
  ];

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
    ...displayPlaylists.slice(0, 5).map((pl) => ({
      id: pl.id,
      title: pl.title,
      cover: pl.coverUrl,
      playlist: pl,
      tracks: pl.tracks,
    })),
  ];

  return (
    <div className="space-y-6 sm:space-y-7 pb-36 md:pb-16 select-none" data-testid="home-view">
      {/* 1. Spotify Signature Category Filter Pills + Language Selector */}
      <div className="space-y-3 pt-1">
        {/* Top Type Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('music')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'music'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setActiveFilter('podcasts')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'podcasts'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            Podcasts
          </button>
        </div>

        {/* Language Preference Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" data-testid="home-language-bar">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                data-testid={`home-lang-pill-${lang.id}`}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1DB954] text-black shadow-md shadow-[#1DB954]/25 scale-105'
                    : 'bg-white/[0.08] hover:bg-white/15 text-white/80 hover:text-white border border-white/5'
                }`}
              >
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Prominent Mobile Search Bar Trigger */}
      <div
        data-testid="home-search-trigger"
        onClick={() => setActiveView('search')}
        className="md:hidden glass-card p-3 rounded-full flex items-center gap-3 border border-white/15 hover:border-white/30 cursor-pointer shadow-lg bg-[#1e1e24]/80 active:scale-[0.98] transition"
      >
        <Search className="w-4 h-4 text-[#1DB954] ml-2 shrink-0" />
        <span className="text-xs text-white/60 font-medium truncate">
          Search songs, artists in {currentLangOption.name}...
        </span>
      </div>

      {/* 3. Greeting Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>{greeting}</span>
          {selectedLanguage !== 'all' && (
            <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-[#1DB954] border border-[#1DB954]/30">
              {currentLangOption.name}
            </span>
          )}
        </h1>
      </div>

      {/* 4. Quick Access Grid (Spotify Signature 6-Card Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3" data-testid="quick-access-grid">
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
              className="group flex items-center justify-between bg-white/[0.07] hover:bg-white/[0.14] rounded-md sm:rounded-lg overflow-hidden cursor-pointer transition-all duration-200 relative h-14 sm:h-16 shadow-md border border-white/5 hover:border-white/15"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
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

              {/* Green Play Button on Hover */}
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
                className={`mr-3 w-10 h-10 rounded-full bg-[#1ed760] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl transition-all duration-300 ${
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

      {/* 5. SECTION 1: Popular Artists (Circular Cards - Spotify Hallmark) */}
      <section className="space-y-3" data-testid="popular-artists-section">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight hover:underline cursor-pointer">
              Popular in {currentLangOption.name}
            </h2>
          </div>
          <button
            onClick={() => setActiveView('search')}
            className="text-xs font-bold text-[#b3b3b3] hover:text-white hover:underline uppercase tracking-wider shrink-0"
          >
            Show all
          </button>
        </div>

        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {langArtists.map((artist) => {
            const isCurrent = currentTrack?.id === artist.topTrack.id;
            const isTrackPlaying = isCurrent && isPlaying;

            return (
              <div
                key={artist.id}
                onClick={() => playTrack(artist.topTrack)}
                className="group w-36 shrink-0 md:w-auto bg-[#181818]/80 hover:bg-[#282828] p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center relative shadow-md border border-white/5 hover:border-white/15"
              >
                {/* Circular Artist Avatar with Floating Green Play Button */}
                <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 bg-[#282828] shadow-xl">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 rounded-full"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        togglePlayPause();
                      } else {
                        playTrack(artist.topTrack);
                      }
                    }}
                    className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1ed760] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl transition-all duration-300 ${
                      isTrackPlaying
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                    }`}
                  >
                    {isTrackPlaying ? (
                      <Pause className="w-5 h-5 fill-black" />
                    ) : (
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-sm text-white truncate w-full text-center">
                  {artist.name}
                </h3>
                <p className="text-xs text-[#a7a7a7] mt-0.5 font-normal">
                  Artist
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SECTION 2+: Curated Playlist Shelves (Albums & Playlists) */}
      {displayPlaylists.map((playlist) => (
        <section key={playlist.id} className="space-y-3" data-testid={`playlist-shelf-${playlist.id}`}>
          <div className="flex items-end justify-between">
            <div>
              <h2
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setActiveView('playlist');
                }}
                className="text-xl sm:text-2xl font-black text-white tracking-tight hover:underline cursor-pointer"
              >
                {playlist.title}
              </h2>
              <p className="text-xs text-[#a7a7a7] mt-0.5 line-clamp-1 hidden sm:block">
                {playlist.description}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPlaylist(playlist);
                setActiveView('playlist');
              }}
              className="text-xs font-bold text-[#b3b3b3] hover:text-white hover:underline uppercase tracking-wider shrink-0"
            >
              Show all
            </button>
          </div>

          {/* Cards Grid / Carousel */}
          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {playlist.tracks.map((track) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              const liked = isLiked(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, playlist.tracks)}
                  className="group w-36 shrink-0 md:w-auto bg-[#181818]/80 hover:bg-[#282828] p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col relative shadow-md border border-white/5 hover:border-white/15"
                >
                  {/* Square Album Cover with Green Hover Button */}
                  <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-lg">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Floating Green Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          togglePlayPause();
                        } else {
                          playTrack(track, playlist.tracks);
                        }
                      }}
                      className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1ed760] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl transition-all duration-300 ${
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
                      isCurrent ? 'text-[#1ed760]' : 'text-white'
                    }`}
                  >
                    {track.title}
                  </h3>
                  <p className="text-xs text-[#a7a7a7] truncate mt-1 line-clamp-2">
                    {track.artist}
                  </p>

                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    className={`absolute top-4 right-4 p-1.5 rounded-full bg-black/60 backdrop-blur-md transition ${
                      liked
                        ? 'opacity-100 text-[#1ed760]'
                        : 'opacity-0 group-hover:opacity-100 text-white/70 hover:text-white'
                    }`}
                    title={liked ? 'Unlike' : 'Like'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#1ed760]' : ''}`} />
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
