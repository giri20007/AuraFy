'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track, Playlist, RepeatMode, ActiveView, MusicLanguage } from '@/types/music';
import { CURATED_PLAYLISTS } from '@/data/curatedPlaylists';
import confetti from 'canvas-confetti';

interface PlayerContextType {
  // Playback state
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  history: Track[];

  // Library & UI state
  likedTracks: Track[];
  customPlaylists: Playlist[];
  activeView: ActiveView;
  selectedPlaylist: Playlist | null;
  searchQuery: string;
  selectedLanguage: MusicLanguage;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isVideoMode: boolean;
  activeColor: string;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Library Actions
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (title: string, description?: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;

  // UI Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (lang: MusicLanguage) => void;
  setIsLyricsOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setIsVideoMode: (open: boolean) => void;
  setActiveColor: (color: string) => void;

  // YouTube registration
  registerPlayer: (player: any) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);

  // Persistent storage state
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>([]);

  // UI state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguageState] = useState<MusicLanguage>('all');
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>('#8400e7');

  // Audio elements & refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);

  // Initialize native HTML5 Audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.ondurationchange = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);

      audio.onended = () => {
        handleTrackEnded();
      };

      audio.onerror = (e) => {
        console.warn('Audio stream error, attempting fallback:', e);
      };

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('aurafy_likes');
      if (savedLikes) setLikedTracks(JSON.parse(savedLikes));

      const savedPlaylists = localStorage.getItem('aurafy_playlists');
      if (savedPlaylists) setCustomPlaylists(JSON.parse(savedPlaylists));

      const savedVolume = localStorage.getItem('aurafy_volume');
      if (savedVolume) setVolumeState(Number(savedVolume));

      const savedLang = localStorage.getItem('aurafy_language') as MusicLanguage | null;
      if (savedLang) setSelectedLanguageState(savedLang);
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }, []);

  // Save likes
  useEffect(() => {
    try {
      localStorage.setItem('aurafy_likes', JSON.stringify(likedTracks));
    } catch (e) {}
  }, [likedTracks]);

  // Save playlists
  useEffect(() => {
    try {
      localStorage.setItem('aurafy_playlists', JSON.stringify(customPlaylists));
    } catch (e) {}
  }, [customPlaylists]);

  const registerPlayer = useCallback((player: any) => {
    ytPlayerRef.current = player;
  }, []);

  // MediaSession API setup for lock screen / background playback on mobile
  const setupMediaSession = useCallback((track: Track) => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'AuraFy Music',
        artwork: [
          { src: track.thumbnail, sizes: '96x96', type: 'image/jpeg' },
          { src: track.thumbnail, sizes: '256x256', type: 'image/jpeg' },
          { src: track.thumbnail, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) seekTo(details.seekTime);
      });
    }
  }, []);

  const setSelectedLanguage = (lang: MusicLanguage) => {
    setSelectedLanguageState(lang);
    try {
      localStorage.setItem('aurafy_language', lang);
    } catch (e) {}
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setActiveColor(track.accentColor || '#8400e7');
    setCurrentTime(0);
    if (track.durationSeconds) {
      setDuration(track.durationSeconds);
    }

    if (newQueue) {
      const trackIndex = newQueue.findIndex((t) => t.id === track.id);
      if (trackIndex !== -1) {
        setQueue(newQueue.slice(trackIndex + 1));
      } else {
        setQueue(newQueue);
      }
    }

    // Play native audio stream
    if (audioRef.current && track.audioUrl) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setupMediaSession(track);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          // If native audio blocked or no audioUrl, try YouTube player
          if (ytPlayerRef.current && track.youtubeId) {
            ytPlayerRef.current.loadVideoById(track.youtubeId);
            ytPlayerRef.current.playVideo();
          }
        });
    } else if (ytPlayerRef.current && track.youtubeId) {
      ytPlayerRef.current.loadVideoById(track.youtubeId);
      ytPlayerRef.current.playVideo();
      setIsPlaying(true);
    }

    setupMediaSession(track);
  };

  const togglePlayPause = () => {
    if (!currentTrack && CURATED_PLAYLISTS[0]?.tracks[0]) {
      playTrack(CURATED_PLAYLISTS[0].tracks[0], CURATED_PLAYLISTS[0].tracks);
      return;
    }

    if (audioRef.current && currentTrack?.audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else if (ytPlayerRef.current) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.currentTime = seconds;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      ytPlayerRef.current.seekTo(seconds, true);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = clamped / 100;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(clamped);
    }
    try {
      localStorage.setItem('aurafy_volume', String(clamped));
    } catch (e) {}
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === 'function') {
        ytPlayerRef.current.unMute();
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.muted = true;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === 'function') {
        ytPlayerRef.current.mute();
      }
    }
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one' && currentTrack) {
      seekTo(0);
      if (audioRef.current) audioRef.current.play();
      return;
    }

    if (queue.length > 0) {
      let nextIndex = 0;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      const next = queue[nextIndex];
      const remaining = queue.filter((_, idx) => idx !== nextIndex);

      if (currentTrack) {
        setHistory((prev) => [currentTrack, ...prev.slice(0, 30)]);
      }

      setQueue(remaining);
      playTrack(next);
    } else if (repeatMode === 'all' && history.length > 0) {
      const all = [...history].reverse();
      const first = all[0];
      setQueue(all.slice(1));
      setHistory([]);
      playTrack(first);
    } else {
      setIsPlaying(false);
    }
  };

  const nextTrack = useCallback(() => {
    handleTrackEnded();
  }, [queue, history, isShuffle, repeatMode, currentTrack]);

  const prevTrack = () => {
    if (currentTime > 4) {
      seekTo(0);
      return;
    }

    if (history.length > 0) {
      const prev = history[0];
      setHistory((h) => h.slice(1));
      if (currentTrack) {
        setQueue((q) => [currentTrack, ...q]);
      }
      playTrack(prev);
    } else {
      seekTo(0);
    }
  };

  const addToQueue = (track: Track) => setQueue((prev) => [...prev, track]);
  const removeFromQueue = (index: number) => setQueue((prev) => prev.filter((_, i) => i !== index));
  const clearQueue = () => setQueue([]);

  const isLiked = (trackId: string) => likedTracks.some((t) => t.id === trackId);

  const toggleLike = (track: Track) => {
    if (isLiked(track.id)) {
      setLikedTracks((prev) => prev.filter((t) => t.id !== track.id));
    } else {
      setLikedTracks((prev) => [track, ...prev]);
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.85, x: 0.5 },
          colors: ['#1DB954', '#1ed760', '#ffffff'],
        });
      } catch (e) {}
    }
  };

  const createPlaylist = (title: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title,
      description: description || 'Created with AuraFy Glass',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
      accentColor: '#8400e7',
      tracks: [],
      isCustom: true,
      createdAt: new Date().toLocaleDateString(),
    };
    setCustomPlaylists((prev) => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setCustomPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.tracks.some((t) => t.id === track.id)) return pl;
          return { ...pl, tracks: [...pl.tracks, track] };
        }
        return pl;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) };
        }
        return pl;
      })
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setCustomPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
      setActiveView('home');
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        likedTracks,
        customPlaylists,
        activeView,
        selectedPlaylist,
        searchQuery,
        selectedLanguage,
        isLyricsOpen,
        isQueueOpen,
        isVideoMode,
        activeColor,
        playTrack,
        togglePlayPause,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        nextTrack,
        prevTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleLike,
        isLiked,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        deletePlaylist,
        setActiveView,
        setSelectedPlaylist,
        setSearchQuery,
        setSelectedLanguage,
        setIsLyricsOpen,
        setIsQueueOpen,
        setIsVideoMode,
        setActiveColor,
        registerPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
