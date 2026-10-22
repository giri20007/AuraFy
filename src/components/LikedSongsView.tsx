'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import AudioVisualizer from './AudioVisualizer';
import { Play, Pause, Heart, Clock, Plus, ChevronLeft } from 'lucide-react';

export default function LikedSongsView() {
  const {
    likedTracks,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLike,
    addToQueue,
    setActiveView,
    setSelectedPlaylist,
  } = usePlayer();

  const isLikedPlaying =
    likedTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const totalSeconds = likedTracks.reduce((acc, t) => acc + (t.durationSeconds || 200), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="space-y-6 pb-36 md:pb-16 select-none">
      {/* Mobile Back Button */}
      <div className="md:hidden flex items-center pt-1">
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveView('library');
          }}
          className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 hover:text-white flex items-center gap-1.5 text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Signature Liked Songs Hero Header (Exact Spotify Style) */}
      <div className="relative -mx-3 sm:-mx-6 -mt-3 sm:-mt-16 px-4 sm:px-8 pt-6 sm:pt-20 pb-6 sm:pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 shadow-2xl bg-gradient-to-b from-[#450af5] via-[#450af5]/60 to-[#121212] transition-colors duration-500 rounded-b-2xl md:rounded-none">
        {/* Cover Art */}
        <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-md bg-gradient-to-br from-[#450af5] via-[#6520f5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-[0_8px_40px_rgba(69,10,245,0.5)]">
          <Heart className="w-20 h-20 sm:w-28 sm:h-28 text-white fill-white drop-shadow-md" />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-2 text-white text-center md:text-left min-w-0">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
            Playlist
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight">
            Liked Songs
          </h1>
          <p className="text-xs sm:text-sm text-white/70">
            Your personal collection of saved favorite tracks.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-white/90 mt-1">
            <span className="text-white font-bold">You</span>
            <span>•</span>
            <span>{likedTracks.length} songs</span>
            {likedTracks.length > 0 && (
              <>
                <span>•</span>
                <span className="text-white/70">about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      {likedTracks.length > 0 && (
        <div className="flex items-center gap-6 py-2">
          <button
            onClick={() => {
              if (isLikedPlaying) {
                togglePlayPause();
              } else {
                playTrack(likedTracks[0], likedTracks);
              }
            }}
            className="w-14 h-14 rounded-full bg-[#1ed760] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition"
            title={isLikedPlaying ? 'Pause' : 'Play All'}
          >
            {isLikedPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Tracklist Table */}
      {likedTracks.length > 0 ? (
        <div className="w-full">
          {/* Table Header Row (Sticky) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#a7a7a7] uppercase tracking-wider sticky top-16 bg-[#121212] z-10">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Artist / Channel</div>
            <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Track Rows */}
          <div className="mt-2 space-y-0.5">
            {likedTracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, likedTracks)}
                  className={`group flex md:grid md:grid-cols-12 md:gap-4 px-3 sm:px-4 py-2.5 rounded-md items-center justify-between cursor-pointer transition ${
                    isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Column 1: Index / Play Icon / Visualizer */}
                  <div className="hidden md:flex col-span-1 items-center justify-center text-sm font-medium text-[#b3b3b3]">
                    {isTrackPlaying ? (
                      <AudioVisualizer />
                    ) : (
                      <>
                        <span className={`group-hover:hidden ${isCurrent ? 'text-[#1ed760]' : ''}`}>
                          {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) {
                              togglePlayPause();
                            } else {
                              playTrack(track, likedTracks);
                            }
                          }}
                          className="hidden group-hover:inline-block text-white"
                        >
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Column 2: Thumbnail & Title/Artist */}
                  <div className="md:col-span-5 flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover shrink-0 shadow"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? 'text-[#1ed760]' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-[#a7a7a7] truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Artist */}
                  <div className="hidden md:block col-span-3 text-xs text-[#a7a7a7] truncate">
                    {track.artist}
                  </div>

                  {/* Column 4: Like, Queue, Duration */}
                  <div className="md:col-span-3 flex items-center justify-end gap-3 text-xs text-[#a7a7a7] font-mono shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track);
                      }}
                      className="p-1.5 text-[#1ed760] hover:scale-110 transition"
                      title="Remove from Liked Songs"
                    >
                      <Heart className="w-4 h-4 fill-[#1ed760]" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(track);
                      }}
                      className="hidden sm:block p-1 text-[#a7a7a7] hover:text-white transition"
                      title="Add to queue"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <span className="w-10 text-right">{track.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-white/40 space-y-3">
          <Heart className="w-12 h-12 mx-auto text-white/20" />
          <p className="text-base font-semibold text-white/70">Songs you like will appear here</p>
          <p className="text-xs">Tap the heart on any song to save it.</p>
        </div>
      )}
    </div>
  );
}
