import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#08090D] py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-display font-black text-xs text-purple-200">
              V
            </div>
            <span className="text-lg font-bold font-display tracking-widest text-white">
              VELVET
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm">
            Ultra-dark luxury Video-on-Demand & Live TV streaming powered by modern Liquid Glass aesthetics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
          <button onClick={() => onNavigate('/home')} className="hover:text-purple-300 transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('/movies')} className="hover:text-purple-300 transition-colors">
            Movies
          </button>
          <button onClick={() => onNavigate('/series')} className="hover:text-purple-300 transition-colors">
            Series
          </button>
          <button onClick={() => onNavigate('/live')} className="hover:text-purple-300 transition-colors">
            Live TV
          </button>
          <button onClick={() => onNavigate('/search')} className="hover:text-purple-300 transition-colors">
            Search
          </button>
          <button onClick={() => onNavigate('/profile')} className="hover:text-purple-300 transition-colors">
            Account Profile
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-4">
        <p>© 2026 VELVET Cinema Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Privacy Policy</span>
          <span aria-hidden="true">·</span>
          <span>Terms of Streaming</span>
          <span aria-hidden="true">·</span>
          <span>Liquid Glass Engine</span>
        </div>
      </div>
    </footer>
  );
};
