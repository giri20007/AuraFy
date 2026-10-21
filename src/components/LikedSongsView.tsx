'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
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
    <div className="space-y-6 pb-32 md:pb-16 select-none">
      {/* Mobile Back Button */}
      <div className="md:hidden flex items-center pt-1">
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveView('library');
          }}
          className="p-2 -ml-2 text-white/80 hover:text-white flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Signature Liked Songs Hero Header */}
      <div className="relative -mx-3 sm:-mx-6 -mt-4 sm:-mt-16 px-4 sm:px-6 pt-6 sm:pt-20 pb-6 sm:pb-8 flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-6 shadow-2xl bg-gradient-to-b from-[#450af5] to-[#121212] transition-colors duration-500 rounded-b-2xl md:rounded-none">
        {/* Cover Art */}
        <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl bg-gradient-to-br from-[#450af5] via-[#6520f5] to-[#8e8ee5] flex items-center justify-center shrink-0 shadow-2xl">
          <Heart className="w-16 h-16 sm:w-24 sm:h-24 text-white fill-white drop-shadow-md" />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-1.5 sm:gap-2 text-white text-center md:text-left min-w-0">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-white/80">
            Playlist
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Liked Songs
          </h1>
          <p className="text-xs sm:text-sm text-white/70">
            Your personal collection of saved favorite tracks.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-white/90 mt-1">
            <span className="text-white font-bold">giri20007</span>
            <span>•</span>
            <span>{likedTracks.length} songs</span>
            {likedTracks.length > 0 && (
              <>
                <span>•</span>
                <span className="text-white/70">{totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      {likedTracks.length > 0 && (
        <div className="flex items-center justify-between py-1">
          <button
            onClick={() => {
              if (isLikedPlaying) {
                togglePlayPause();
              } else {
                playTrack(likedTracks[0], likedTracks);
              }
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition"
            title={isLikedPlaying ? 'Pause' : 'Play All'}
          >
            {isLikedPlaying ? (
              <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-black" />
            ) : (
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Tracklist Table */}
      {likedTracks.length > 0 ? (
        <div className="w-full">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Artist / Channel</div>
            <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Track Rows */}
          <div className="mt-2 space-y-1">
            {likedTracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, likedTracks)}
                  className={`group flex md:grid md:grid-cols-12 md:gap-4 px-2 sm:px-4 py-2.5 rounded-lg items-center justify-between cursor-pointer transition ${
                    isCurrent ? 'bg-white/10' : 'hover:bg-white/5 active:bg-white/15'
                  }`}
                >
                  {/* Desktop Index */}
                  <div className="hidden md:block col-span-1 text-center text-sm font-medium text-[#b3b3b3]">
                    <span className={`group-hover:hidden ${isCurrent ? 'text-[#1DB954]' : ''}`}>
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
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Thumbnail & Title */}
                  <div className="md:col-span-5 flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-11 h-11 md:w-10 md:h-10 rounded-md object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? 'text-[#1DB954]' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Artist */}
                  <div className="hidden md:block col-span-3 text-xs text-[#b3b3b3] truncate">
                    {track.artist}
                  </div>

                  {/* Actions & Duration */}
                  <div className="md:col-span-3 flex items-center justify-end gap-3 text-xs text-[#b3b3b3] font-mono shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track);
                      }}
                      className="p-1.5 text-[#1DB954] hover:scale-110 transition"
                      title="Remove from Liked Songs"
                    >
                      <Heart className="w-4 h-4 fill-[#1DB954]" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(track);
                      }}
                      className="hidden sm:block p-1 text-[#b3b3b3] hover:text-white transition"
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
