import React, { useState, useMemo } from 'react';
import { Play, Info, Plus, Check, Star, Clapperboard } from 'lucide-react';
import { MediaItem } from '../types/media';
import { GENRES_LIST } from '../data/mediaData';
import { ContentCard } from '../components/ContentCard';
import { Carousel } from '../components/Carousel';

interface SeriesPageProps {
  catalog: MediaItem[];
  watchlistIds: string[];
  continueWatchingMap: Record<string, number>;
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  onNavigate: (path: string) => void;
}

export const SeriesPage: React.FC<SeriesPageProps> = ({
  catalog,
  watchlistIds,
  continueWatchingMap,
  onPlay,
  onSelect,
  onToggleWatchlist,
  onNavigate,
}) => {
  const allSeries = useMemo(() => catalog.filter((m) => m.type === 'series'), [catalog]);

  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'title'>('rating');

  // Featured spotlight: Queen of the Obsidian Throne or first series
  const featuredSeries = allSeries.find((s) => s.featured) || allSeries[0];

  const filteredSeries = useMemo(() => {
    return allSeries
      .filter((s) => {
        if (selectedGenre !== 'All Genres' && !s.genres.includes(selectedGenre)) return false;
        if (selectedYear !== 'all') {
          if (selectedYear === '2026' && s.releaseYear !== 2026) return false;
          if (selectedYear === '2025' && s.releaseYear !== 2025) return false;
          if (selectedYear === 'older' && s.releaseYear >= 2025) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [allSeries, selectedGenre, selectedYear, sortBy]);

  const trendingSeries = allSeries.filter((s) => s.trending);
  const popularSeries = allSeries.filter((s) => s.popular);
  const recentlyAddedSeries = allSeries.filter((s) => s.recentlyAdded);
  const continueWatchingSeries = allSeries.filter((s) => continueWatchingMap[s.id] !== undefined);

  const isFeaturedWatchlisted = featuredSeries ? watchlistIds.includes(featuredSeries.id) : false;

  return (
    <div className="min-h-screen pb-20">
      {/* Featured Series Banner */}
      {featuredSeries && (
        <section className="relative w-full h-[60vh] min-h-[480px] max-h-[700px] overflow-hidden flex items-end">
          <img
            src={featuredSeries.backdrop || featuredSeries.poster}
            alt={featuredSeries.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/70 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-10 w-full space-y-3">
            <span className="text-xs font-mono text-purple-300">
              ORIGINAL DRAMATIC SERIES · {featuredSeries.duration}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              {featuredSeries.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl line-clamp-2 leading-relaxed">
              {featuredSeries.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlay(featuredSeries)}
                className="px-6 py-2.5 rounded-xl glass-button-primary flex items-center gap-2 text-xs sm:text-sm font-semibold text-white shadow-lg"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Watching Season 1</span>
              </button>
              <button
                onClick={() => onSelect(featuredSeries)}
                className="px-4 py-2.5 rounded-xl glass-button-secondary text-xs sm:text-sm font-medium text-white"
              >
                <Info className="w-4 h-4 text-purple-300 mr-1.5 inline" />
                <span>Seasons & Episodes</span>
              </button>
              <button
                onClick={() => onToggleWatchlist(featuredSeries)}
                className="p-2.5 rounded-xl glass-button-secondary text-white"
                title={isFeaturedWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {isFeaturedWatchlisted ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Rows */}
      <div className="space-y-4 -mt-4 relative z-20">
        {continueWatchingSeries.length > 0 && (
          <Carousel
            title="Continue Watching Series"
            items={continueWatchingSeries}
            layout="landscape"
            onPlay={onPlay}
            onSelect={onSelect}
            onToggleWatchlist={onToggleWatchlist}
            watchlistIds={watchlistIds}
            continueWatchingMap={continueWatchingMap}
          />
        )}

        <Carousel
          title="Trending Television Series"
          items={trendingSeries}
          layout="poster"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
        />

        <Carousel
          title="Most Streamed Series"
          items={popularSeries}
          layout="landscape"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
        />

        <Carousel
          title="Recently Debuted Shows"
          items={recentlyAddedSeries}
          layout="poster"
          onPlay={onPlay}
          onSelect={onSelect}
          onToggleWatchlist={onToggleWatchlist}
          watchlistIds={watchlistIds}
        />
      </div>

      {/* Series Grid & Filter controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Television & Episodic Archive
            </h2>
            <p className="text-xs text-zinc-400">
              Multi-season dramas, thrillers, and limited documentary series.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-[#0e121c]"
            >
              {GENRES_LIST.map((g) => (
                <option key={g} value={g} className="bg-[#10131B]">
                  {g}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-[#0e121c]"
            >
              <option value="all" className="bg-[#10131B]">All Years</option>
              <option value="2026" className="bg-[#10131B]">2026</option>
              <option value="2025" className="bg-[#10131B]">2025</option>
              <option value="older" className="bg-[#10131B]">2024 & Prior</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-[#0e121c]"
            >
              <option value="rating" className="bg-[#10131B]">Top Rated</option>
              <option value="newest" className="bg-[#10131B]">Newest</option>
              <option value="title" className="bg-[#10131B]">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
          {filteredSeries.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              layout="poster"
              onPlay={onPlay}
              onSelect={onSelect}
              onToggleWatchlist={onToggleWatchlist}
              isWatchlisted={watchlistIds.includes(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
