import React, { useState } from 'react';
import {
  Dice5,
  Copy,
  Check,
  Undo2,
  Redo2,
  Pipette,
  History,
} from 'lucide-react';
import {
  ColorObject,
  GeneratorPreset,
  hexToRgb,
  buildColorObject,
} from '../utils/colorUtils';
import { ColorPositionCanvas } from './ColorPositionCanvas';

interface BaseColorStageProps {
  color: ColorObject;
  onColorChange: (newColor: ColorObject) => void;
  onRandomize: (preset: GeneratorPreset) => void;
  selectedPreset: GeneratorPreset;
  setSelectedPreset: (p: GeneratorPreset) => void;
  history: ColorObject[];
  historyIndex: number;
  onUndo: () => void;
  onRedo: () => void;
  onSelectHistoryColor: (c: ColorObject) => void;
}

const PRESET_OPTIONS: Array<{ id: GeneratorPreset; label: string }> = [
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'deep', label: 'Deep & Moody' },
  { id: 'neon', label: 'Cyber Neon' },
  { id: 'earthy', label: 'Earthy Warm' },
  { id: 'minimal', label: 'Nordic Minimal' },
  { id: 'random', label: 'Pure Wild' },
];

export const BaseColorStage: React.FC<BaseColorStageProps> = ({
  color,
  onColorChange,
  onRandomize,
  selectedPreset,
  setSelectedPreset,
  history,
  historyIndex,
  onUndo,
  onRedo,
  onSelectHistoryColor,
}) => {
  const [copiedHex, setCopiedHex] = useState(false);

  const handleCopyHex = () => {
    navigator.clipboard.writeText(color.hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1800);
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) {
      onColorChange(buildColorObject(rgb));
    }
  };

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Prominent Live Swatch Card */}
        <div className="lg:col-span-5 relative group">
          <div
            className="relative h-48 sm:h-56 w-full rounded-xl shadow-lg border border-white/10 flex flex-col justify-between p-5 transition-all duration-300 overflow-hidden"
            style={{ backgroundColor: color.hex }}
          >
            {/* Ambient lighting glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 pointer-events-none" />

            {/* Top row inside swatch */}
            <div className="relative z-10 flex items-start justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md"
                style={{
                  color: color.bestTextColor,
                  backgroundColor: color.bestTextColor === '#FFFFFF' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
                }}
              >
                Active Base Shade
              </span>

              {/* Native Eyedropper / Color Picker Trigger */}
              <label
                className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium backdrop-blur-md transition-transform active:scale-95 shadow-sm"
                style={{
                  color: color.bestTextColor,
                  backgroundColor: color.bestTextColor === '#FFFFFF' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)',
                }}
                title="Open native color picker wheel"
              >
                <Pipette className="h-3.5 w-3.5" />
                <span>Pick Wheel</span>
                <input
                  type="color"
                  value={color.hex.slice(0, 7)}
                  onChange={handleNativePickerChange}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Bottom row inside swatch */}
            <div className="relative z-10">
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
                style={{ color: color.bestTextColor }}
              >
                {color.name}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-lg font-semibold tabular-nums"
                  style={{ color: color.bestTextColor }}
                >
                  {color.hex}
                </span>
                <button
                  type="button"
                  onClick={handleCopyHex}
                  className="p-1 rounded transition-colors"
                  style={{
                    color: color.bestTextColor,
                    backgroundColor: color.bestTextColor === '#FFFFFF' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.3)',
                  }}
                  title="Copy Hex"
                >
                  {copiedHex ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Color Diagnostics, Generator Controls & History */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
          {/* Top: Randomizer Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Random Color Generator
              </span>

              {/* History undo/redo */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onUndo}
                  disabled={historyIndex <= 0}
                  className={`p-1.5 rounded transition-colors ${
                    historyIndex > 0
                      ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                      : 'text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Previous generated color"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`p-1.5 rounded transition-colors ${
                    historyIndex < history.length - 1
                      ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                      : 'text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Next generated color"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Generator Mood Presets Segmented Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-lg mb-3">
              {PRESET_OPTIONS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedPreset === preset.id
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Big Generator CTA Button */}
            <button
              onClick={() => onRandomize(selectedPreset)}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-medium text-sm rounded-lg border border-neutral-600/50 shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              <Dice5 className="h-4 w-4 text-sky-400 animate-spin-slow" />
              <span>Generate Random {PRESET_OPTIONS.find(p => p.id === selectedPreset)?.label} Shade</span>
              <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300 bg-neutral-900 border border-neutral-700 rounded">
                Space
              </kbd>
            </button>
          </div>

          {/* Quick Metrics Bar: Contrast & Luminance */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
            <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-medium">Luminance</div>
              <div className="text-sm font-mono font-semibold text-neutral-200 tabular-nums">
                {(color.luminance * 100).toFixed(1)}%
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-medium">Contrast vs White</div>
              <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-neutral-200 tabular-nums">
                <span>{color.contrastWhite}:1</span>
                {color.contrastWhite >= 4.5 && (
                  <span className="text-[10px] font-sans font-medium text-emerald-400">AA</span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 font-medium">Contrast vs Black</div>
              <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-neutral-200 tabular-nums">
                <span>{color.contrastBlack}:1</span>
                {color.contrastBlack >= 4.5 && (
                  <span className="text-[10px] font-sans font-medium text-emerald-400">AA</span>
                )}
              </div>
            </div>
          </div>

          {/* Recent History Swatches */}
          {history.length > 1 && (
            <div className="pt-2 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-neutral-500 shrink-0 flex items-center gap-1">
                <History className="h-3 w-3" />
                <span>Recent:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {history.slice(-8).reverse().map((histItem, idx) => (
                  <button
                    key={`${histItem.hex}-${idx}`}
                    onClick={() => onSelectHistoryColor(histItem)}
                    className="h-6 w-6 rounded-md border border-white/20 hover:scale-110 transition-transform shrink-0 shadow-inner"
                    style={{ backgroundColor: histItem.hex }}
                    title={`${histItem.name} (${histItem.hex})`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive 2D Color Position Plane & Lightness Position Track */}
      <div className="mt-5 pt-5 border-t border-neutral-800/80">
        <ColorPositionCanvas
          color={color}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  );
};
