'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS, TOP_ARTISTS } from '@/data/curatedPlaylists';
import { LANGUAGE_OPTIONS, LANGUAGE_ARTISTS, LANGUAGE_PLAYLISTS } from '@/data/languageData';
import { Track, Playlist, MusicLanguage } from '@/types/music';
import { Play, Pause, Heart, Search, Sparkles, Disc3, Radio, Flame, Award } from 'lucide-react';

interface HomeFeedData {
  tidalTopTracks: Track[];
  globalChartTracks: Track[];
  regionalTrendingTracks: Track[];
  newAlbums: Array<{
    id: string;
    title: string;
    artist: string;
    cover: string;
    year: string;
    type: string;
  }>;
}

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
  const [homeFeed, setHomeFeed] = useState<HomeFeedData | null>(null);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Fetch real dynamic feed from /api/home (Tidal + JioSaavn + Deezer)
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingFeed(true);

    async function loadFeed() {
      try {
        const res = await fetch(`/api/home?lang=${encodeURIComponent(selectedLanguage)}`);
        if (res.ok) {
          const data: HomeFeedData = await res.json();
          if (!isCancelled) {
            setHomeFeed(data);
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic home feed:', err);
      } finally {
        if (!isCancelled) setIsLoadingFeed(false);
      }
    }

    loadFeed();
    return () => {
      isCancelled = true;
    };
  }, [selectedLanguage]);

  const currentLangOption = LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];
  const langArtists = LANGUAGE_ARTISTS[selectedLanguage] || LANGUAGE_ARTISTS.all;
  const langPlaylists = LANGUAGE_PLAYLISTS[selectedLanguage] || LANGUAGE_PLAYLISTS.all;

  // Real tracks from dynamic API with static fallback
  const tidalTracks: Track[] =
    homeFeed?.tidalTopTracks && homeFeed.tidalTopTracks.length > 0
      ? homeFeed.tidalTopTracks
      : langPlaylists[0]?.tracks || CURATED_PLAYLISTS[0].tracks;

  const regionalTracks: Track[] =
    homeFeed?.regionalTrendingTracks && homeFeed.regionalTrendingTracks.length > 0
      ? homeFeed.regionalTrendingTracks
      : langPlaylists[0]?.tracks || CURATED_PLAYLISTS[0].tracks;

  const globalTracks: Track[] =
    homeFeed?.globalChartTracks && homeFeed.globalChartTracks.length > 0
      ? homeFeed.globalChartTracks
      : CURATED_PLAYLISTS[0].tracks;

  const newAlbums = homeFeed?.newAlbums || [];

  interface QuickAccessItem {
    id: string;
    title: string;
    cover: string;
    subtitle?: string;
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
    {
      id: 'tidal-quick',
      title: 'TIDAL Top Hits',
      cover: tidalTracks[0]?.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
      tracks: tidalTracks,
    },
    {
      id: 'regional-quick',
      title: `Trending ${currentLangOption.name}`,
      cover: regionalTracks[0]?.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
      tracks: regionalTracks,
    },
    ...CURATED_PLAYLISTS.slice(0, 3).map((pl) => ({
      id: pl.id,
      title: pl.title,
      cover: pl.coverUrl,
      playlist: pl,
      tracks: pl.tracks,
    })),
  ];

  return (
    <div className="space-y-7 pb-36 md:pb-20 select-none" data-testid="home-view">
      {/* 1. Category Filter Pills + Language Selector */}
      <div className="space-y-3 pt-1">
        {/* Category Pills */}
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

      {/* 4. Quick Access Grid (6 Distinct Items) */}
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
                } else if (item.tracks.length > 0) {
                  playTrack(item.tracks[0], item.tracks);
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

      {/* 5. SHELF 1: TIDAL Top Tracks / Global Hits */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#1ed760]" />
              <span>TIDAL Top Tracks & Global Hits</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-[#00ffff] border border-[#00ffff]/30 tracking-wider">
                HiFi Lossless
              </span>
            </h2>
            <p className="text-xs text-[#a7a7a7] mt-0.5">
              Live chartbusters streamed from TIDAL & global masters
            </p>
          </div>
          <button
            onClick={() => {
              if (tidalTracks.length > 0) playTrack(tidalTracks[0], tidalTracks);
            }}
            className="text-xs font-bold text-[#b3b3b3] hover:text-white hover:underline uppercase tracking-wider shrink-0"
          >
            Play all
          </button>
        </div>

        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {tidalTracks.slice(0, 8).map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && isPlaying;
            const liked = isLiked(track.id);

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, tidalTracks)}
                className="group w-36 shrink-0 md:w-auto bg-[#181818]/80 hover:bg-[#282828] p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col relative shadow-md border border-white/5 hover:border-white/15"
              >
                <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-lg">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-[#00ffff] border border-[#00ffff]/30">
                    HiFi
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        togglePlayPause();
                      } else {
                        playTrack(track, tidalTracks);
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

                <h3
                  className={`font-bold text-sm truncate ${
                    isCurrent ? 'text-[#1ed760]' : 'text-white'
                  }`}
                >
                  {track.title}
                </h3>
                <p className="text-xs text-[#a7a7a7] truncate mt-1">
                  {track.artist}
                </p>

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
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#1ed760]' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SHELF 2: Trending Regional Songs (320kbps Masters) */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1ed760]" />
              <span>Trending in {currentLangOption.name}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-[#1ed760] border border-[#1ed760]/30 tracking-wider">
                320 kbps Master
              </span>
            </h2>
            <p className="text-xs text-[#a7a7a7] mt-0.5">
              Original full-length studio recordings in your preferred language
            </p>
          </div>
          <button
            onClick={() => {
              if (regionalTracks.length > 0) playTrack(regionalTracks[0], regionalTracks);
            }}
            className="text-xs font-bold text-[#b3b3b3] hover:text-white hover:underline uppercase tracking-wider shrink-0"
          >
            Play all
          </button>
        </div>

        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {regionalTracks.slice(0, 8).map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isTrackPlaying = isCurrent && isPlaying;
            const liked = isLiked(track.id);

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, regionalTracks)}
                className="group w-36 shrink-0 md:w-auto bg-[#181818]/80 hover:bg-[#282828] p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col relative shadow-md border border-white/5 hover:border-white/15"
              >
                <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-lg">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-[#1ed760] border border-[#1ed760]/30">
                    MASTER
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        togglePlayPause();
                      } else {
                        playTrack(track, regionalTracks);
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

                <h3
                  className={`font-bold text-sm truncate ${
                    isCurrent ? 'text-[#1ed760]' : 'text-white'
                  }`}
                >
                  {track.title}
                </h3>
                <p className="text-xs text-[#a7a7a7] truncate mt-1">
                  {track.artist}
                </p>

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
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#1ed760]' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. SHELF 3: Popular Artists (Circular Cards) */}
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

      {/* 8. SHELF 4: TIDAL New Albums & Fresh Drops */}
      {newAlbums.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-[#00ffff]" />
                <span>New Releases & Fresh Albums</span>
              </h2>
              <p className="text-xs text-[#a7a7a7] mt-0.5">
                Official new releases curated directly from TIDAL catalog
              </p>
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {newAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  // Search this album in SearchView
                  setActiveView('search');
                }}
                className="group w-36 shrink-0 md:w-auto bg-[#181818]/80 hover:bg-[#282828] p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col relative shadow-md border border-white/5 hover:border-white/15"
              >
                <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-lg">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white/90">
                    {album.year}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white truncate group-hover:underline">
                  {album.title}
                </h3>
                <p className="text-xs text-[#a7a7a7] truncate mt-1">
                  {album.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. SHELF 5+: Curated Themed Playlists */}
      {CURATED_PLAYLISTS.map((playlist) => (
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
                  <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828] shadow-lg">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

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
