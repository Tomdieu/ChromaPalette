import React from 'react';
import { Sparkles, Download, Bookmark, Layers, Eye, ShieldCheck, Dice5 } from 'lucide-react';
import { ColorObject } from '../utils/colorUtils';

export type ActiveTab = 'studio' | 'preview' | 'contrast' | 'saved';

interface TopNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  baseColor: ColorObject;
  onRandomize: () => void;
  onOpenExport: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  baseColor,
  onRandomize,
  onOpenExport,
  onOpenSaved,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <div
            className="h-4 w-4 rounded-full shadow-sm transition-colors duration-300 ring-2 ring-white/10"
            style={{ backgroundColor: baseColor.hex }}
            aria-hidden="true"
          />
          <button
            onClick={() => setActiveTab('studio')}
            className="text-left text-base font-bold tracking-tight text-white hover:text-neutral-200 transition-colors"
          >
            ChromaForge
          </button>
        </div>

        {/* Zone 2: Navigation Links / Mode Switchers */}
        <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="Main Navigation">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Studio & Palettes</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>UI Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('contrast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'contrast'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Contrast Matrix</span>
          </button>

          <button
            onClick={onOpenSaved}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved ({savedCount})</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRandomize}
            title="Generate Random Color (Shortcut: Space)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-700/80 rounded-md hover:bg-neutral-800 hover:text-white transition-colors whitespace-nowrap active:scale-95"
          >
            <Dice5 className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Randomize</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800 border border-neutral-700 rounded">
              Space
            </kbd>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors whitespace-nowrap shadow-sm active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
