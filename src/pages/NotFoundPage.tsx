import React from 'react';
import { Film, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl glass-panel-elevated border border-white/20 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 mx-auto flex items-center justify-center font-display font-black text-2xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-white">Lost in the Void</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The page or cinematic feed you were searching for has faded into obscurity or moved to a different frequency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/home')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-button-secondary text-xs font-medium text-zinc-300 hover:text-white flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
