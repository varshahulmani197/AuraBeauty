import React from 'react';
import { Camera, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenApiSettings: () => void;
  activeSection: string;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenApiSettings,
  activeSection,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>AuraBeauty</span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <a
            href="#scanner"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeSection === 'scanner' ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            Scanner
          </a>
          <a
            href="#segments"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeSection === 'segments' ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            Face Segments
          </a>
          <a
            href="#myshelf"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeSection === 'myshelf' ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            MyShelf
          </a>
          <a
            href="#history"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeSection === 'history' ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            Skin History
          </a>
          <a
            href="#routine"
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeSection === 'routine' ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            Routine
          </a>
          <button
            onClick={onOpenApiSettings}
            className="whitespace-nowrap shrink-0 text-stone-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider font-mono"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Perfect Corp API</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{hasResult ? 'Scan Another Selfie' : 'Analyze Selfie'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
