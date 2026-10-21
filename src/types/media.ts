export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnail?: string;
  videoUrl?: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  tagline: string;
  type: 'movie' | 'series';
  description: string;
  releaseYear: number;
  duration: string; // e.g. "2h 14m" or "3 Seasons"
  genres: string[];
  rating: number; // e.g. 8.9
  contentRating: string; // e.g. "PG-13", "TV-MA"
  qualityBadge?: string; // e.g. "4K HDR", "DOLBY ATMOS"
  poster: string;
  backdrop: string;
  trailerUrl?: string;
  videoUrl: string;
  cast: string[];
  director: string;
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  topRated?: boolean;
  recentlyAdded?: boolean;
  seasons?: Season[];
}

export interface LiveChannel {
  id: string;
  number: number;
  name: string;
  callsign: string;
  category: 'News' | 'Sports' | 'Movies' | 'Entertainment' | 'Documentary';
  badge: string;
  currentProgram: {
    title: string;
    synopsis: string;
    startTime: string;
    endTime: string;
    progressPercentage: number;
  };
  upcomingProgram: {
    title: string;
    startTime: string;
    endTime: string;
  };
  streamUrl: string;
  quality: string;
}

export interface UserProgress {
  contentId: string;
  episodeId?: string;
  timestamp: number;
  duration: number;
  percentage: number;
  lastWatchedAt: string;
}

export interface UserProfile {
  name: string;
  avatarId: string;
  joinedDate: string;
  preferredGenres: string[];
  autoplayNext: boolean;
  audioLanguage: string;
  theme: 'violet' | 'indigo' | 'obsidian';
}

export type RoutePath =
  | '/welcome'
  | '/home'
  | '/movies'
  | '/series'
  | '/live'
  | '/search'
  | '/profile'
  | `/details/${string}`
  | `/watch/${string}`;
