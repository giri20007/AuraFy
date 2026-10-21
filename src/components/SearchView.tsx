'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { GENRE_CATEGORIES } from '@/data/curatedPlaylists';
import { Track } from '@/types/music';
import { Play, Pause, Heart, Plus, Clock, Search, Loader2 } from 'lucide-react';

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
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const topResult = searchResults[0];
  const songResults = searchResults.slice(0, 5);
  const remainingResults = searchResults.slice(5);

  return (
    <div className="space-y-8 pb-16">
      {/* Search Input Indicator (if user is just browsing) */}
      {!searchQuery && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Browse all
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {GENRE_CATEGORIES.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setSearchQuery(genre.name)}
                style={{ backgroundColor: genre.color }}
                className="relative h-44 rounded-xl p-4 overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-md group"
              >
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug max-w-[70%]">
                  {genre.name}
                </h3>
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="absolute -bottom-2 -right-4 w-28 h-28 object-cover rounded-md rotate-[25deg] shadow-2xl group-hover:rotate-[28deg] group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-white/50 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
          <p className="text-sm">Searching YouTube Music...</p>
        </div>
      )}

      {/* Search Results Display */}
      {!isLoading && searchQuery && searchResults.length > 0 && (
        <div className="space-y-8">
          {/* Top Result + Top 5 Songs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Result Card */}
            {topResult && (
              <div className="lg:col-span-5 space-y-3">
                <h2 className="text-2xl font-bold text-white">Top result</h2>
                <div
                  onClick={() => playTrack(topResult, searchResults)}
                  className="group relative bg-[#181818] hover:bg-[#282828] p-5 rounded-xl cursor-pointer transition duration-300 flex flex-col justify-between h-56"
                >
                  <div className="space-y-3">
                    <img
                      src={topResult.thumbnail}
                      alt={topResult.title}
                      className="w-24 h-24 rounded-lg object-cover shadow-lg"
                    />
                    <div>
                      <h3 className="text-2xl font-black text-white truncate group-hover:underline">
                        {topResult.title}
                      </h3>
                      <p className="text-sm text-[#b3b3b3] mt-1">
                        Song • <span className="text-white font-medium">{topResult.artist}</span>
                      </p>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentTrack?.id === topResult.id) {
                        togglePlayPause();
                      } else {
                        playTrack(topResult, searchResults);
                      }
                    }}
                    className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
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

            {/* Top 5 Songs list */}
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-2xl font-bold text-white">Songs</h2>
              <div className="space-y-1">
                {songResults.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, searchResults)}
                      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                        isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-10 h-10 rounded shrink-0 overflow-hidden bg-[#282828]">
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute inset-0 bg-black/60 flex items-center justify-center transition ${
                              isTrackPlaying
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
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
                            className={`text-sm font-semibold truncate ${
                              isCurrent ? 'text-[#1DB954]' : 'text-white'
                            }`}
                          >
                            {track.title}
                          </p>
                          <p className="text-xs text-[#b3b3b3] truncate">
                            {track.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track);
                          }}
                          className={`p-1 transition ${
                            liked
                              ? 'text-[#1DB954]'
                              : 'opacity-0 group-hover:opacity-100 text-[#b3b3b3] hover:text-white'
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
                          className="p-1 opacity-0 group-hover:opacity-100 text-[#b3b3b3] hover:text-white transition"
                          title="Add to queue"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <span className="text-xs text-[#b3b3b3] w-10 text-right font-mono">
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Remaining Results Grid */}
          {remainingResults.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-white">More Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {remainingResults.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isTrackPlaying = isCurrent && isPlaying;
                  const liked = isLiked(track.id);

                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track, searchResults)}
                      className="group bg-[#181818] hover:bg-[#282828] p-3.5 rounded-lg cursor-pointer transition flex flex-col relative"
                    >
                      <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#282828]">
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
                            <Pause className="w-5 h-5 fill-black" />
                          ) : (
                            <Play className="w-5 h-5 fill-black ml-0.5" />
                          )}
                        </button>
                      </div>

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
          <p className="text-xl font-bold text-white">No results found for &quot;{searchQuery}&quot;</p>
          <p className="text-sm text-[#b3b3b3]">
            Please make sure words are spelled correctly, or try searching for another artist or song.
          </p>
        </div>
      )}
    </div>
  );
}
