/**
 * ChromaForge - Color Studio & Custom Palette Generator
 * Generate random colors, paste any color code format, fine-tune shades, and create custom palettes.
 */

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import {
  ColorObject,
  GeneratorPreset,
  HarmonyType,
  PaletteItem,
  buildColorObject,
  hexToRgb,
  generateRandomColor,
  generatePaletteFromShade,
  adjustColor,
} from './utils/colorUtils';
import { TopNavbar, ActiveTab } from './components/TopNavbar';
import { ColorInputBar } from './components/ColorInputBar';
import { BaseColorStage } from './components/BaseColorStage';
import { ShadeModifierDeck } from './components/ShadeModifierDeck';
import { PaletteGeneratorDeck } from './components/PaletteGeneratorDeck';
import { UIPreviewLab } from './components/UIPreviewLab';
import { ContrastMatrixView } from './components/ContrastMatrixView';
import { ExportModal } from './components/ExportModal';
import { SavedPalettesModal, SavedPaletteRecord } from './components/SavedPalettesModal';
import { Check, Sparkles, Layers, Sliders, Palette } from 'lucide-react';

const STORAGE_SAVED_KEY = 'chromaforge_saved_palettes_v1';

// Initial default base shade: Electric Indigo
const INITIAL_HEX = '#4F46E5';
const initialRgb = hexToRgb(INITIAL_HEX) || { r: 79, g: 70, b: 229 };
const initialBaseColor = buildColorObject(initialRgb);

export default function App() {
  const [baseColor, setBaseColor] = useState<ColorObject>(initialBaseColor);
  const [harmony, setHarmony] = useState<HarmonyType>('ui-cohesive');
  const [palette, setPalette] = useState<PaletteItem[]>(() =>
    generatePaletteFromShade(initialBaseColor, 'ui-cohesive')
  );

  // History stack for Undo / Redo
  const [history, setHistory] = useState<ColorObject[]>([initialBaseColor]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  // Randomizer mood preset
  const [selectedPreset, setSelectedPreset] = useState<GeneratorPreset>('vibrant');

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Saved library in local storage
  const [savedPalettes, setSavedPalettes] = useState<SavedPaletteRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'seed-1',
        name: 'Electric Studio Brand',
        createdAt: new Date().toISOString(),
        baseHex: '#4F46E5',
        palette: [
          { role: 'Primary Anchor', hex: '#4F46E5', name: 'Electric Indigo' },
          { role: 'Action Accent', hex: '#7C3AED', name: 'Neon Violet' },
          { role: 'Surface Tint', hex: '#EEF2FF', name: 'Alabaster' },
          { role: 'Subtle Slate', hex: '#475569', name: 'Slate Gray' },
          { role: 'Dark Surface', hex: '#0F172A', name: 'Obsidian' },
        ],
      },
    ];
  });

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedPalettes));
    } catch {
      // Ignore
    }
  }, [savedPalettes]);

  // Load from URL hash if provided
  useEffect(() => {
    try {
      if (window.location.hash.startsWith('#palette=')) {
        const rawJson = decodeURIComponent(window.location.hash.replace('#palette=', ''));
        const parsed = JSON.parse(rawJson);
        if (parsed.base) {
          const rgb = hexToRgb(parsed.base);
          if (rgb) {
            const colorObj = buildColorObject(rgb);
            setBaseColor(colorObj);
            setPalette(generatePaletteFromShade(colorObj, harmony));
            setHistory([colorObj]);
            setHistoryIndex(0);
          }
        }
      }
    } catch {
      // Ignore invalid hash
    }
  }, []);

  // Update palette whenever baseColor or harmony changes
  const updateBaseColorAndPalette = useCallback(
    (newColor: ColorObject, newHarmony?: HarmonyType, pushHistory = true) => {
      const activeHarmony = newHarmony || harmony;
      setBaseColor(newColor);
      if (newHarmony) {
        setHarmony(newHarmony);
      }
      setPalette(prevPalette => generatePaletteFromShade(newColor, activeHarmony, prevPalette));

      if (pushHistory) {
        setHistory(prev => {
          const next = prev.slice(0, historyIndex + 1);
          return [...next, newColor];
        });
        setHistoryIndex(prev => prev + 1);
      }
    },
    [harmony, historyIndex]
  );

  // Generate a random color
  const handleRandomize = useCallback(
    (preset: GeneratorPreset = selectedPreset) => {
      const nextColor = generateRandomColor(preset);
      updateBaseColorAndPalette(nextColor, undefined, true);
    },
    [selectedPreset, updateBaseColorAndPalette]
  );

  // Keyboard shortcut: Spacebar randomizes color if not typing in input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        if (!isInput && !isExportOpen && !isSavedModalOpen) {
          e.preventDefault();
          handleRandomize();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRandomize, isExportOpen, isSavedModalOpen]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      const targetColor = history[newIdx];
      setHistoryIndex(newIdx);
      setBaseColor(targetColor);
      setPalette(generatePaletteFromShade(targetColor, harmony));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      const targetColor = history[newIdx];
      setHistoryIndex(newIdx);
      setBaseColor(targetColor);
      setPalette(generatePaletteFromShade(targetColor, harmony));
    }
  };

  const handleSelectHistoryColor = (color: ColorObject) => {
    updateBaseColorAndPalette(color, undefined, true);
  };

  // Modify Base Color through Fine-tuning sliders
  const handleModifyColor = (modifiedColor: ColorObject) => {
    setBaseColor(modifiedColor);
    setPalette(prevPalette => generatePaletteFromShade(modifiedColor, harmony, prevPalette));
  };

  // Harmony type toggle
  const handleHarmonyChange = (newHarmony: HarmonyType) => {
    setHarmony(newHarmony);
    setPalette(generatePaletteFromShade(baseColor, newHarmony));
  };

  // Individual Palette Swatch Operations
  const handleToggleLock = (id: string) => {
    setPalette(prev =>
      prev.map(item => (item.id === id ? { ...item, locked: !item.locked } : item))
    );
  };

  const handleUpdatePaletteItem = (id: string, updatedColor: ColorObject) => {
    setPalette(prev =>
      prev.map(item => (item.id === id ? { ...item, color: updatedColor } : item))
    );
  };

  const handleSetAsBaseShade = (color: ColorObject) => {
    updateBaseColorAndPalette(color, undefined, true);
  };

  const handleRemoveItem = (id: string) => {
    if (palette.length <= 2) return;
    setPalette(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (palette.length >= 12) return;
    // Add harmonic shift
    const lastItem = palette[palette.length - 1];
    const shiftH = (lastItem.color.hsl.h + 30) % 360;
    const newColor = adjustColor(lastItem.color, { hue: shiftH });
    const newItem: PaletteItem = {
      id: `custom-add-${Date.now()}`,
      color: newColor,
      role: `Accent ${palette.length + 1}`,
      locked: false,
    };
    setPalette(prev => [...prev, newItem]);
  };

  const handleMoveItem = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= palette.length) return;
    const copy = [...palette];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setPalette(copy);
  };

  // Save to Library
  const handleSaveCurrentPalette = (name: string) => {
    const newRecord: SavedPaletteRecord = {
      id: `saved-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      baseHex: baseColor.hex,
      palette: palette.map(p => ({
        role: p.role,
        hex: p.color.hex,
        name: p.color.name,
      })),
    };
    setSavedPalettes(prev => [newRecord, ...prev]);
  };

  const handleLoadSavedPalette = (record: SavedPaletteRecord) => {
    const baseRgb = hexToRgb(record.baseHex);
    if (baseRgb) {
      const baseObj = buildColorObject(baseRgb);
      setBaseColor(baseObj);
    }
    const restoredItems: PaletteItem[] = record.palette.map((p, idx) => {
      const rgb = hexToRgb(p.hex) || { r: 128, g: 128, b: 128 };
      return {
        id: `loaded-${idx}-${Date.now()}`,
        color: buildColorObject(rgb),
        role: p.role,
        locked: false,
      };
    });
    setPalette(restoredItems);
    setIsSavedModalOpen(false);
  };

  const handleDeleteSavedPalette = (id: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      {/* 1. Header (Adhering to strict 3-zone contract) */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        baseColor={baseColor}
        onRandomize={() => handleRandomize()}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedPalettes.length}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Universal Color Input Station (Always visible & accessible at the top) */}
        <section aria-label="Color Code Input Station">
          <ColorInputBar
            onColorSelect={(c) => updateBaseColorAndPalette(c, undefined, true)}
            currentColorHex={baseColor.hex}
          />
        </section>

        {/* View Switcher: Studio & Palettes | UI Preview | Contrast Matrix */}
        {activeTab === 'studio' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Base Color Stage (Swatches, Mood Presets, Randomizer, Diagnostics) */}
            <section aria-label="Active Base Shade Stage">
              <BaseColorStage
                color={baseColor}
                onColorChange={handleModifyColor}
                onRandomize={handleRandomize}
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
                history={history}
                historyIndex={historyIndex}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onSelectHistoryColor={handleSelectHistoryColor}
              />
            </section>

            {/* Shade Modifier & Fine-Tuning Sliders Deck */}
            <section aria-label="Shade Modifier and Sliders">
              <ShadeModifierDeck
                color={baseColor}
                onColorChange={handleModifyColor}
              />
            </section>

            {/* Custom Palette Generated from the Specific Base Shade */}
            <section aria-label="Custom Palette Generator">
              <PaletteGeneratorDeck
                baseColor={baseColor}
                palette={palette}
                harmony={harmony}
                onHarmonyChange={handleHarmonyChange}
                onUpdatePaletteItem={handleUpdatePaletteItem}
                onToggleLock={handleToggleLock}
                onSetAsBaseShade={handleSetAsBaseShade}
                onRemoveItem={handleRemoveItem}
                onAddItem={handleAddItem}
                onMoveItem={handleMoveItem}
                onSaveToLibrary={() => setIsSavedModalOpen(true)}
              />
            </section>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="animate-in fade-in duration-150">
            <UIPreviewLab baseColor={baseColor} palette={palette} />
          </div>
        )}

        {activeTab === 'contrast' && (
          <div className="animate-in fade-in duration-150">
            <ContrastMatrixView palette={palette} baseColor={baseColor} />
          </div>
        )}
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        palette={palette}
        baseColor={baseColor}
      />

      <SavedPalettesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPalettes={savedPalettes}
        onSaveCurrentPalette={handleSaveCurrentPalette}
        onLoadSavedPalette={handleLoadSavedPalette}
        onDeleteSavedPalette={handleDeleteSavedPalette}
        currentPalette={palette}
        currentBaseColor={baseColor}
      />
    </div>
  );
}
