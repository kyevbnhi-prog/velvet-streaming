import React, { useState, useEffect } from 'react';
import {
  User,
  Check,
  Edit2,
  Trash2,
  Bookmark,
  Clock,
  Sparkles,
  Settings,
  RotateCcw,
  Film,
  Play,
} from 'lucide-react';
import { UserProfile, UserProgress, MediaItem } from '../types/media';
import { AVATAR_OPTIONS, GENRES_LIST } from '../data/mediaData';
import { StorageService } from '../services/storageService';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ContentCard } from '../components/ContentCard';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  catalog: MediaItem[];
  watchlistIds: string[];
  continueWatchingList: UserProgress[];
  onUpdateProfile: (profile: UserProfile) => void;
  onResetProfile: () => void;
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  catalog,
  watchlistIds,
  continueWatchingList,
  onUpdateProfile,
  onResetProfile,
  onPlay,
  onSelect,
  onToggleWatchlist,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatarId || 'avatar-1');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    userProfile?.preferredGenres || ['Sci-Fi', 'Thriller']
  );
  const [autoplayNext, setAutoplayNext] = useState(userProfile?.autoplayNext ?? true);
  const [audioLanguage, setAudioLanguage] = useState(
    userProfile?.audioLanguage || 'English (Original)'
  );

  // Modals for destructive actions
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [confirmClearWatchlist, setConfirmClearWatchlist] = useState(false);
  const [confirmResetAccount, setConfirmResetAccount] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.name);
      setSelectedAvatar(userProfile.avatarId);
      setSelectedGenres(userProfile.preferredGenres);
      setAutoplayNext(userProfile.autoplayNext);
      setAudioLanguage(userProfile.audioLanguage);
    }
  }, [userProfile]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      onShowToast('Name cannot be empty', 'error');
      return;
    }
    const updated = StorageService.saveProfile({
      name: displayName.trim(),
      avatarId: selectedAvatar,
      preferredGenres: selectedGenres,
      autoplayNext,
      audioLanguage,
    });
    onUpdateProfile(updated);
    setIsEditing(false);
    onShowToast('Profile preferences updated successfully', 'success');
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleClearHistoryAction = () => {
    StorageService.clearContinueWatching();
    setConfirmClearHistory(false);
    onShowToast('Viewing history cleared', 'info');
    window.dispatchEvent(new Event('app-navigation'));
  };

  const handleClearWatchlistAction = () => {
    StorageService.clearWatchlist();
    setConfirmClearWatchlist(false);
    onShowToast('Watchlist cleared', 'info');
    window.dispatchEvent(new Event('app-navigation'));
  };

  const handleResetAccountAction = () => {
    setConfirmResetAccount(false);
    onResetProfile();
  };

  const watchlistedItems = catalog.filter((m) => watchlistIds.includes(m.id));
  const continueWatchingItems = continueWatchingList
    .map((prog) => {
      const media = catalog.find((m) => m.id === prog.contentId);
      return media ? { media, prog } : null;
    })
    .filter((entry): entry is { media: MediaItem; prog: UserProgress } => entry !== null);

  const activeAvatarObj =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      {/* Profile Header Hero Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel-elevated border border-white/15 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${activeAvatarObj.gradient} flex items-center justify-center text-3xl font-bold font-display text-white shadow-2xl border border-white/20`}
            >
              {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                  VELVET CINEMA MEMBER
                </span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-xs font-mono text-zinc-400">
                  Joined {userProfile?.joinedDate || '2026'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {displayName || 'Cinema Explorer'}
              </h1>
              <p className="text-xs text-zinc-400">
                Preferred: {selectedGenres.slice(0, 3).join(' · ') || 'All genres'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs sm:text-sm font-medium text-white flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4 text-purple-400" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile & Settings'}</span>
          </button>
        </div>

        {/* Edit Profile Form (Expanded) */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-8 pt-6 border-t border-white/10 space-y-6 animate-in fade-in duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-300">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              {/* Audio Language */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-300">DEFAULT AUDIO STREAM</label>
                <select
                  value={audioLanguage}
                  onChange={(e) => setAudioLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0f131e]"
                >
                  <option value="English (Original)">English (Original 5.1 / Atmos)</option>
                  <option value="English (Descriptive Audio)">English (Descriptive Audio)</option>
                  <option value="French (Original)">French (Studio Dub)</option>
                  <option value="Spanish (Castilian)">Spanish (Castilian)</option>
                  <option value="Japanese (Original)">Japanese (Original Japanese)</option>
                </select>
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-300">CHOOSE AVATAR GEM</label>
              <div className="flex flex-wrap gap-3">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${
                      selectedAvatar === av.id
                        ? 'border-purple-400 bg-purple-950/40 text-white'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${av.gradient}`} />
                    <span className="text-xs font-medium">{av.label}</span>
                    {selectedAvatar === av.id && <Check className="w-3.5 h-3.5 text-purple-400 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Preferences */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-300">PREFERRED GENRES</label>
              <div className="flex flex-wrap gap-2">
                {GENRES_LIST.filter((g) => g !== 'All Genres').map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      type="button"
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow'
                          : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playback Toggles */}
            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoplayNext}
                  onChange={(e) => setAutoplayNext(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 bg-black/40 border-white/20"
                />
                <span className="text-xs text-zinc-300">Autoplay next episode in series</span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white tracking-wide shadow-lg"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Continue Watching History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              Continue Watching History
            </h2>
            <span className="text-xs font-mono text-zinc-500">({continueWatchingItems.length})</span>
          </div>

          {continueWatchingItems.length > 0 && (
            <button
              onClick={() => setConfirmClearHistory(true)}
              className="text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {continueWatchingItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {continueWatchingItems.map(({ media, prog }) => (
              <div
                key={media.id}
                onClick={() => onPlay(media)}
                className="group p-3 rounded-2xl glass-card cursor-pointer border border-white/10 hover:border-purple-400/40 space-y-3"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <img
                    src={media.backdrop || media.poster}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full glass-button-primary flex items-center justify-center text-white">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Progress gauge */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white truncate">{media.title}</h4>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-1">
                    <span>{prog.percentage}% completed</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(media);
                      }}
                      className="text-purple-400 hover:underline"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-panel text-center text-xs text-zinc-400">
            No playback history recorded yet. Start watching any title and your progress will automatically save here.
          </div>
        )}
      </div>

      {/* My Watchlist Section */}
      <div id="watchlist" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              My Saved Watchlist
            </h2>
            <span className="text-xs font-mono text-zinc-500">({watchlistedItems.length})</span>
          </div>

          {watchlistedItems.length > 0 && (
            <button
              onClick={() => setConfirmClearWatchlist(true)}
              className="text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Watchlist</span>
            </button>
          )}
        </div>

        {watchlistedItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {watchlistedItems.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                layout="poster"
                onPlay={onPlay}
                onSelect={onSelect}
                onToggleWatchlist={onToggleWatchlist}
                isWatchlisted={true}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-panel text-center text-xs text-zinc-400">
            Your watchlist is empty. Click the &ldquo;+&rdquo; button on any movie or series to bookmark it for later.
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Profile */}
      <div className="p-6 rounded-2xl glass-panel border border-rose-500/20 bg-rose-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-rose-300 font-display">Reset Profile & Local Storage</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Erase all cached watchlist items, resume history, and profile identity from this browser.
          </p>
        </div>
        <button
          onClick={() => setConfirmResetAccount(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-200 border border-rose-500/30 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Account</span>
        </button>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationModal
        isOpen={confirmClearHistory}
        title="Clear Watch History?"
        message="This will remove all stored playback progress markers. Your currently saved positions will be reset to the beginning."
        confirmLabel="Clear History"
        isDestructive={true}
        onConfirm={handleClearHistoryAction}
        onCancel={() => setConfirmClearHistory(false)}
      />

      <ConfirmationModal
        isOpen={confirmClearWatchlist}
        title="Clear Watchlist?"
        message="Are you sure you want to remove all bookmarked titles from your personal watchlist?"
        confirmLabel="Clear Watchlist"
        isDestructive={true}
        onConfirm={handleClearWatchlistAction}
        onCancel={() => setConfirmClearWatchlist(false)}
      />

      <ConfirmationModal
        isOpen={confirmResetAccount}
        title="Reset Profile & Data?"
        message="This will wipe your display name, watchlist, preferences, and watch history from local storage. You will be redirected to the Welcome onboarding screen."
        confirmLabel="Erase All Data"
        isDestructive={true}
        onConfirm={handleResetAccountAction}
        onCancel={() => setConfirmResetAccount(false)}
      />
    </div>
  );
};
