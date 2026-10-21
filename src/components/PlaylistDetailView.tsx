'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Playlist, Track } from '@/types/music';
import {
  Play,
  Pause,
  Heart,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
} from 'lucide-react';

interface PlaylistDetailViewProps {
  playlist: Playlist;
}

export default function PlaylistDetailView({ playlist }: PlaylistDetailViewProps) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleLike,
    isLiked,
    addToQueue,
    removeTrackFromPlaylist,
    setActiveView,
    setSelectedPlaylist,
  } = usePlayer();

  const isCurrentPlaylist =
    playlist.tracks.some((t) => t.id === currentTrack?.id);
  const isPlaylistPlaying = isCurrentPlaylist && isPlaying;

  const totalSeconds = playlist.tracks.reduce((acc, t) => acc + (t.durationSeconds || 200), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="space-y-6 pb-32 md:pb-16 select-none">
      {/* Mobile Back Button */}
      <div className="md:hidden flex items-center pt-1">
        <button
          onClick={() => {
            setSelectedPlaylist(null);
            setActiveView('home');
          }}
          className="p-2 -ml-2 text-white/80 hover:text-white flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Header with Dynamic Gradient */}
      <div
        className="relative -mx-3 sm:-mx-6 -mt-4 sm:-mt-16 px-4 sm:px-6 pt-6 sm:pt-20 pb-6 sm:pb-8 flex flex-col md:flex-row items-center md:items-end gap-5 sm:gap-6 shadow-2xl transition-colors duration-500 rounded-b-2xl md:rounded-none"
        style={{
          background: `linear-gradient(180deg, ${playlist.accentColor} 0%, #121212 100%)`,
        }}
      >
        {/* Cover Art */}
        <div className="relative group shrink-0 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-2xl">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-1.5 sm:gap-2 text-white text-center md:text-left min-w-0">
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-white/80">
            {playlist.isCustom ? 'Custom Playlist' : 'Playlist'}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight line-clamp-2">
            {playlist.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/70 line-clamp-2 max-w-2xl">
            {playlist.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-white/90 mt-1">
            <span className="text-white font-bold">AuraFy</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
            <span>•</span>
            <span className="text-white/70">{totalMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => {
            if (playlist.tracks.length === 0) return;
            if (isPlaylistPlaying) {
              togglePlayPause();
            } else if (isCurrentPlaylist && currentTrack) {
              togglePlayPause();
            } else {
              playTrack(playlist.tracks[0], playlist.tracks);
            }
          }}
          disabled={playlist.tracks.length === 0}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 disabled:opacity-50 text-black flex items-center justify-center shadow-xl transition"
          title={isPlaylistPlaying ? 'Pause' : 'Play'}
        >
          {isPlaylistPlaying ? (
            <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-black" />
          ) : (
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Tracklist Table */}
      {playlist.tracks.length > 0 ? (
        <div className="w-full">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Album / Artist</div>
            <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Track rows (Responsive for both mobile & desktop) */}
          <div className="mt-2 space-y-1">
            {playlist.tracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              const liked = isLiked(track.id);

              return (
                <div
                  key={`${track.id}-${index}`}
                  onClick={() => playTrack(track, playlist.tracks)}
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
                          playTrack(track, playlist.tracks);
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

                  {/* Desktop Album */}
                  <div className="hidden md:block col-span-3 text-xs text-[#b3b3b3] truncate">
                    {track.album || track.artist}
                  </div>

                  {/* Actions & Duration */}
                  <div className="md:col-span-3 flex items-center justify-end gap-3 text-xs text-[#b3b3b3] font-mono shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track);
                      }}
                      className={`p-1.5 transition ${
                        liked
                          ? 'text-[#1DB954]'
                          : 'text-[#b3b3b3] hover:text-white'
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
                      className="hidden sm:block p-1 text-[#b3b3b3] hover:text-white transition"
                      title="Add to queue"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {playlist.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrackFromPlaylist(playlist.id, track.id);
                        }}
                        className="p-1 text-white/40 hover:text-red-400 transition"
                        title="Remove from this playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <span className="w-10 text-right">{track.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-white/40 space-y-2">
          <p className="text-base font-semibold text-white/70">This playlist is empty</p>
          <p className="text-xs">Search for songs and add them here!</p>
        </div>
      )}
    </div>
  );
}
