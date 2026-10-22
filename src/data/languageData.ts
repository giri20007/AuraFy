import { MusicLanguage, Playlist, Track } from '@/types/music';

export interface LanguageOption {
  id: MusicLanguage;
  name: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'all', name: 'All', nativeName: 'Global' },
  { id: 'hindi', name: 'Hindi', nativeName: 'Hindi' },
  { id: 'english', name: 'English', nativeName: 'English' },
  { id: 'tamil', name: 'Tamil', nativeName: 'Tamil' },
  { id: 'telugu', name: 'Telugu', nativeName: 'Telugu' },
  { id: 'punjabi', name: 'Punjabi', nativeName: 'Punjabi' },
  { id: 'malayalam', name: 'Malayalam', nativeName: 'Malayalam' },
  { id: 'spanish', name: 'Spanish', nativeName: 'Spanish' },
  { id: 'kpop', name: 'K-Pop', nativeName: 'K-Pop' },
];

export interface ArtistItem {
  id: string;
  name: string;
  image: string;
  topTrack: Track;
  language?: MusicLanguage;
}

const TRACK_KESARIYA: Track = {
  "id": "rjkrTnma",
  "title": "Kesariya",
  "artist": "Pritam, Arijit Singh, Amitabh Bhattacharya",
  "album": "Brahmastra",
  "thumbnail": "https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg",
  "audioUrl": "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
  "duration": "4:28",
  "durationSeconds": 268,
  "accentColor": "#e91429"
};
const TRACK_CHALEYA: Track = {
  "id": "yDnFw7my",
  "title": "Chaleya (From \"Jawan\")",
  "artist": "Kumaar, Anirudh Ravichander, Arijit Singh, Shilpa Rao",
  "album": "World Music Day - Best Of Bollywood Hits",
  "thumbnail": "https://c.saavncdn.com/179/World-Music-Day-Best-Of-Bollywood-Hits-Hindi-2026-20260622111029-500x500.jpg",
  "audioUrl": "https://aac.saavncdn.com/179/1be373323edc90024d93873d85f644ec_320.mp4",
  "duration": "3:20",
  "durationSeconds": 200,
  "accentColor": "#0d72ec"
};
const TRACK_HUKUM: Track = {
  "id": "rtIe2EtQ",
  "title": "Hukum",
  "artist": "Dinker kalvala, Anirudh Ravichander, Bhaskarabhatla Ravi Kumar",
  "album": "Jailer",
  "thumbnail": "https://c.saavncdn.com/435/Jailer-Telugu-2023-20230810132954-500x500.jpg",
  "audioUrl": "https://aac.saavncdn.com/435/4161a58e6cff0010c02431e6c21728d9_320.mp4",
  "duration": "3:27",
  "durationSeconds": 207,
  "accentColor": "#0d72ec"
};
const TRACK_LOVER: Track = {
  "id": "M7k5t7vw",
  "title": "Lover",
  "artist": "Diljit Dosanjh",
  "album": "MoonChild Era",
  "thumbnail": "https://c.saavncdn.com/209/MoonChild-Era-Punjabi-2021-20240715073449-500x500.jpg",
  "audioUrl": "https://aac.saavncdn.com/209/88cd9a1cc0af8768d67272876bb09851_320.mp4",
  "duration": "3:10",
  "durationSeconds": 190,
  "accentColor": "#bc5900"
};
const TRACK_NAATU: Track = {
  "id": "-JkPBIE7",
  "title": "Naatu Naatu",
  "artist": "Rahul Sipligunj, Kaala Bhairava",
  "album": "RRR - Telugu",
  "thumbnail": "https://c.saavncdn.com/683/RRR-Telugu-Telugu-2022-20250828171313-500x500.jpg",
  "audioUrl": "https://aac.saavncdn.com/683/000ab54759049a8451ffcdc6412a0ef6_320.mp4",
  "duration": "3:34",
  "durationSeconds": 214,
  "accentColor": "#bc5900"
};
const TRACK_ILLUMINATI: Track = {
  "id": "wBgCQQ_6",
  "title": "Illuminati",
  "artist": "Vinayak Sasikumar, Sushin Shyam, Dabzee",
  "album": "Aavesham (Original Motion Picture Soundtrack)",
  "thumbnail": "https://c.saavncdn.com/202/Aavesham-Original-Motion-Picture-Soundtrack-Malayalam-2024-20250910150630-500x500.jpg",
  "audioUrl": "https://aac.saavncdn.com/202/ba6006006a2f40e6b20b5ced32cc2885_320.mp4",
  "duration": "3:32",
  "durationSeconds": 212,
  "accentColor": "#8400e7"
};

const TRACK_BLINDING_LIGHTS: Track = {
  id: '1542842761',
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
  audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
  duration: '3:36',
  durationSeconds: 216,
  accentColor: '#e91429',
};

const TRACK_ESPRESSO: Track = {
  id: '1746801012',
  title: 'Espresso',
  artist: 'Sabrina Carpenter',
  album: 'Espresso EP',
  thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/e8/7b/57e87ba0-5057-9bb9-c247-ce7dbe426e89/24UMGIM55213.rgb.jpg/600x600bb.jpg',
  audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/4d/02/e94d0230-11ee-ef94-d2cf-a5d547bd73f4/mzaf_554140808559155562.plus.aac.p.m4a',
  duration: '2:55',
  durationSeconds: 175,
  accentColor: '#bc5900',
};

export const LANGUAGE_ARTISTS: Record<MusicLanguage, ArtistItem[]> = {
  all: [
    {
      id: 'arijit-singh',
      name: 'Arijit Singh',
      image: TRACK_KESARIYA.thumbnail,
      topTrack: TRACK_KESARIYA,
    },
    {
      id: 'anirudh',
      name: 'Anirudh Ravichander',
      image: TRACK_HUKUM.thumbnail,
      topTrack: TRACK_HUKUM,
    },
    {
      id: 'diljit-dosanjh',
      name: 'Diljit Dosanjh',
      image: TRACK_LOVER.thumbnail,
      topTrack: TRACK_LOVER,
    },
    {
      id: 'the-weeknd',
      name: 'The Weeknd',
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
      topTrack: TRACK_BLINDING_LIGHTS,
    },
    {
      id: 'sabrina-carpenter',
      name: 'Sabrina Carpenter',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      topTrack: TRACK_ESPRESSO,
    },
    {
      id: 'sid-sriram',
      name: 'Sid Sriram',
      image: TRACK_NAATU.thumbnail,
      topTrack: TRACK_NAATU,
    },
  ],
  hindi: [
    { id: 'arijit-singh', name: 'Arijit Singh', image: TRACK_KESARIYA.thumbnail, topTrack: TRACK_KESARIYA },
    { id: 'pritam', name: 'Pritam', image: TRACK_KESARIYA.thumbnail, topTrack: TRACK_KESARIYA },
    { id: 'anirudh-hindi', name: 'Anirudh Ravichander', image: TRACK_CHALEYA.thumbnail, topTrack: TRACK_CHALEYA },
  ],
  tamil: [
    { id: 'anirudh-tamil', name: 'Anirudh Ravichander', image: TRACK_HUKUM.thumbnail, topTrack: TRACK_HUKUM },
  ],
  telugu: [
    { id: 'sid-sriram-telugu', name: 'Sid Sriram', image: TRACK_NAATU.thumbnail, topTrack: TRACK_NAATU },
  ],
  punjabi: [
    { id: 'diljit-punjabi', name: 'Diljit Dosanjh', image: TRACK_LOVER.thumbnail, topTrack: TRACK_LOVER },
  ],
  english: [
    { id: 'the-weeknd-eng', name: 'The Weeknd', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80', topTrack: TRACK_BLINDING_LIGHTS },
    { id: 'sabrina-eng', name: 'Sabrina Carpenter', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', topTrack: TRACK_ESPRESSO },
  ],
  malayalam: [
    { id: 'sushin-shyam', name: 'Sushin Shyam', image: TRACK_ILLUMINATI.thumbnail, topTrack: TRACK_ILLUMINATI },
  ],
  spanish: [
    { id: 'bad-bunny', name: 'Bad Bunny', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', topTrack: TRACK_BLINDING_LIGHTS },
  ],
  kpop: [
    { id: 'bts', name: 'BTS', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80', topTrack: TRACK_BLINDING_LIGHTS },
  ],
};

export const LANGUAGE_PLAYLISTS: Record<MusicLanguage, Playlist[]> = {
  all: [
    {
      id: 'hot-hits-global',
      title: 'Global Top Hits',
      description: 'The biggest songs in the world right now across all genres & languages.',
      coverUrl: TRACK_KESARIYA.thumbnail,
      accentColor: '#1DB954',
      language: 'all',
      tracks: [TRACK_KESARIYA, TRACK_HUKUM, TRACK_LOVER, TRACK_CHALEYA, TRACK_BLINDING_LIGHTS, TRACK_ESPRESSO],
    },
  ],
  hindi: [
    {
      id: 'bollywood-romance',
      title: 'Bollywood Hits & Romance',
      description: 'Original studio recordings by Arijit Singh, Pritam, Anirudh.',
      coverUrl: TRACK_KESARIYA.thumbnail,
      accentColor: '#e91429',
      language: 'hindi',
      tracks: [TRACK_KESARIYA, TRACK_CHALEYA],
    },
  ],
  tamil: [
    {
      id: 'kollywood-blockbusters',
      title: 'Kollywood Mass & Melodies',
      description: 'Chart-topping Tamil anthems by Anirudh and top composers.',
      coverUrl: TRACK_HUKUM.thumbnail,
      accentColor: '#0d72ec',
      language: 'tamil',
      tracks: [TRACK_HUKUM],
    },
  ],
  telugu: [
    {
      id: 'tollywood-dance-hits',
      title: 'Tollywood High Energy Hits',
      description: 'Energetic beats from RRR and Telugu blockbusters.',
      coverUrl: TRACK_NAATU.thumbnail,
      accentColor: '#bc5900',
      language: 'telugu',
      tracks: [TRACK_NAATU],
    },
  ],
  punjabi: [
    {
      id: 'punjabi-bangers',
      title: 'Punjabi 100% Bangers',
      description: 'Chartbusters from Diljit Dosanjh and top Punjabi artists.',
      coverUrl: TRACK_LOVER.thumbnail,
      accentColor: '#e91429',
      language: 'punjabi',
      tracks: [TRACK_LOVER],
    },
  ],
  english: [
    {
      id: 'todays-top-hits-eng',
      title: "Today's Top Hits (English)",
      description: 'The hottest global pop, R&B, and electronic tracks right now.',
      coverUrl: TRACK_ESPRESSO.thumbnail,
      accentColor: '#bc5900',
      language: 'english',
      tracks: [TRACK_ESPRESSO, TRACK_BLINDING_LIGHTS],
    },
  ],
  malayalam: [
    {
      id: 'mollywood-waves',
      title: 'Mollywood New Wave',
      description: 'Fresh Malayalam sounds by Sushin Shyam.',
      coverUrl: TRACK_ILLUMINATI.thumbnail,
      accentColor: '#8400e7',
      language: 'malayalam',
      tracks: [TRACK_ILLUMINATI],
    },
  ],
  spanish: [
    {
      id: 'latin-fiesta',
      title: 'Éxitos Latino',
      description: 'Global Latin and international hits.',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      accentColor: '#bc5900',
      language: 'spanish',
      tracks: [TRACK_BLINDING_LIGHTS],
    },
  ],
  kpop: [
    {
      id: 'kpop-daebak',
      title: 'K-Pop Daebak!',
      description: 'Top trending tracks and chartbusters.',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
      accentColor: '#8400e7',
      language: 'kpop',
      tracks: [TRACK_BLINDING_LIGHTS],
    },
  ],
};
