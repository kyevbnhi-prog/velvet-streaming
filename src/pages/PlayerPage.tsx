import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowLeft,
  RotateCcw,
  RotateCw,
  FastForward,
  SkipBack,
  SkipForward,
  Subtitles,
  Settings,
  Check,
} from 'lucide-react';
import { MediaItem } from '../types/media';
import { StorageService } from '../services/storageService';

interface PlayerPageProps {
  contentId: string;
  episodeId?: string;
  catalog: MediaItem[];
  onBack: () => void;
  onNavigateToContent: (id: string, epId?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({
  contentId,
  episodeId,
  catalog,
  onBack,
  onNavigateToContent,
  onShowToast,
}) => {
  const item = catalog.find((m) => m.id === contentId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('4K 2160p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);

  // Active episode if series
  const activeEpisode = item?.seasons
    ?.flatMap((s) => s.episodes)
    .find((ep) => ep.id === episodeId);

  const videoSource =
    activeEpisode?.videoUrl || item?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  // Format time mm:ss or hh:mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Activity timer to fade controls
  const handleUserActivity = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
        setShowSpeedMenu(false);
        setShowQualityMenu(false);
      }
    }, 3200);
  }, [isPlaying]);

  // Check saved progress on mount
  useEffect(() => {
    if (!item) return;
    const progressRecords = StorageService.getContinueWatching();
    const existing = progressRecords.find((p) => p.contentId === item.id);
    if (existing && existing.timestamp > 5 && !hasResumed) {
      if (videoRef.current) {
        videoRef.current.currentTime = existing.timestamp;
        setHasResumed(true);
        onShowToast(`Resumed from ${formatTime(existing.timestamp)}`, 'info');
      }
    }
  }, [item, hasResumed, onShowToast]);

  // Periodic progress saving
  useEffect(() => {
    if (!item) return;
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && duration > 0) {
        StorageService.saveProgress(item.id, videoRef.current.currentTime, duration, episodeId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [item, duration, episodeId]);

  // Keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      handleUserActivity();

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'ArrowRight') {
        seekRelative(10);
      } else if (e.code === 'ArrowLeft') {
        seekRelative(-10);
      } else if (e.code === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isFullscreen, handleUserActivity]);

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

  const seekRelative = (delta: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const target = !isMuted;
      videoRef.current.muted = target;
      setIsMuted(target);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Next / Previous Episode helpers
  const allEpisodes = item?.seasons?.flatMap((s) => s.episodes) || [];
  const currentEpIndex = allEpisodes.findIndex((ep) => ep.id === episodeId);
  const nextEpisode = currentEpIndex >= 0 && currentEpIndex < allEpisodes.length - 1 ? allEpisodes[currentEpIndex + 1] : null;
  const prevEpisode = currentEpIndex > 0 ? allEpisodes[currentEpIndex - 1] : null;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="p-8 rounded-2xl glass-panel text-center space-y-3">
          <p className="text-white font-medium">Video title not found</p>
          <button onClick={onBack} className="px-4 py-2 rounded-xl glass-button-primary text-xs">
            Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      onTouchStart={handleUserActivity}
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.volume = volume;
          }
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (nextEpisode) {
            onShowToast(`Up next: ${nextEpisode.title}`, 'info');
            onNavigateToContent(item.id, nextEpisode.id);
          }
        }}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin" />
        </div>
      )}

      {/* Top Glass Navigation Bar Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-xs sm:text-sm font-medium text-white hover:border-purple-400/50 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center truncate px-4">
          <h2 className="text-sm sm:text-base font-bold text-white font-display truncate">
            {item.title}
          </h2>
          {activeEpisode && (
            <p className="text-xs text-purple-300 font-mono truncate">
              Episode {activeEpisode.episodeNumber}: {activeEpisode.title}
            </p>
          )}
        </div>

        <div className="w-16 flex justify-end">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 text-zinc-300 border border-white/10">
            {selectedQuality}
          </span>
        </div>
      </div>

      {/* Subtitles Overlay (Simulated Cinematic Captions) */}
      {subtitlesEnabled && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg bg-black/80 text-white font-sans text-sm sm:text-base text-center max-w-xl pointer-events-none shadow-lg border border-white/10">
          [Dramatic orchestral music playing]
        </div>
      )}

      {/* Bottom Liquid Glass Player Controls Dock */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3 transition-opacity duration-300 z-30 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Interactive Scrub Bar */}
        <div className="relative group/seeker flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-lg appearance-none cursor-pointer accent-purple-500 transition-all"
            aria-label="Video Seek Bar"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Controls: Play, Jump, Volume, Clock */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full glass-button-primary flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Previous Episode if available */}
            {prevEpisode && (
              <button
                onClick={() => onNavigateToContent(item.id, prevEpisode.id)}
                className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                title={`Previous Episode: ${prevEpisode.title}`}
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            {/* Jump -10s */}
            <button
              onClick={() => seekRelative(-10)}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Jump +10s */}
            <button
              onClick={() => seekRelative(10)}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Fast forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Episode if available */}
            {nextEpisode && (
              <button
                onClick={() => onNavigateToContent(item.id, nextEpisode.id)}
                className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                title={`Next Episode: ${nextEpisode.title}`}
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="p-2 rounded-xl text-zinc-300 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
                aria-label="Volume Slider"
              />
            </div>

            {/* Time Indicators */}
            <div className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <span>{formatTime(currentTime)}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Subtitles, Speed, Quality, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Subtitles Toggle */}
            <button
              onClick={() => {
                setSubtitlesEnabled(!subtitlesEnabled);
                onShowToast(subtitlesEnabled ? 'Subtitles turned off' : 'Subtitles turned on (English CC)', 'info');
              }}
              className={`p-2 rounded-xl transition-colors ${
                subtitlesEnabled ? 'bg-purple-600/30 text-purple-300 border border-purple-400/30' : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Subtitles"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowQualityMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 p-1.5 rounded-xl glass-panel-elevated border border-white/20 shadow-2xl space-y-1 z-40 min-w-[80px]">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedSelect(s)}
                      className={`w-full px-2 py-1 text-xs font-mono rounded-lg flex items-center justify-between ${
                        playbackSpeed === s ? 'bg-purple-600 text-white' : 'text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{s}x</span>
                      {playbackSpeed === s && <Check className="w-3 h-3 ml-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowSpeedMenu(false);
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Stream Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-12 right-0 p-2 rounded-xl glass-panel-elevated border border-white/20 shadow-2xl space-y-1 z-40 min-w-[130px]">
                  <p className="text-[10px] font-mono text-zinc-400 px-2 py-1">STREAM QUALITY</p>
                  {['4K 2160p', '1080p Full HD', '720p HD'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowQualityMenu(false);
                        onShowToast(`Stream quality set to ${q}`, 'info');
                      }}
                      className={`w-full px-2 py-1 text-xs font-mono rounded-lg flex items-center justify-between ${
                        selectedQuality === q ? 'bg-purple-600 text-white' : 'text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{q}</span>
                      {selectedQuality === q && <Check className="w-3 h-3 ml-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Fullscreen"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
