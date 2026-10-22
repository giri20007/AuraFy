'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { GENRE_CATEGORIES } from '@/data/curatedPlaylists';
import { LANGUAGE_OPTIONS, LANGUAGE_ARTISTS, LANGUAGE_PLAYLISTS } from '@/data/languageData';
import { Track, MusicLanguage } from '@/types/music';
import { Play, Pause, Heart, Plus, Search, X, Loader2, Sparkles, Music2 } from 'lucide-react';

export default function SearchView() {
  const {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLike,
    isLiked,
    addToQueue,
  } = usePlayer();

  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when opening Search view if empty
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // Don't steal keyboard on mobile automatically to avoid abrupt viewport jumps, but focus on desktop
    if (!isMobile && searchInputRef.current && !searchQuery) {
      searchInputRef.current.focus();
    }
  }, []);

  // Fetch search results when query or language changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const langParam = selectedLanguage !== 'all' ? `&lang=${encodeURIComponent(selectedLanguage)}` : '';
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}${langParam}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.tracks || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedLanguage]);

  const topResult = searchResults[0];
  const songResults = searchResults.slice(0, 5);
  const remainingResults = searchResults.slice(5);

  const currentLangOption = LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0];
  const langArtists = LANGUAGE_ARTISTS[selectedLanguage] || LANGUAGE_ARTISTS.all;
  const langPlaylists = LANGUAGE_PLAYLISTS[selectedLanguage] || LANGUAGE_PLAYLISTS.all;
  const langTrendingTracks = langPlaylists.flatMap((p) => p.tracks);

  return (
    <div className="space-y-6 pb-36 md:pb-20 select-none">
      {/* 1. HUGE, PROMINENT, UNMISSABLE SEARCH BAR (Sticky Header) */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-3 bg-[#0d0d0f]/90 backdrop-blur-2xl border-b border-white/[0.08] space-y-3">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/60">
            <Search className="w-5 h-5 text-[#1DB954]" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            data-testid="main-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`What do you want to play? (${currentLangOption.nativeName})`}
            className="w-full bg-[#1e1e24]/90 hover:bg-[#282830] focus:bg-[#282830] text-white text-sm sm:text-base font-medium rounded-full pl-12 pr-11 py-3.5 outline-none focus:ring-2 focus:ring-[#1DB954] transition shadow-2xl border border-white/15 placeholder:text-white/40"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              data-testid="search-clear-button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. LANGUAGE PREFERENCE FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" data-testid="language-filter-bar">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                data-testid={`lang-pill-${lang.id}`}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-[#1DB954] text-black shadow-[#1DB954]/30 scale-105'
                    : 'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/10'
                }`}
              >
                <span>{lang.name}</span>
                {lang.nativeName !== lang.name && (
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-black/70' : 'text-white/40'}`}>
                    ({lang.nativeName})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-white/60 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
          <p className="text-xs sm:text-sm font-semibold tracking-wide">
            Searching high-fidelity 320kbps tracks in {currentLangOption.name}...
          </p>
        </div>
      )}

      {/* 4. SEARCH RESULTS DISPLAY */}
      {!isLoading && searchQuery && searchResults.length > 0 && (
        <div className="space-y-8 animate-fadeIn" data-testid="search-results-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Result Card */}
            {topResult && (
              <div className="lg:col-span-5 space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">Top result</h2>
                <div
                  data-testid="top-result-card"
                  onClick={() => playTrack(topResult, searchResults)}
                  className="group relative glass-card p-5 rounded-2xl cursor-pointer transition duration-300 flex flex-col justify-between h-64 border border-white/10 hover:border-white/25 shadow-xl"
                >
                  <div className="space-y-4">
                    <img
                      src={topResult.thumbnail}
                      alt={topResult.title}
                      className="w-24 h-24 rounded-2xl object-cover shadow-2xl border border-white/10"
                    />
                    <div>
                      <h3 className="text-2xl font-black text-white truncate group-hover:underline">
                        {topResult.title}
                      </h3>
                      <p className="text-xs text-[#a1a1aa] mt-1 font-medium">
                        Song • <span className="text-white font-bold">{topResult.artist}</span>
                      </p>
                      {topResult.album && (
                        <p className="text-[11px] text-white/50 truncate mt-0.5">
                          {topResult.album}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Big Circular Green Play Button */}
                  <button
                    data-testid="top-result-play-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentTrack?.id === topResult.id) {
                        togglePlayPause();
                      } else {
                        playTrack(topResult, searchResults);
                      }
                    }}
                    className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl shadow-[#1DB954]/40 opacity-90 group-hover:opacity-100 transition-all duration-200"
                  >
                    {currentTrack?.id === topResult.id && isPlaying ? (
                      <Pause className="w-6 h-6 fill-black" />
                    ) : (
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Top 5 Songs List */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-xl font-bold text-white tracking-tight">Songs</h2>
              <div className="space-y-1">
                {songResults.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={`${track.id}-${idx}`}
                      data-testid={`search-song-row-${idx}`}
                      onClick={() => playTrack(track, searchResults)}
                      className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                        isCurrent ? 'bg-white/15' : 'hover:bg-white/5 active:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-11 h-11 rounded-lg shrink-0 overflow-hidden bg-black/40 border border-white/10">
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute inset-0 bg-black/60 flex items-center justify-center transition ${
                              isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {isTrackPlaying ? (
                              <Pause className="w-4 h-4 fill-white text-white" />
                            ) : (
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pr-2">
                          <p
                            className={`text-sm font-bold truncate ${
                              isCurrent ? 'text-[#1DB954]' : 'text-white'
                            }`}
                          >
                            {track.title}
                          </p>
                          <p className="text-xs text-[#a1a1aa] truncate font-medium">
                            {track.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track);
                          }}
                          className={`p-1.5 transition ${
                            liked
                              ? 'text-[#1DB954]'
                              : 'text-white/40 hover:text-white'
                          }`}
                          title={liked ? 'Unlike' : 'Like'}
                        >
                          <Heart className={`w-4 h-4 ${liked ? 'fill-[#1DB954]' : ''}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(track);
                          }}
                          className="hidden sm:block p-1.5 text-white/40 hover:text-white transition"
                          title="Add to queue"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <span className="text-xs text-[#a1a1aa] w-10 text-right font-mono">
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* More Results Grid */}
          {remainingResults.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-white tracking-tight">More Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {remainingResults.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;

                  return (
                    <div
                      key={`more-${track.id}-${idx}`}
                      onClick={() => playTrack(track, searchResults)}
                      className="group glass-card p-3 rounded-2xl cursor-pointer transition flex flex-col relative"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-white/10 shadow">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) {
                              togglePlayPause();
                            } else {
                              playTrack(track, searchResults);
                            }
                          }}
                          className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all duration-300 ${
                            isTrackPlaying
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                          }`}
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-4 h-4 fill-black" />
                          ) : (
                            <Play className="w-4 h-4 fill-black ml-0.5" />
                          )}
                        </button>
                      </div>

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
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. NO RESULTS STATE */}
      {!isLoading && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-20 space-y-3 glass-card rounded-2xl p-6 border border-white/10">
          <p className="text-lg font-bold text-white">No results found for &quot;{searchQuery}&quot;</p>
          <p className="text-xs sm:text-sm text-[#a1a1aa] max-w-md mx-auto">
            Try switching your language chip above to &quot;All&quot; or check the spelling.
          </p>
          <button
            onClick={() => setSelectedLanguage('all')}
            className="mt-2 px-4 py-2 rounded-full bg-[#1DB954] text-black text-xs font-bold hover:scale-105 transition"
          >
            Search All Languages
          </button>
        </div>
      )}

      {/* 6. EMPTY SEARCH VIEW: TRENDING & GENRES FOR PREFERRED LANGUAGE */}
      {!searchQuery && (
        <div className="space-y-8 animate-fadeIn">
          {/* Trending Hits in Selected Language */}
          {langTrendingTracks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#1DB954]" />
                    <span>Trending in {currentLangOption.name}</span>
                  </h2>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    Original 320kbps full studio recordings
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {langTrendingTracks.slice(0, 6).map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, langTrendingTracks)}
                      className="group glass-card p-3 rounded-2xl cursor-pointer transition flex flex-col relative border border-white/5 hover:border-white/20"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-black/40 border border-white/10 shadow">
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
                              playTrack(track, langTrendingTracks);
                            }
                          }}
                          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all duration-300 ${
                            isTrackPlaying
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                          }`}
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-4 h-4 fill-black" />
                          ) : (
                            <Play className="w-4 h-4 fill-black ml-0.5" />
                          )}
                        </button>
                      </div>

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
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Popular Artists in Selected Language */}
          {langArtists.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Popular in {currentLangOption.name}
              </h2>
              <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
                {langArtists.map((artist) => {
                  const isCurrent = currentTrack?.id === artist.topTrack.id;
                  const isTrackPlaying = isCurrent && isPlaying;

                  return (
                    <div
                      key={artist.id}
                      onClick={() => playTrack(artist.topTrack)}
                      className="group w-36 shrink-0 md:w-auto glass-card p-3 rounded-2xl cursor-pointer transition flex flex-col items-center border border-white/5 hover:border-white/20"
                    >
                      <div className="relative aspect-square w-full rounded-full overflow-hidden mb-2.5 bg-black/40 shadow-lg border border-white/10">
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
                          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all duration-300 ${
                            isTrackPlaying
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                          }`}
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-4 h-4 fill-black" />
                          ) : (
                            <Play className="w-4 h-4 fill-black ml-0.5" />
                          )}
                        </button>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-white truncate w-full text-center">
                        {artist.name}
                      </h3>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5 font-medium">
                        Artist
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Browse All Genres */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Browse all genres
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {GENRE_CATEGORIES.map((genre) => (
                <div
                  key={genre.name}
                  onClick={() => setSearchQuery(genre.name)}
                  style={{
                    background: `linear-gradient(135deg, ${genre.color} 0%, ${genre.color}99 100%)`,
                  }}
                  className="relative h-32 sm:h-36 rounded-2xl p-3.5 sm:p-4 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg border border-white/10 group"
                >
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight max-w-[75%] drop-shadow">
                    {genre.name}
                  </h3>
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="absolute -bottom-2 -right-3 w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl rotate-[22deg] shadow-2xl group-hover:rotate-[26deg] group-hover:scale-105 transition-transform duration-300 border border-white/20"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
