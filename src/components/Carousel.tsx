import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types/media';
import { ContentCard } from './ContentCard';

interface CarouselProps {
  title: string;
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  watchlistIds: string[];
  continueWatchingMap?: Record<string, number>;
  layout?: 'poster' | 'landscape';
  viewAllLink?: string;
  onNavigate?: (path: string) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  title,
  items,
  onPlay,
  onSelect,
  onToggleWatchlist,
  watchlistIds,
  continueWatchingMap,
  layout = 'poster',
  viewAllLink,
  onNavigate,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative my-6 space-y-3">
      {/* Header */}
      <div className="flex items-baseline justify-between px-4 sm:px-8">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white font-display">
          {title}
        </h3>
        {viewAllLink && onNavigate && (
          <button
            onClick={() => onNavigate(viewAllLink)}
            className="text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Explore all
          </button>
        )}
      </div>

      {/* Row container with floating nav arrows */}
      <div className="group/row relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel-elevated border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 hidden sm:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto px-4 sm:px-8 py-2 no-scrollbar scroll-smooth"
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              layout={layout}
              onPlay={onPlay}
              onSelect={onSelect}
              onToggleWatchlist={onToggleWatchlist}
              isWatchlisted={watchlistIds.includes(item.id)}
              progressPercentage={continueWatchingMap?.[item.id]}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel-elevated border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 hidden sm:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
