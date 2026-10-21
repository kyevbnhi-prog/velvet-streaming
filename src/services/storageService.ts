import { UserProfile, UserProgress } from '../types/media';

const STORAGE_KEYS = {
  PROFILE: 'velvet_user_profile',
  WATCHLIST: 'velvet_watchlist',
  CONTINUE_WATCHING: 'velvet_continue_watching',
  SEARCH_HISTORY: 'velvet_search_history',
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatarId: 'avatar-1',
  joinedDate: 'October 2026',
  preferredGenres: ['Sci-Fi', 'Thriller', 'Cyberpunk'],
  autoplayNext: true,
  audioLanguage: 'English (Original)',
  theme: 'violet',
};

export const StorageService = {
  // Profile
  getProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return null;
      return JSON.parse(data) as UserProfile;
    } catch {
      return null;
    }
  },

  saveProfile(profile: Partial<UserProfile> & { name: string }): UserProfile {
    const existing = this.getProfile() || DEFAULT_PROFILE;
    const updated: UserProfile = {
      ...existing,
      ...profile,
      joinedDate: existing.joinedDate || 'October 2026',
    };
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error saving profile:', e);
    }
    return updated;
  },

  clearProfile(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch (e) {
      console.warn(e);
    }
  },

  // Watchlist
  getWatchlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? (JSON.parse(data) as string[]) : [];
    } catch {
      return [];
    }
  },

  isInWatchlist(id: string): boolean {
    const list = this.getWatchlist();
    return list.includes(id);
  },

  toggleWatchlist(id: string): boolean {
    const list = this.getWatchlist();
    const index = list.indexOf(id);
    let isAdded = false;
    if (index >= 0) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.unshift(id);
      isAdded = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }
    return isAdded;
  },

  clearWatchlist(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify([]));
    } catch (e) {
      console.warn(e);
    }
  },

  // Continue Watching
  getContinueWatching(): UserProgress[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING);
      return data ? (JSON.parse(data) as UserProgress[]) : [];
    } catch {
      return [];
    }
  },

  saveProgress(contentId: string, timestamp: number, duration: number, episodeId?: string): void {
    if (duration <= 0) return;
    const items = this.getContinueWatching().filter((item) => item.contentId !== contentId);
    const percentage = Math.min(100, Math.round((timestamp / duration) * 100));

    // If completed (> 95%), we don't need to keep badgering to resume, or keep at 100%
    const progress: UserProgress = {
      contentId,
      episodeId,
      timestamp,
      duration,
      percentage,
      lastWatchedAt: new Date().toISOString(),
    };

    items.unshift(progress);
    // Keep max 15 items in continue watching
    const trimmed = items.slice(0, 15);
    try {
      localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(trimmed));
    } catch (e) {
      console.warn(e);
    }
  },

  clearContinueWatching(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify([]));
    } catch (e) {
      console.warn(e);
    }
  },

  // Search History
  getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? (JSON.parse(data) as string[]) : ['Sci-Fi', 'Denis Villeneuve', 'Cyberpunk', 'Obsidian'];
    } catch {
      return ['Sci-Fi', 'Denis Villeneuve', 'Cyberpunk', 'Obsidian'];
    }
  },

  addSearchHistory(term: string): void {
    const trimmed = term.trim();
    if (!trimmed) return;
    const history = this.getSearchHistory().filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
    history.unshift(trimmed);
    const bounded = history.slice(0, 10);
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(bounded));
    } catch (e) {
      console.warn(e);
    }
  },

  removeSearchHistory(term: string): void {
    const history = this.getSearchHistory().filter((t) => t !== term);
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn(e);
    }
  },

  clearSearchHistory(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
    } catch (e) {
      console.warn(e);
    }
  },
};
