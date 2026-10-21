'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { GENRE_CATEGORIES } from '@/data/curatedPlaylists';
import { Track } from '@/types/music';
import { Play, Pause, Heart, Plus, Search, Loader2 } from 'lucide-react';

export default function SearchView() {
  const {
    searchQuery,
    setSearchQuery,
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.tracks || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const topResult = searchResults[0];
  const songResults = searchResults.slice(0, 5);
  const remainingResults = searchResults.slice(5);

  return (
    <div className="space-y-6 sm:space-y-8 pb-36 md:pb-16 select-none">
      {/* Search Categories when empty */}
      {!searchQuery && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Browse all
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {GENRE_CATEGORIES.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setSearchQuery(genre.name)}
                style={{
                  background: `linear-gradient(135deg, ${genre.color} 0%, ${genre.color}99 100%)`,
                }}
                className="relative h-32 sm:h-40 rounded-2xl p-3.5 sm:p-4 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg border border-white/10 group"
              >
                <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight max-w-[75%] drop-shadow">
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
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-white/50 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
          <p className="text-xs sm:text-sm font-medium">Finding songs & albums...</p>
        </div>
      )}

      {/* Results Display */}
      {!isLoading && searchQuery && searchResults.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Result Card */}
            {topResult && (
              <div className="lg:col-span-5 space-y-3">
                <h2 className="text-xl font-bold text-white">Top result</h2>
                <div
                  onClick={() => playTrack(topResult, searchResults)}
                  className="group relative glass-card p-5 rounded-2xl cursor-pointer transition duration-300 flex flex-col justify-between h-56 border border-white/10"
                >
                  <div className="space-y-3">
                    <img
                      src={topResult.thumbnail}
                      alt={topResult.title}
                      className="w-24 h-24 rounded-2xl object-cover shadow-xl border border-white/10"
                    />
                    <div>
                      <h3 className="text-2xl font-black text-white truncate group-hover:underline">
                        {topResult.title}
                      </h3>
                      <p className="text-xs text-[#a1a1aa] mt-1 font-medium">
                        Song • <span className="text-white font-bold">{topResult.artist}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentTrack?.id === topResult.id) {
                        togglePlayPause();
                      } else {
                        playTrack(topResult, searchResults);
                      }
                    }}
                    className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl shadow-[#1DB954]/30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
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

            {/* Top 5 Songs */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-xl font-bold text-white">Songs</h2>
              <div className="space-y-1">
                {songResults.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, searchResults)}
                      className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                        isCurrent ? 'bg-white/15' : 'hover:bg-white/5 active:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-black/40 border border-white/10">
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

                      <div className="flex items-center gap-2 sm:gap-3">
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
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold text-white">More Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {remainingResults.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={track.id}
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
                          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition-all duration-300 ${
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

      {/* No results */}
      {!isLoading && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-20 space-y-2">
          <p className="text-lg font-bold text-white">No results found for &quot;{searchQuery}&quot;</p>
          <p className="text-xs text-[#a1a1aa]">
            Please check the spelling or search for another artist, track, or genre.
          </p>
        </div>
      )}
    </div>
  );
}
