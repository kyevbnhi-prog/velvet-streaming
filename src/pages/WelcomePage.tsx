import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, User, PlayCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile } from '../types/media';

interface WelcomePageProps {
  onContinue: (profile: UserProfile) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onContinue }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const existing = StorageService.getProfile();
    if (existing && existing.name.trim()) {
      setSavedProfile(existing);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your name to begin streaming.');
      return;
    }
    if (cleanName.length < 2) {
      setError('Display name should be at least 2 characters.');
      return;
    }
    setError('');
    const profile = StorageService.saveProfile({ name: cleanName });
    onContinue(profile);
  };

  const handleContinueSaved = () => {
    if (savedProfile) {
      onContinue(savedProfile);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#08090D]">
      {/* Cinematic ambient background glow and radial spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-600/15 blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[160px]" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
      </div>

      {/* Background ambient grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Liquid Glass Welcome Card */}
      <div className="relative z-10 w-full max-w-lg p-8 sm:p-12 rounded-3xl glass-panel-elevated border border-white/20 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-500">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Liquid Glass Cinema Engine</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-[#0d1017] rounded-[11px] flex items-center justify-center font-display font-black text-xl text-purple-300">
                V
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-widest text-white">
              VELVET
            </h1>
          </div>

          <p className="text-lg sm:text-xl font-medium text-zinc-200 font-display">
            Your next favorite story starts here.
          </p>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Experience ultra-dark luxury cinema, high-definition series, and live television wrapped in translucent Apple visionOS-inspired glass.
          </p>
        </div>

        {/* Existing saved profile shortcut */}
        {savedProfile && (
          <div className="mt-8 p-4 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-inner">
                  {savedProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Welcome back</p>
                  <p className="text-sm font-semibold text-white">{savedProfile.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleContinueSaved}
                className="px-4 py-2 text-xs font-semibold rounded-xl glass-button-primary flex items-center gap-1.5 text-white"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Form input for new/custom name */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="user-name" className="block text-xs font-medium text-zinc-300">
              {savedProfile ? 'Or switch to another profile name' : 'Enter your name to personalize your cinema room'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Adrian Vane"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-zinc-500 focus:ring-1 focus:ring-purple-400"
                autoComplete="off"
                autoFocus={!savedProfile}
              />
            </div>
            {error && <p className="text-xs text-rose-400 pl-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl glass-button-primary flex items-center justify-center gap-2 text-sm font-semibold text-white tracking-wide shadow-lg group"
          >
            <span>Launch Cinema</span>
            <PlayCircle className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Footer feature markers */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-around text-center text-[11px] text-zinc-400 font-mono">
          <div>
            <span className="block text-zinc-200 font-bold">4K HDR</span>
            <span>Spatial Audio</span>
          </div>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <div>
            <span className="block text-zinc-200 font-bold">Live Channels</span>
            <span>Zero Buffer</span>
          </div>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <div>
            <span className="block text-zinc-200 font-bold">Local Sync</span>
            <span>Private Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
