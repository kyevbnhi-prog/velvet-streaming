import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from './hooks/useRouter';
import { StorageService } from './services/storageService';
import { MEDIA_CATALOG, LIVE_CHANNELS } from './data/mediaData';
import { MediaItem, UserProfile, UserProgress } from './types/media';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { LivePage } from './pages/LivePage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { DetailsPage } from './pages/DetailsPage';
import { PlayerPage } from './pages/PlayerPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const { path, params, searchParams, navigate } = useRouter();

  // Storage states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => StorageService.getProfile());
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => StorageService.getWatchlist());
  const [continueWatchingList, setContinueWatchingList] = useState<UserProgress[]>(() =>
    StorageService.getContinueWatching()
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state whenever an internal storage update occurs
  const refreshStorageData = useCallback(() => {
    setUserProfile(StorageService.getProfile());
    setWatchlistIds(StorageService.getWatchlist());
    setContinueWatchingList(StorageService.getContinueWatching());
  }, []);

  useEffect(() => {
    window.addEventListener('app-navigation', refreshStorageData);
    return () => window.removeEventListener('app-navigation', refreshStorageData);
  }, [refreshStorageData]);

  // Toast notifier helper
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Continue watching map for quick lookup
  const continueWatchingMap = useMemo(() => {
    const map: Record<string, number> = {};
    continueWatchingList.forEach((item) => {
      map[item.contentId] = item.percentage;
    });
    return map;
  }, [continueWatchingList]);

  // If no profile exists and on initial root visit, default to welcome
  useEffect(() => {
    const saved = StorageService.getProfile();
    if (!saved && (window.location.pathname === '/' || window.location.pathname === '')) {
      navigate('/welcome', { replace: true });
    }
  }, [navigate]);

  // Navigation handlers
  const handlePlayContent = (item: MediaItem, episodeId?: string) => {
    const url = episodeId ? `/watch/${item.id}?ep=${episodeId}` : `/watch/${item.id}`;
    navigate(url);
  };

  const handleSelectContent = (item: MediaItem) => {
    navigate(`/details/${item.id}`);
  };

  const handleToggleWatchlist = (item: MediaItem) => {
    const added = StorageService.toggleWatchlist(item.id);
    setWatchlistIds(StorageService.getWatchlist());
    showToast(
      added ? `Added "${item.title}" to Watchlist` : `Removed "${item.title}" from Watchlist`,
      added ? 'success' : 'info'
    );
  };

  const handleWelcomeContinue = (profile: UserProfile) => {
    setUserProfile(profile);
    showToast(`Welcome to VELVET, ${profile.name}!`, 'success');
    navigate('/home');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const handleResetProfile = () => {
    StorageService.clearProfile();
    StorageService.clearWatchlist();
    StorageService.clearContinueWatching();
    StorageService.clearSearchHistory();
    setUserProfile(null);
    setWatchlistIds([]);
    setContinueWatchingList([]);
    showToast('Profile and all saved data cleared', 'info');
    navigate('/welcome');
  };

  // Determine current active page view
  const renderCurrentPage = () => {
    // Page 1: Welcome
    if (path === '/welcome') {
      return <WelcomePage onContinue={handleWelcomeContinue} />;
    }

    // Page 2: Home
    if (path === '/home' || path === '/') {
      return (
        <HomePage
          catalog={MEDIA_CATALOG}
          liveChannels={LIVE_CHANNELS}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
          onPlay={handlePlayContent}
          onSelect={handleSelectContent}
          onToggleWatchlist={handleToggleWatchlist}
          onNavigate={navigate}
        />
      );
    }

    // Page 3: Search
    if (path === '/search') {
      const q = searchParams.get('q') || '';
      return (
        <SearchPage
          catalog={MEDIA_CATALOG}
          watchlistIds={watchlistIds}
          initialQuery={q}
          onPlay={handlePlayContent}
          onSelect={handleSelectContent}
          onToggleWatchlist={handleToggleWatchlist}
        />
      );
    }

    // Page 4: Live TV
    if (path === '/live') {
      const ch = searchParams.get('channel') || undefined;
      return (
        <LivePage
          channels={LIVE_CHANNELS}
          initialChannelId={ch}
          onNavigate={navigate}
        />
      );
    }

    // Page 5: Profile
    if (path === '/profile') {
      return (
        <ProfilePage
          userProfile={userProfile}
          catalog={MEDIA_CATALOG}
          watchlistIds={watchlistIds}
          continueWatchingList={continueWatchingList}
          onUpdateProfile={handleUpdateProfile}
          onResetProfile={handleResetProfile}
          onPlay={handlePlayContent}
          onSelect={handleSelectContent}
          onToggleWatchlist={handleToggleWatchlist}
          onShowToast={showToast}
        />
      );
    }

    // Page 6: Details
    if (path === '/details/:id') {
      const id = params.id;
      return (
        <DetailsPage
          contentId={id}
          catalog={MEDIA_CATALOG}
          watchlistIds={watchlistIds}
          savedProgressPercentage={continueWatchingMap[id]}
          onPlay={handlePlayContent}
          onSelect={handleSelectContent}
          onToggleWatchlist={handleToggleWatchlist}
          onBack={() => window.history.back()}
          onShowToast={showToast}
        />
      );
    }

    // Page 7: Video Player
    if (path === '/watch/:id') {
      const id = params.id;
      const episodeId = searchParams.get('ep') || undefined;
      return (
        <PlayerPage
          contentId={id}
          episodeId={episodeId}
          catalog={MEDIA_CATALOG}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate('/home');
            }
          }}
          onNavigateToContent={(contentId, epId) => {
            const url = epId ? `/watch/${contentId}?ep=${epId}` : `/watch/${contentId}`;
            navigate(url);
          }}
          onShowToast={showToast}
        />
      );
    }

    // Page 8: Series
    if (path === '/series') {
      return (
        <SeriesPage
          catalog={MEDIA_CATALOG}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
          onPlay={handlePlayContent}
          onSelect={handleSelectContent}
          onToggleWatchlist={handleToggleWatchlist}
          onNavigate={navigate}
        />
      );
    }

    // Page 9: Movies
    if (path === '/movies') {
      return (
        <MoviesPage
          catalog={MEDIA_CATALOG}
          watchlistIds={watchlistIds}
          onPlay={handlePlayContent}
          onSelect={handleSelectContent}
          onToggleWatchlist={handleToggleWatchlist}
          onNavigate={navigate}
        />
      );
    }

    // 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  const isPlayerOrWelcome = path === '/watch/:id' || path === '/welcome';

  return (
    <div className="min-h-screen bg-[#08090D] text-white flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Floating Glass Navigation Bar (hidden on player and welcome) */}
      {!isPlayerOrWelcome && (
        <Navbar
          currentPath={path}
          userProfile={userProfile}
          onNavigate={navigate}
          onOpenSwitchUser={() => navigate('/welcome')}
        />
      )}

      {/* Main Page Content Body */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Footer (hidden on player and welcome) */}
      {!isPlayerOrWelcome && <Footer onNavigate={navigate} />}

      {/* Floating Glass Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
