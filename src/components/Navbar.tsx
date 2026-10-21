import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Tv, Film, Clapperboard, Home, Menu, X, Bookmark, LogOut } from 'lucide-react';
import { UserProfile } from '../types/media';

interface NavbarProps {
  currentPath: string;
  userProfile: UserProfile | null;
  onNavigate: (path: string) => void;
  onOpenSwitchUser?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  userProfile,
  onNavigate,
  onOpenSwitchUser,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Movies', path: '/movies', icon: Film },
    { label: 'Series', path: '/series', icon: Clapperboard },
    { label: 'Live TV', path: '/live', icon: Tv },
    { label: 'Search', path: '/search', icon: Search },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/home') return currentPath === '/home' || currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090D]/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('/home')}
          className="flex items-center gap-2 group text-left whitespace-nowrap shrink-0"
          aria-label="VELVET Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1017] rounded-[7px] flex items-center justify-center font-display font-black text-sm tracking-tighter text-purple-300">
              V
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold font-display tracking-widest text-white group-hover:text-purple-200 transition-colors">
            VELVET
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`relative py-1 text-sm font-medium tracking-wide transition-all whitespace-nowrap shrink-0 ${
                  active ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0" ref={menuRef}>
          {/* Quick Search Button (Mobile/Desktop) */}
          <button
            onClick={() => onNavigate('/search')}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Search movies and series"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User profile dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl glass-panel border border-white/15 hover:border-purple-400/40 transition-all text-left"
              aria-expanded={profileMenuOpen}
              aria-label="User profile menu"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline-block text-xs font-medium text-zinc-200 max-w-[90px] truncate">
                {userProfile?.name || 'Guest'}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl glass-panel-elevated border border-white/20 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs text-zinc-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {userProfile?.name || 'Cinema Explorer'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  Profile & Preferences
                </button>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigate('/profile#watchlist');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-purple-400" />
                  My Watchlist
                </button>

                {onOpenSwitchUser && (
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenSwitchUser();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-zinc-400" />
                    Switch User
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 glass-panel-elevated border-b border-white/15 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30'
                    : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-400" />
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
