import { LyricLine } from '@/types/music';

// Palette of aesthetic dark Spotify hero gradient colors
const ACCENT_PALETTE = [
  '#5038a0', // Deep Violet
  '#1e3264', // Midnight Blue
  '#8400e7', // Electric Purple
  '#e8115b', // Hot Pink
  '#148a08', // Spotify Forest
  '#bc5900', // Amber Orange
  '#0d72ec', // Ocean Blue
  '#ba5d07', // Cinnamon
  '#e91429', // Crimson
  '#006450', // Emerald Teal
  '#477d95', // Steel Blue
  '#8c1932', // Velvet Wine
];

export function getDeterministicColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ACCENT_PALETTE.length;
  return ACCENT_PALETTE[index];
}

// Clean noisy YouTube titles (e.g. "The Weeknd - Blinding Lights (Official Video)")
export function cleanYouTubeTitle(rawTitle: string, channelName: string): { title: string; artist: string } {
  let cleaned = rawTitle
    .replace(/\s*[\(\[\{]?(Official\s*(Music\s*)?(Video|Audio|Visualizer|Lyric\s*Video|HD|4K|Remastered)?)[\)\]\}]?/gi, '')
    .replace(/\s*[\(\[\{]?(Lyrics?|Lyric\s*Video|Full\s*Song|Audio)[\)\]\}]?/gi, '')
    .replace(/\s*\|\s*.*$/g, '')
    .replace(/\s*ft\.\s*/gi, ' feat. ')
    .trim();

  // If title has "Artist - Song" format
  if (cleaned.includes(' - ')) {
    const parts = cleaned.split(' - ');
    const potentialArtist = parts[0].trim();
    const potentialTitle = parts.slice(1).join(' - ').trim();
    return {
      artist: potentialArtist || channelName,
      title: potentialTitle || cleaned,
    };
  }

  return {
    artist: channelName,
    title: cleaned,
  };
}

export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Parse LRC lyrics format: [00:12.34] lyric line
export function parseLRC(lrcText: string): LyricLine[] {
  if (!lrcText) return [];
  const lines = lrcText.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let match;
    const timestamps: number[] = [];
    while ((match = timeRegex.exec(trimmed)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const ms = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) : 0;
      timestamps.push(min * 60 + sec + ms / 1000);
    }

    const text = trimmed.replace(timeRegex, '').trim();
    if (text) {
      for (const time of timestamps) {
        result.push({ time, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
