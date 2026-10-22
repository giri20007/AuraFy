import CryptoJS from 'crypto-js';
import { Track } from '@/types/music';
import { getDeterministicColor, formatSecondsToTime } from '@/lib/utils';

const SAAVN_DES_KEY = '38346591';

export function decryptSaavnMediaUrl(encryptedUrl: string): string | null {
  if (!encryptedUrl) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse(SAAVN_DES_KEY);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl),
    });
    const decrypted = CryptoJS.DES.decrypt(
      cipherParams,
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    const rawUrl = decrypted.toString(CryptoJS.enc.Utf8);
    if (!rawUrl || !rawUrl.startsWith('http')) return null;

    // Upgrade to 320kbps AAC stream for audiophile quality
    return rawUrl.replace('_96.mp4', '_320.mp4');
  } catch (err) {
    console.warn('Saavn DES decryption error:', err);
    return null;
  }
}

export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function parseSaavnSong(item: any): Track | null {
  try {
    const encrypted = item.more_info?.encrypted_media_url;
    const audioUrl = encrypted ? decryptSaavnMediaUrl(encrypted) : null;

    const title = decodeHtmlEntities(item.title || 'Unknown Title');
    const primaryArtists = item.more_info?.artistMap?.primary_artists;
    let artist = '';
    if (Array.isArray(primaryArtists) && primaryArtists.length > 0) {
      artist = primaryArtists.map((a: any) => a.name).join(', ');
    } else {
      artist = item.subtitle || item.more_info?.music || 'Unknown Artist';
    }
    artist = decodeHtmlEntities(artist);

    const album = decodeHtmlEntities(item.more_info?.album || `${artist} Single`);
    const durationSec = Number(item.more_info?.duration || 180);

    // High resolution 500x500 artwork
    let thumbnail = item.image || '';
    if (thumbnail.includes('150x150.jpg')) {
      thumbnail = thumbnail.replace('150x150.jpg', '500x500.jpg');
    } else if (thumbnail.includes('50x50.jpg')) {
      thumbnail = thumbnail.replace('50x50.jpg', '500x500.jpg');
    }

    if (!thumbnail) {
      thumbnail = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80';
    }

    const views = item.play_count
      ? `${(Number(item.play_count) / 1000000).toFixed(1)}M plays`
      : undefined;

    return {
      id: String(item.id),
      title,
      artist,
      album,
      thumbnail,
      audioUrl: audioUrl || undefined,
      previewUrl: audioUrl || undefined,
      duration: formatSecondsToTime(durationSec),
      durationSeconds: durationSec,
      accentColor: getDeterministicColor(String(item.id) + title),
      views,
      language: item.language,
    };
  } catch (err) {
    console.error('Failed to parse Saavn song:', err);
    return null;
  }
}
