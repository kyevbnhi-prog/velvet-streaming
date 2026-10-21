import React, { useState, useRef, useEffect } from 'react';
import {
  Tv,
  Volume2,
  VolumeX,
  Maximize2,
  Play,
  Pause,
  Radio,
  Search,
  Filter,
  Info,
} from 'lucide-react';
import { LiveChannel } from '../types/media';

interface LivePageProps {
  channels: LiveChannel[];
  initialChannelId?: string;
  onNavigate: (path: string) => void;
}

export const LivePage: React.FC<LivePageProps> = ({
  channels,
  initialChannelId,
  onNavigate,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(() => {
    if (initialChannelId) {
      const match = channels.find((c) => c.id === initialChannelId);
      if (match) return match;
    }
    return channels[0];
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChannelList, setShowChannelList] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync channel change
  useEffect(() => {
    if (initialChannelId) {
      const match = channels.find((c) => c.id === initialChannelId);
      if (match) setSelectedChannel(match);
    }
  }, [initialChannelId, channels]);

  const categories = ['All', 'Movies', 'News', 'Sports', 'Entertainment', 'Documentary'];

  const filteredChannels = channels.filter((ch) => {
    const categoryMatch = activeCategory === 'All' || ch.category === activeCategory;
    const queryMatch =
      !searchQuery ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.currentProgram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.callsign.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && queryMatch;
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('live-player-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Live Stage Hero Player */}
      <div className="space-y-4">
        {/* Active Broadcast Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">
                  LIVE BROADCAST
                </span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-xs font-mono text-zinc-400">{selectedChannel.quality}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {selectedChannel.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/30 px-3 py-1.5 rounded-xl border border-purple-500/20">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>CHANNEL {selectedChannel.number} · {selectedChannel.callsign}</span>
          </div>
        </div>

        {/* Liquid Glass Video Player Container */}
        <div
          id="live-player-container"
          className="relative w-full aspect-video rounded-3xl overflow-hidden glass-panel-elevated border border-white/20 shadow-2xl bg-black group"
        >
          {/* Native HTML5 Video Element with Sample Stream */}
          <video
            ref={videoRef}
            src={selectedChannel.streamUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Top Glass Scrim and Live Indicator */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-white font-bold">LIVE ON AIR</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
              Demo Broadcast Simulator
            </div>
          </div>

          {/* Bottom Floating Glass Player Dock */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-3">
            {/* Program progress banner */}
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{selectedChannel.currentProgram.title}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">
                  {selectedChannel.currentProgram.startTime} - {selectedChannel.currentProgram.endTime}
                </span>
              </div>
              <span className="font-mono text-purple-300 text-[11px]">
                {selectedChannel.currentProgram.progressPercentage}% Elapsed
              </span>
            </div>

            {/* EPG Progress Bar */}
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400"
                style={{ width: `${selectedChannel.currentProgram.progressPercentage}%` }}
              />
            </div>

            {/* Glass Control Affordances */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline-block">
                  Next: {selectedChannel.upcomingProgram.title} ({selectedChannel.upcomingProgram.startTime})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Card as specified in requirements */}
        <div className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-center gap-3 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            VELVET Live TV uses simulated high-definition demo broadcast feeds. No commercial television subscriptions or external broadcast licenses are implied.
          </span>
        </div>
      </div>

      {/* Electronic Program Guide (EPG) & Channel Matrix */}
      <div className="space-y-6 pt-4">
        {/* Controls Bar: Categories & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-xl bg-black/40 border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search channel */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter channels or shows..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map((ch) => {
            const isSelected = selectedChannel.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-5 rounded-2xl glass-panel cursor-pointer transition-all duration-300 border relative ${
                  isSelected
                    ? 'border-purple-500/80 bg-purple-950/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {/* Channel Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white/5 border border-white/10 text-purple-300'
                      }`}
                    >
                      {ch.number}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{ch.name}</h3>
                      <p className="text-[11px] font-mono text-zinc-400">
                        {ch.callsign} · {ch.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    {isSelected ? 'WATCHING' : 'ON AIR'}
                  </span>
                </div>

                {/* Current Program Details */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                      Current Show
                    </span>
                    <h4 className="text-xs font-medium text-white truncate">
                      {ch.currentProgram.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {ch.currentProgram.synopsis}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>
                      {ch.currentProgram.startTime} - {ch.currentProgram.endTime}
                    </span>
                    <span>{ch.currentProgram.progressPercentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400"
                      style={{ width: `${ch.currentProgram.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Upcoming Program */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="truncate max-w-[190px]">
                    <span className="text-zinc-500">Up next:</span> {ch.upcomingProgram.title}
                  </span>
                  <span className="font-mono shrink-0">{ch.upcomingProgram.startTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
