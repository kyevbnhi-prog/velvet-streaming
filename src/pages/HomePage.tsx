import React from 'react';
import { Play, Info, Plus, Check, Star, Tv, ArrowRight } from 'lucide-react';
import { MediaItem, LiveChannel } from '../types/media';
import { Carousel } from '../components/Carousel';

interface HomePageProps {
  catalog: MediaItem[];
  liveChannels: LiveChannel[];
  watchlistIds: string[];
  continueWatchingMap: Record<string, number>;
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  catalog,
  liveChannels,
  watchlistIds,
  continueWatchingMap,
  onPlay,
  onSelect,
  onToggleWatchlist,
  onNavigate,
}) => {
  // Hero item: Celestial Odyssey or first featured
  const heroItem = catalog.find((m) => m.featured && m.backdrop) || catalog[0];

  const trendingItems = catalog.filter((m) => m.trending);
  const popularMovies = catalog.filter((m) => m.type === 'movie' && m.popular);
  const popularSeries = catalog.filter((m) => m.type === 'series' && m.popular);
  const recentlyAdded = catalog.filter((m) => m.recentlyAdded);
  const recommendedItems = catalog.filter((m) => m.topRated);
  const continueWatchingItems = catalog.filter((m) => continueWatchingMap[m.id] !== undefined);
  const watchlistItems = catalog.filter((m) => watchlistIds.includes(m.id));

  const isHeroWatchlisted = heroItem ? watchlistIds.includes(heroItem.id) : false;

  return (
    <div className="min-h-screen pb-16">
      {/* Large Featured Hero Section */}
      {heroItem && (
        <section className="relative w-full h-[75vh] min-h-[580px] max-h-[820px] overflow-hidden flex items-end">
          {/* Hero Backdrop Artwork */}
          <div className="absolute inset-0">
            <img
              src={heroItem.backdrop}
              alt={heroItem.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
              loading="eager"
            />
            {/* Liquid Glass and Cinematic Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/60 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-12 sm:pb-16 w-full space-y-4">
            {/* Quality & Type unboxed metadata */}
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
              <span className="font-semibold">{heroItem.qualityBadge || '4K HDR'}</span>
              <span aria-hidden="true" className="text-zinc-500">·</span>
              <span>{heroItem.type === 'series' ? 'FEATURED SERIES' : 'FEATURED MOVIE'}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-3xl drop-shadow-xl text-balance">
              {heroItem.title}
            </h1>

            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 font-mono">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {heroItem.rating.toFixed(1)}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{heroItem.releaseYear}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{heroItem.duration}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{heroItem.genres.join(' · ')}</span>
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl line-clamp-3 leading-relaxed drop-shadow">
              {heroItem.description}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlay(heroItem)}
                className="px-6 py-3 rounded-xl glass-button-primary flex items-center gap-2.5 text-sm font-semibold text-white tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => onSelect(heroItem)}
                className="px-5 py-3 rounded-xl glass-button-secondary flex items-center gap-2 text-sm font-medium text-white hover:border-purple-400/40"
              >
                <Info className="w-4 h-4 text-purple-300" />
                <span>More Info</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(heroItem)}
                className="p-3 rounded-xl glass-button-secondary text-zinc-300 hover:text-white"
                title={isHeroWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                aria-label="Toggle Watchlist"
              >
                {isHeroWatchlisted ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Rows */}
      <div className="space-y-4 -mt-4 relative z-20">
        {/* Continue Watching (Only shown if items exist) */}
        {continueWatchingItems.length > 0 && (
          <Carousel
            title="Continue Watching"
            items={continueWatchingItems}
            layout="landscape"
            onPlay={onPlay}
            onSelect={onSelect}
            onToggleWatchlist={onToggleWatchlist}
            watchlistIds={watchlistIds}
            continueWatchingMap={continueWatchingMap}
          />
        )}

        {/* Trending Now */}
        <Carousel
          title="Trending Now"
          items={trendingItems}
          layout="poster"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
          viewAllLink="/movies"
          onNavigate={onNavigate}
        />

        {/* Live TV Preview Section */}
        <section className="px-4 sm:px-8 my-8">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ON AIR RIGHT NOW</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  Live TV Channels & Broadcasts
                </h3>
              </div>

              <button
                onClick={() => onNavigate('/live')}
                className="px-4 py-2 rounded-xl glass-button-secondary text-xs sm:text-sm font-medium text-purple-300 hover:text-white flex items-center gap-1.5"
              >
                <span>View Full EPG Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Channel Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveChannels.slice(0, 3).map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => onNavigate(`/live?channel=${ch.id}`)}
                  className="p-4 rounded-2xl glass-card cursor-pointer border border-white/10 hover:border-purple-400/40 space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-300">
                        <Tv className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                          {ch.name}
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-400">
                          CH {ch.number} · {ch.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-medium text-zinc-200 truncate">
                      {ch.currentProgram.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {ch.currentProgram.startTime} - {ch.currentProgram.endTime}
                    </p>
                  </div>

                  {/* Progress gauge */}
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400"
                      style={{ width: `${ch.currentProgram.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Movies */}
        <Carousel
          title="Popular Movies"
          items={popularMovies}
          layout="poster"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
          viewAllLink="/movies"
          onNavigate={onNavigate}
        />

        {/* Popular Series */}
        <Carousel
          title="Acclaimed Series"
          items={popularSeries}
          layout="poster"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
          viewAllLink="/series"
          onNavigate={onNavigate}
        />

        {/* Recommended for You */}
        <Carousel
          title="Recommended For You"
          items={recommendedItems}
          layout="landscape"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
        />

        {/* Recently Added */}
        <Carousel
          title="Recently Added"
          items={recentlyAdded}
          layout="poster"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
          continueWatchingMap={continueWatchingMap}
        />

        {/* Watchlist Row (if any) */}
        {watchlistItems.length > 0 && (
          <Carousel
            title="My Watchlist"
            items={watchlistItems}
            layout="poster"
            onPlay={onPlay}
            onSelect={onSelect}
            onToggleWatchlist={onToggleWatchlist}
            watchlistIds={watchlistIds}
            continueWatchingMap={continueWatchingMap}
            viewAllLink="/profile#watchlist"
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
};
