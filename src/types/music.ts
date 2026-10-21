export interface Track {
  id: string; // YouTube video ID
  title: string;
  artist: string;
  album?: string;
  thumbnail: string;
  duration: string; // "3:45"
  durationSeconds: number;
  accentColor: string; // Hex color for hero gradient e.g. "#1e3a8a"
  views?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  accentColor: string;
  tracks: Track[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type ActiveView = 'home' | 'search' | 'library' | 'playlist' | 'liked';
