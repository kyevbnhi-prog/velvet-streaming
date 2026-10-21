import React, { useState } from 'react';
import {
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Film,
  Sparkles,
  ArrowLeft,
  Share2,
  Calendar,
  Volume2,
} from 'lucide-react';
import { MediaItem } from '../types/media';
import { ContentCard } from '../components/ContentCard';

interface DetailsPageProps {
  contentId: string;
  catalog: MediaItem[];
  watchlistIds: string[];
  savedProgressPercentage?: number;
  onPlay: (item: MediaItem, episodeId?: string) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  onBack: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DetailsPage: React.FC<DetailsPageProps> = ({
  contentId,
  catalog,
  watchlistIds,
  savedProgressPercentage,
  onPlay,
  onSelect,
  onToggleWatchlist,
  onBack,
  onShowToast,
}) => {
  const item = catalog.find((m) => m.id === contentId);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);

  if (!item) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">Title Not Found</h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          The requested movie or series ID could not be located in the VELVET archive.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white"
        >
          Return to Cinema
        </button>
      </div>
    );
  }

  const isWatchlisted = watchlistIds.includes(item.id);
  const similarTitles = catalog.filter(
    (m) => m.id !== item.id && m.genres.some((g) => item.genres.includes(g))
  );

  const activeSeason =
    item.seasons?.find((s) => s.seasonNumber === selectedSeasonNumber) || item.seasons?.[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Direct streaming link copied to clipboard', 'success');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Backdrop Stage */}
      <div className="relative w-full h-[65vh] min-h-[500px] max-h-[750px] overflow-hidden">
        <img
          src={item.backdrop || item.poster}
          alt={item.title}
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/70 to-transparent" />

        {/* Back navigation button */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl glass-panel text-xs text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-56 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Vertical Poster Column */}
          <div className="w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden glass-panel-elevated border border-white/20 shadow-2xl shrink-0 hidden sm:block">
            <img
              src={item.poster || item.backdrop}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metadata & Actions Column */}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-purple-300">
              <span>{item.qualityBadge || '4K HDR DOLBY VISION'}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{item.type.toUpperCase()}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">{item.contentRating}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight drop-shadow-xl text-balance">
              {item.title}
            </h1>

            {item.tagline && (
              <p className="text-sm sm:text-base italic text-purple-200 font-display">
                &ldquo;{item.tagline}&rdquo;
              </p>
            )}

            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 font-mono">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="w-4 h-4 fill-amber-300" />
                {item.rating.toFixed(1)} / 10
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{item.releaseYear}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{item.duration}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>{item.genres.join(' · ')}</span>
            </div>

            {/* Resume Progress banner if active */}
            {typeof savedProgressPercentage === 'number' && savedProgressPercentage > 0 && (
              <div className="p-3 rounded-xl glass-panel border border-purple-500/30 bg-purple-950/20 flex items-center justify-between text-xs">
                <span className="text-purple-300 font-mono">
                  Resume watching: {savedProgressPercentage}% completed
                </span>
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400"
                    style={{ width: `${savedProgressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPlay(item)}
                className="px-6 py-3 rounded-xl glass-button-primary flex items-center gap-2.5 text-sm font-semibold text-white tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {savedProgressPercentage && savedProgressPercentage > 0 ? 'Resume Playing' : 'Play Title'}
                </span>
              </button>

              <button
                onClick={() => onToggleWatchlist(item)}
                className="px-4 py-3 rounded-xl glass-button-secondary flex items-center gap-2 text-sm text-white"
              >
                {isWatchlisted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Watchlisted</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl glass-button-secondary text-zinc-300 hover:text-white"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                Storyline
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                {item.description}
              </p>
            </div>

            {/* Cast & Crew */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono text-zinc-400 block mb-1">DIRECTOR</span>
                <span className="text-white font-medium">{item.director}</span>
              </div>
              <div>
                <span className="font-mono text-zinc-400 block mb-1">STARRING CAST</span>
                <span className="text-zinc-200">{item.cast.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Series Seasons and Episodes Navigator */}
        {item.type === 'series' && item.seasons && item.seasons.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold font-display text-white">Episodes & Chapters</h3>

              {/* Season selector tabs */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                {item.seasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedSeasonNumber === s.seasonNumber
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Season {s.seasonNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode List */}
            {activeSeason && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSeason.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onPlay(item, ep.id)}
                    className="p-4 rounded-2xl glass-card border border-white/10 hover:border-purple-400/40 cursor-pointer flex gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold shrink-0 group-hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 fill-purple-300" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                        <span>Episode {ep.episodeNumber}</span>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span>{ep.duration}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Similar Titles Grid */}
        {similarTitles.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-xl font-bold font-display text-white">More Like This</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarTitles.slice(0, 6).map((similar) => (
                <ContentCard
                  key={similar.id}
                  item={similar}
                  layout="poster"
                  onPlay={onPlay}
                  onSelect={onSelect}
                  onToggleWatchlist={onToggleWatchlist}
                  isWatchlisted={watchlistIds.includes(similar.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
