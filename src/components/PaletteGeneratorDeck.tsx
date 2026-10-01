import React, { useState } from 'react';
import {
  Palette,
  Lock,
  Unlock,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  Sliders,
  BookmarkPlus,
  Wand2,
} from 'lucide-react';
import {
  ColorObject,
  HarmonyType,
  PaletteItem,
  generatePaletteFromShade,
  buildColorObject,
  hexToRgb,
} from '../utils/colorUtils';

interface PaletteGeneratorDeckProps {
  baseColor: ColorObject;
  palette: PaletteItem[];
  harmony: HarmonyType;
  onHarmonyChange: (harmony: HarmonyType) => void;
  onUpdatePaletteItem: (id: string, updatedColor: ColorObject) => void;
  onToggleLock: (id: string) => void;
  onSetAsBaseShade: (color: ColorObject) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
  onMoveItem: (index: number, direction: 'left' | 'right') => void;
  onSaveToLibrary: () => void;
}

const HARMONY_TABS: Array<{ id: HarmonyType; label: string; desc: string }> = [
  { id: 'monochromatic', label: 'Monochromatic', desc: 'Tints & shades of your exact base shade' },
  { id: 'ui-cohesive', label: 'UI Cohesive', desc: 'Primary, action accent, surface, slate & dark tokens' },
  { id: 'analogous', label: 'Analogous', desc: 'Harmonious adjacent hue shifts on the color wheel' },
  { id: 'complementary', label: 'Complementary', desc: 'High-contrast complementary opposite balance' },
  { id: 'split-complementary', label: 'Split-Comp', desc: 'Base shade paired with two adjacent opposites' },
  { id: 'triadic', label: 'Triadic', desc: 'Equilateral 120° geometric harmony' },
  { id: 'tetradic', label: 'Tetradic', desc: 'Dual complementary 4-point rectangle harmony' },
  { id: 'design-system', label: '50-950 Tokens', desc: 'Complete 11-step design system ramp' },
];

export const PaletteGeneratorDeck: React.FC<PaletteGeneratorDeckProps> = ({
  baseColor,
  palette,
  harmony,
  onHarmonyChange,
  onUpdatePaletteItem,
  onToggleLock,
  onSetAsBaseShade,
  onRemoveItem,
  onAddItem,
  onMoveItem,
  onSaveToLibrary,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedGradient, setCopiedGradient] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHexValue, setEditHexValue] = useState('');

  const handleCopySwatchHex = (id: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyGradient = () => {
    if (palette.length < 2) return;
    const gradientCss = `background: linear-gradient(135deg, ${palette.map(p => p.color.hex).join(', ')});`;
    navigator.clipboard.writeText(gradientCss);
    setCopiedGradient(true);
    setTimeout(() => setCopiedGradient(false), 1800);
  };

  const startEditingSwatch = (item: PaletteItem) => {
    setEditingId(item.id);
    setEditHexValue(item.color.hex);
  };

  const applySwatchEdit = (id: string) => {
    const rgb = hexToRgb(editHexValue.trim());
    if (rgb) {
      onUpdatePaletteItem(id, buildColorObject(rgb));
    }
    setEditingId(null);
  };

  const gradientBackground =
    palette.length > 1
      ? `linear-gradient(to right, ${palette.map(p => p.color.hex).join(', ')})`
      : palette[0]?.color.hex || baseColor.hex;

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 backdrop-blur-sm">
      {/* Header & Harmony Tabs */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Custom Palette Generated from Base Shade
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Derived dynamically from <span className="font-mono text-neutral-200">{baseColor.hex}</span> ({baseColor.name})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSaveToLibrary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-md border border-neutral-700 transition-colors whitespace-nowrap"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-neutral-400" />
              <span>Save Palette</span>
            </button>

            <button
              onClick={handleCopyGradient}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-md border border-neutral-700 transition-colors whitespace-nowrap"
            >
              {copiedGradient ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Gradient Copied!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  <span>Copy Gradient CSS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Harmony Mode Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
          {HARMONY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onHarmonyChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                harmony === tab.id
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
              title={tab.desc}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Palette Swatches Display */}
      <div
        className={`grid gap-3 mb-6 ${
          palette.length > 7
            ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        }`}
      >
        {palette.map((item, index) => {
          const isBase = item.color.hex.toLowerCase() === baseColor.hex.toLowerCase();
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition-all duration-200 shadow-sm"
            >
              {/* Color Block */}
              <div
                className="relative h-28 sm:h-36 w-full flex flex-col justify-between p-2.5 transition-transform duration-200"
                style={{ backgroundColor: item.color.hex }}
              >
                {/* Top overlay controls */}
                <div className="flex items-center justify-between">
                  {/* Role label badge */}
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur-md truncate max-w-[80px]"
                    style={{
                      color: item.color.bestTextColor,
                      backgroundColor:
                        item.color.bestTextColor === '#FFFFFF'
                          ? 'rgba(0,0,0,0.35)'
                          : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {item.role}
                  </span>

                  {/* Lock Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleLock(item.id)}
                    className="p-1 rounded backdrop-blur-md transition-colors"
                    style={{
                      color: item.color.bestTextColor,
                      backgroundColor:
                        item.color.bestTextColor === '#FFFFFF'
                          ? 'rgba(0,0,0,0.35)'
                          : 'rgba(255,255,255,0.45)',
                    }}
                    title={item.locked ? 'Locked (will not regenerate)' : 'Click to lock'}
                  >
                    {item.locked ? (
                      <Lock className="h-3 w-3 text-amber-300" />
                    ) : (
                      <Unlock className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                </div>

                {/* Bottom overlay: Quick copy button */}
                <div className="flex items-end justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopySwatchHex(item.id, item.color.hex)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-medium backdrop-blur-md transition-transform active:scale-95"
                    style={{
                      color: item.color.bestTextColor,
                      backgroundColor:
                        item.color.bestTextColor === '#FFFFFF'
                          ? 'rgba(0,0,0,0.35)'
                          : 'rgba(255,255,255,0.45)',
                    }}
                    title="Click to copy HEX"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 opacity-80" />
                        <span className="text-[11px] tabular-nums">{item.color.hex}</span>
                      </>
                    )}
                  </button>

                  {/* Set as base shade button */}
                  {!isBase && (
                    <button
                      type="button"
                      onClick={() => onSetAsBaseShade(item.color)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded backdrop-blur-md transition-opacity"
                      style={{
                        color: item.color.bestTextColor,
                        backgroundColor:
                          item.color.bestTextColor === '#FFFFFF'
                            ? 'rgba(0,0,0,0.4)'
                            : 'rgba(255,255,255,0.5)',
                      }}
                      title="Make this the Active Base Shade"
                    >
                      <Wand2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Swatch Info & Tooling Footer */}
              <div className="p-2 bg-neutral-950 flex flex-col gap-1 text-xs">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editHexValue}
                      onChange={(e) => setEditHexValue(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-white font-mono text-xs px-1.5 py-0.5 rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => applySwatchEdit(item.id)}
                      className="px-2 py-0.5 bg-white text-neutral-950 font-semibold rounded text-[11px]"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-300 font-medium truncate" title={item.color.name}>
                      {item.color.name}
                    </span>
                    <button
                      onClick={() => startEditingSwatch(item)}
                      className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
                      title="Edit this hex code"
                    >
                      Edit
                    </button>
                  </div>
                )}

                {/* Swatch action strip */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-900 text-neutral-500">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onMoveItem(index, 'left')}
                      disabled={index === 0}
                      className="p-0.5 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                      title="Move left"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onMoveItem(index, 'right')}
                      disabled={index === palette.length - 1}
                      className="p-0.5 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500"
                      title="Move right"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {palette.length > 2 && (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-0.5 hover:text-rose-400 transition-colors"
                      title="Remove swatch"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Color Card */}
        {palette.length < 12 && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex flex-col items-center justify-center min-h-[140px] rounded-xl border border-dashed border-neutral-800 hover:border-neutral-600 bg-neutral-950/40 hover:bg-neutral-900/60 text-neutral-400 hover:text-white transition-all group"
            title="Add another harmonized color swatch"
          >
            <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-neutral-800 transition-colors mb-1.5">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium">Add Swatch</span>
          </button>
        )}
      </div>

      {/* Palette Gradient Ribbon */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Continuous Gradient Blend</span>
          <span className="font-mono text-[11px] text-neutral-500">135° Linear CSS Mesh</span>
        </div>
        <div
          className="h-7 w-full rounded-lg border border-neutral-800 shadow-inner"
          style={{ background: gradientBackground }}
        />
      </div>
    </div>
  );
};
