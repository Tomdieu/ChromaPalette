import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  FolderOpen,
  Plus,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { PaletteItem, ColorObject } from '../utils/colorUtils';

export interface SavedPaletteRecord {
  id: string;
  name: string;
  createdAt: string;
  baseHex: string;
  palette: Array<{
    role: string;
    hex: string;
    name: string;
  }>;
}

interface SavedPalettesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPalettes: SavedPaletteRecord[];
  onSaveCurrentPalette: (name: string) => void;
  onLoadSavedPalette: (record: SavedPaletteRecord) => void;
  onDeleteSavedPalette: (id: string) => void;
  currentPalette: PaletteItem[];
  currentBaseColor: ColorObject;
}

export const SavedPalettesModal: React.FC<SavedPalettesModalProps> = ({
  isOpen,
  onClose,
  savedPalettes,
  onSaveCurrentPalette,
  onLoadSavedPalette,
  onDeleteSavedPalette,
  currentPalette,
  currentBaseColor,
}) => {
  const [newPaletteName, setNewPaletteName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      newPaletteName.trim() || `${currentBaseColor.name} Harmony`;
    onSaveCurrentPalette(finalName);
    setNewPaletteName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Saved Palettes Library ({savedPalettes.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Save Bar for Current Palette */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950/40">
          <div className="text-xs font-semibold text-neutral-300 mb-2">
            Save Current Active Palette:
          </div>
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input
              type="text"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              placeholder={`e.g., "${currentBaseColor.name} Studio"`}
              className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white text-neutral-950 hover:bg-neutral-200 transition-colors whitespace-nowrap active:scale-95 shadow-sm"
            >
              {saveSuccess ? (
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="h-3.5 w-3.5" /> Saved!
                </span>
              ) : (
                <span>Save to Library</span>
              )}
            </button>
          </form>

          {/* Current swatches strip */}
          <div className="flex h-4 rounded-md overflow-hidden mt-3 border border-neutral-800">
            {currentPalette.map((item) => (
              <div
                key={item.id}
                className="flex-1"
                style={{ backgroundColor: item.color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Palettes List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          {savedPalettes.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No saved palettes yet.</p>
              <p className="text-xs mt-1 text-neutral-600">
                Save your custom palettes to revisit and export them anytime.
              </p>
            </div>
          ) : (
            savedPalettes.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition-colors group flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {record.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                      <span>{record.palette.length} swatches</span>
                      <span>·</span>
                      <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onLoadSavedPalette(record)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg transition-colors border border-neutral-700"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>Load in Studio</span>
                    </button>
                    <button
                      onClick={() => onDeleteSavedPalette(record.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 rounded-lg transition-colors"
                      title="Delete saved palette"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Swatches ribbon */}
                <div className="flex h-7 rounded-lg overflow-hidden border border-neutral-800">
                  {record.palette.map((p, idx) => (
                    <div
                      key={`${record.id}-${idx}`}
                      className="flex-1 relative group/swatch"
                      style={{ backgroundColor: p.hex }}
                      title={`${p.role}: ${p.hex} (${p.name})`}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
