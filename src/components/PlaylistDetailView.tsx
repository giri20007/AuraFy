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
  Sparkles,
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
  } = usePlayer();

  const isCurrentPlaylist =
    playlist.tracks.some((t) => t.id === currentTrack?.id);
  const isPlaylistPlaying = isCurrentPlaylist && isPlaying;

  // Calculate total seconds
  const totalSeconds = playlist.tracks.reduce((acc, t) => acc + (t.durationSeconds || 200), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Header with Dynamic Gradient */}
      <div
        className="relative -mx-6 -mt-16 px-6 pt-20 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 shadow-2xl transition-colors duration-500"
        style={{
          background: `linear-gradient(180deg, ${playlist.accentColor} 0%, #121212 100%)`,
        }}
      >
        {/* Cover Art */}
        <div className="relative group shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-2xl">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-2 text-white">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
            {playlist.isCustom ? 'Custom Playlist' : 'Playlist'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight line-clamp-2">
            {playlist.title}
          </h1>
          <p className="text-sm text-white/70 line-clamp-2 max-w-2xl">
            {playlist.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90 mt-2">
            <span className="text-white font-bold">AuraFy</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
            <span>•</span>
            <span className="text-white/70">about {totalMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center gap-6 py-2">
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
          className="w-14 h-14 rounded-full bg-[#1DB954] hover:scale-105 active:scale-95 disabled:opacity-50 text-black flex items-center justify-center shadow-xl transition"
          title={isPlaylistPlaying ? 'Pause' : 'Play'}
        >
          {isPlaylistPlaying ? (
            <Pause className="w-7 h-7 fill-black" />
          ) : (
            <Play className="w-7 h-7 fill-black ml-1" />
          )}
        </button>
      </div>

      {/* Tracklist Table */}
      {playlist.tracks.length > 0 ? (
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6 md:col-span-5">Title</div>
            <div className="col-span-3 hidden md:block">Album / Artist</div>
            <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-2 pr-2">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="mt-2 space-y-1">
            {playlist.tracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              const liked = isLiked(track.id);

              return (
                <div
                  key={`${track.id}-${index}`}
                  onClick={() => playTrack(track, playlist.tracks)}
                  className={`group grid grid-cols-12 gap-4 px-4 py-2.5 rounded-lg items-center cursor-pointer transition ${
                    isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Column 1: Index / Play Icon */}
                  <div className="col-span-1 text-center text-sm font-medium text-[#b3b3b3]">
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

                  {/* Column 2: Track Art & Title */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 pr-2">
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

                  {/* Column 3: Album / Channel */}
                  <div className="col-span-3 hidden md:block text-xs text-[#b3b3b3] truncate">
                    {track.album || track.artist}
                  </div>

                  {/* Column 4: Actions & Duration */}
                  <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-3 text-xs text-[#b3b3b3] font-mono">
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

                    {playlist.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrackFromPlaylist(playlist.id, track.id);
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition"
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
          <p className="text-lg font-semibold text-white/70">This playlist is empty</p>
          <p className="text-sm">Search for songs and click &quot;+&quot; to add tracks to this playlist!</p>
        </div>
      )}
    </div>
  );
}
