import React, { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon, X, Clock, SlidersHorizontal, Trash2 } from 'lucide-react';
import { MediaItem } from '../types/media';
import { GENRES_LIST } from '../data/mediaData';
import { StorageService } from '../services/storageService';
import { ContentCard } from '../components/ContentCard';

interface SearchPageProps {
  catalog: MediaItem[];
  watchlistIds: string[];
  initialQuery?: string;
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  catalog,
  watchlistIds,
  initialQuery = '',
  onPlay,
  onSelect,
  onToggleWatchlist,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'rating' | 'title'>('relevance');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchHistory(StorageService.getSearchHistory());
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
  };

  const handleSearchCommit = (term: string) => {
    if (term.trim()) {
      StorageService.addSearchHistory(term);
      setSearchHistory(StorageService.getSearchHistory());
    }
  };

  const handleRemoveHistoryItem = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.removeSearchHistory(term);
    setSearchHistory(StorageService.getSearchHistory());
  };

  const handleClearHistory = () => {
    StorageService.clearSearchHistory();
    setSearchHistory([]);
  };

  // Filter & search logic
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    return catalog
      .filter((item) => {
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) return false;

        // Genre filter
        if (selectedGenre !== 'All Genres' && !item.genres.includes(selectedGenre)) return false;

        // Year filter
        if (selectedYear !== 'all') {
          if (selectedYear === '2026' && item.releaseYear !== 2026) return false;
          if (selectedYear === '2025' && item.releaseYear !== 2025) return false;
          if (selectedYear === 'older' && item.releaseYear >= 2025) return false;
        }

        // Query match
        if (!q) return true;

        const titleMatch = item.title.toLowerCase().includes(q);
        const taglineMatch = item.tagline.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const genreMatch = item.genres.some((g) => g.toLowerCase().includes(q));
        const castMatch = item.cast.some((c) => c.toLowerCase().includes(q));
        const directorMatch = item.director.toLowerCase().includes(q);

        return titleMatch || taglineMatch || descMatch || genreMatch || castMatch || directorMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // Default relevance
        return 0;
      });
  }, [catalog, query, selectedType, selectedGenre, selectedYear, sortBy]);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Search Header and Input */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Search Cinema & Television
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Explore blockbusters, directors, genres, and cast across the entire VELVET vault.
          </p>
        </div>

        {/* Liquid Glass Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchCommit(query);
            }}
            placeholder="Search by title, genre, director, or actor..."
            className="w-full pl-12 pr-24 py-4 rounded-2xl glass-input text-base text-white placeholder-zinc-500 shadow-2xl focus:border-purple-400/60"
            autoFocus
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl text-sm transition-colors ${
                showFilters ? 'bg-purple-600/30 text-purple-300' : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Search History Tags */}
        {searchHistory.length > 0 && !query && (
          <div className="space-y-2 pt-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5" /> Recent Searches
              </span>
              <button
                onClick={handleClearHistory}
                className="hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear history
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    handleSearchCommit(term);
                  }}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs text-zinc-300 hover:text-white hover:border-purple-400/40 transition-colors"
                >
                  <span>{term}</span>
                  <span
                    onClick={(e) => handleRemoveHistoryItem(term, e)}
                    className="text-zinc-500 group-hover:text-zinc-300 hover:text-rose-400"
                    title="Remove item"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Matrix (collapsible or always accessible) */}
      <div
        className={`p-4 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4 transition-all ${
          showFilters || query ? 'block' : 'hidden sm:block'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Format Type */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">FORMAT</label>
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
              {(['all', 'movie', 'series'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                    selectedType === type ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'Series'}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Dropdown */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">GENRE</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e121c]"
            >
              {GENRES_LIST.map((g) => (
                <option key={g} value={g} className="bg-[#10131B] text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">RELEASE YEAR</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e121c]"
            >
              <option value="all" className="bg-[#10131B]">All Years</option>
              <option value="2026" className="bg-[#10131B]">2026 Releases</option>
              <option value="2025" className="bg-[#10131B]">2025 Releases</option>
              <option value="older" className="bg-[#10131B]">2024 & Prior</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">SORT BY</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e121c]"
            >
              <option value="relevance" className="bg-[#10131B]">Relevance</option>
              <option value="rating" className="bg-[#10131B]">Highest Rated</option>
              <option value="newest" className="bg-[#10131B]">Newest Release</option>
              <option value="title" className="bg-[#10131B]">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Query Echo */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-3">
        <span>
          Showing {filteredResults.length} {filteredResults.length === 1 ? 'title' : 'titles'}
          {query ? ` for "${query}"` : ''}
        </span>
        {(selectedType !== 'all' || selectedGenre !== 'All Genres' || selectedYear !== 'all') && (
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedGenre('All Genres');
              setSelectedYear('all');
              setSortBy('relevance');
            }}
            className="text-purple-400 hover:text-purple-300"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Grid or Empty / No-Results State */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
          {filteredResults.map((item) => (
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
      ) : (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
            <SearchIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white font-display">No Matches Found</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            We couldn't find any titles matching &ldquo;{query}&rdquo; with the selected filters.
            Try adjusting your search terms or resetting the genre filters.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedGenre('All Genres');
              setSelectedType('all');
              setSelectedYear('all');
            }}
            className="px-4 py-2 rounded-xl glass-button-secondary text-xs text-white"
          >
            Clear All Search Criteria
          </button>
        </div>
      )}
    </div>
  );
};
