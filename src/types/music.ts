export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  audioUrl?: string; // Direct audio stream for instant mobile playback
  youtubeId?: string; // YouTube video ID for video mode
  duration: string; // "3:45"
  durationSeconds: number;
  accentColor: string; // Hex color for hero gradient & glass glow e.g. "#8400e7"
  views?: string;
  previewUrl?: string;
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
