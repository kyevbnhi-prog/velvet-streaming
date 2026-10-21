import React, { useState } from 'react';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { MediaItem } from '../types/media';

interface ContentCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isWatchlisted: boolean;
  progressPercentage?: number;
  layout?: 'poster' | 'landscape';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onPlay,
  onSelect,
  onToggleWatchlist,
  isWatchlisted,
  progressPercentage,
  layout = 'poster',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = layout === 'landscape' ? item.backdrop || item.poster : item.poster || item.backdrop;

  return (
    <div
      className={`group relative flex-shrink-0 cursor-pointer select-none rounded-xl overflow-hidden glass-card transition-all duration-300 ${
        layout === 'landscape' ? 'w-72 sm:w-80 aspect-video' : 'w-44 sm:w-52 aspect-[2/3]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item)}
    >
      {/* Background artwork or styled fallback */}
      {!imageError && imageSrc ? (
        <img
          src={imageSrc}
          alt={item.title}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#121624] via-[#1a1528] to-[#0a0d14] p-4 flex flex-col justify-between border border-white/5">
          <div className="text-[10px] font-mono tracking-wider text-purple-400 uppercase">
            {item.genres[0] || 'CINEMA'}
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90 line-clamp-2">{item.title}</div>
            <div className="text-xs text-zinc-400 mt-1">{item.releaseYear}</div>
          </div>
        </div>
      )}

      {/* Subtle glass reflection gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none opacity-80 group-hover:opacity-95 transition-opacity" />

      {/* Progress Bar for Continue Watching */}
      {typeof progressPercentage === 'number' && progressPercentage > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(3, progressPercentage))}%` }}
          />
        </div>
      )}

      {/* Hover action bar overlay */}
      <div
        className={`absolute inset-0 p-3 flex flex-col justify-between transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top actions */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-purple-300/90 tracking-wide">
            {item.type === 'series' ? 'SERIES' : 'MOVIE'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(item);
            }}
            className="p-1.5 rounded-full bg-black/60 hover:bg-purple-600/80 border border-white/20 text-white transition-colors"
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label="Toggle Watchlist"
          >
            {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center play icon */}
        <div className="flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="w-11 h-11 rounded-full glass-button-primary flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
            aria-label={`Play ${item.title}`}
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Bottom card details */}
        <div>
          <h4 className="text-sm font-semibold text-white truncate drop-shadow-md">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-zinc-300 mt-1 font-mono">
            <span>{item.releaseYear}</span>
            <span aria-hidden="true" className="text-zinc-500">·</span>
            <span className="flex items-center gap-0.5 text-amber-300">
              <Star className="w-3 h-3 fill-amber-300" />
              {item.rating.toFixed(1)}
            </span>
            <span aria-hidden="true" className="text-zinc-500">·</span>
            <span className="truncate">{item.duration}</span>
          </div>
        </div>
      </div>

      {/* Non-hover quiet title for mobile / static view */}
      <div
        className={`absolute bottom-2 left-3 right-3 transition-opacity duration-200 pointer-events-none ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="text-xs font-medium text-white/90 truncate drop-shadow">
          {item.title}
        </p>
        <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-mono">
          <span>{item.releaseYear}</span>
          <span aria-hidden="true">·</span>
          <span>{item.genres[0]}</span>
        </p>
      </div>
    </div>
  );
};
