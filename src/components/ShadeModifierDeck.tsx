import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Copy,
  Check,
  Sun,
  Flame,
  Droplets,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  ColorObject,
  adjustColor,
  hslToRgb,
  buildColorObject,
  hexToRgb,
  rgbToHex,
  clamp,
} from '../utils/colorUtils';

interface ShadeModifierDeckProps {
  color: ColorObject;
  onColorChange: (color: ColorObject) => void;
}

export const ShadeModifierDeck: React.FC<ShadeModifierDeckProps> = ({
  color,
  onColorChange,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = (text: string, formatKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatKey);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const { h, s, l } = color.hsl;

  // Slider handlers
  const handleHueChange = (newHue: number) => {
    onColorChange(adjustColor(color, { hue: newHue }));
  };

  const handleSaturationChange = (newSat: number) => {
    onColorChange(adjustColor(color, { saturation: newSat }));
  };

  const handleLightnessChange = (newLight: number) => {
    onColorChange(adjustColor(color, { lightness: newLight }));
  };

  const handleTemperatureShift = (tempDelta: number) => {
    onColorChange(adjustColor(color, { temperature: tempDelta }));
  };

  // Quick preset nudges
  const nudgeLightness = (amount: number) => {
    onColorChange(adjustColor(color, { lightness: clamp(l + amount, 0, 100) }));
  };

  const nudgeSaturation = (amount: number) => {
    onColorChange(adjustColor(color, { saturation: clamp(s + amount, 0, 100) }));
  };

  const flipComplementary = () => {
    onColorChange(adjustColor(color, { hue: (h + 180) % 360 }));
  };

  // Direct RGB field change
  const handleRgbFieldChange = (channel: 'r' | 'g' | 'b', val: number) => {
    const newRgb = {
      ...color.rgb,
      [channel]: clamp(isNaN(val) ? 0 : val, 0, 255),
    };
    onColorChange(buildColorObject(newRgb));
  };

  // Track gradients
  const satGradient = `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`;
  const lightGradient = `linear-gradient(to right, #000000, hsl(${h}, ${s}%, 50%), #ffffff)`;

  return (
    <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-800 gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Fine-Tune Shade & Color Spaces
          </h3>
        </div>

        {/* Quick adjustments bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => nudgeLightness(8)}
            className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded border border-neutral-700/60 transition-colors"
            title="Increase lightness by 8%"
          >
            +Light
          </button>
          <button
            type="button"
            onClick={() => nudgeLightness(-8)}
            className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded border border-neutral-700/60 transition-colors"
            title="Decrease lightness by 8%"
          >
            -Dark
          </button>
          <button
            type="button"
            onClick={() => nudgeSaturation(12)}
            className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded border border-neutral-700/60 transition-colors"
            title="Increase saturation by 12%"
          >
            +Vibrant
          </button>
          <button
            type="button"
            onClick={() => nudgeSaturation(-15)}
            className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded border border-neutral-700/60 transition-colors"
            title="Decrease saturation by 15%"
          >
            Mute
          </button>
          <button
            type="button"
            onClick={flipComplementary}
            className="px-2 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded border border-neutral-700/60 transition-colors"
            title="Rotate hue 180° to its exact complement"
          >
            Flip 180°
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Range Sliders */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hue Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-neutral-300">Hue</span>
              <span className="font-mono text-neutral-400 tabular-nums">{h}°</span>
            </div>
            <div className="relative h-6 rounded-lg overflow-hidden border border-neutral-700/60">
              <input
                type="range"
                min="0"
                max="360"
                value={h}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                className="w-full h-full opacity-90 cursor-pointer appearance-none bg-transparent"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>
          </div>

          {/* Saturation Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-neutral-300">Saturation</span>
              <span className="font-mono text-neutral-400 tabular-nums">{s}%</span>
            </div>
            <div className="relative h-6 rounded-lg overflow-hidden border border-neutral-700/60">
              <input
                type="range"
                min="0"
                max="100"
                value={s}
                onChange={(e) => handleSaturationChange(Number(e.target.value))}
                className="w-full h-full opacity-90 cursor-pointer appearance-none bg-transparent"
                style={{ background: satGradient }}
              />
            </div>
          </div>

          {/* Lightness Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-neutral-300">Lightness</span>
              <span className="font-mono text-neutral-400 tabular-nums">{l}%</span>
            </div>
            <div className="relative h-6 rounded-lg overflow-hidden border border-neutral-700/60">
              <input
                type="range"
                min="0"
                max="100"
                value={l}
                onChange={(e) => handleLightnessChange(Number(e.target.value))}
                className="w-full h-full opacity-90 cursor-pointer appearance-none bg-transparent"
                style={{ background: lightGradient }}
              />
            </div>
          </div>

          {/* Temperature / Warmth Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-neutral-300 flex items-center gap-1">
                <span>Color Temperature</span>
              </span>
              <span className="text-[11px] text-neutral-400">Cooler (Blue) ↔ Warmer (Amber)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTemperatureShift(-10)}
                className="px-2.5 py-1 text-xs font-medium text-sky-400 bg-sky-950/40 border border-sky-800/40 rounded hover:bg-sky-900/50 transition-colors"
              >
                Cooler -10
              </button>
              <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-sky-500 via-neutral-600 to-amber-500 border border-neutral-700/60" />
              <button
                type="button"
                onClick={() => handleTemperatureShift(10)}
                className="px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40 rounded hover:bg-amber-900/50 transition-colors"
              >
                Warmer +10
              </button>
            </div>
          </div>
        </div>

        {/* Right: Numeric Values & Multi-Format Code Chips */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* HEX & CSS Name */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">HEX</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-white tabular-nums">
                  {color.hex}
                </span>
                <button
                  onClick={() => handleCopy(color.hex, 'hex')}
                  className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
                  title="Copy HEX"
                >
                  {copiedFormat === 'hex' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* RGB with direct channel inputs */}
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono text-neutral-400">RGB</span>
                <button
                  onClick={() => handleCopy(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'rgb')}
                  className="p-0.5 text-neutral-400 hover:text-white rounded transition-colors"
                  title="Copy RGB string"
                >
                  {copiedFormat === 'rgb' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['r', 'g', 'b'] as const).map((ch) => (
                  <div key={ch} className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">{ch}:</span>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={color.rgb[ch]}
                      onChange={(e) => handleRgbFieldChange(ch, parseInt(e.target.value, 10))}
                      className="w-full bg-transparent text-xs font-mono text-white tabular-nums focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">HSL</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-200 tabular-nums">
                  hsl({h}, {s}%, {l}%)
                </span>
                <button
                  onClick={() => handleCopy(`hsl(${h}, ${s}%, ${l}%)`, 'hsl')}
                  className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
                  title="Copy HSL"
                >
                  {copiedFormat === 'hsl' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* OKLCH */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">OKLCH</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-200 tabular-nums">
                  oklch({color.oklch.l} {color.oklch.c} {color.oklch.h})
                </span>
                <button
                  onClick={() => handleCopy(`oklch(${color.oklch.l} ${color.oklch.c} ${color.oklch.h})`, 'oklch')}
                  className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
                  title="Copy OKLCH"
                >
                  {copiedFormat === 'oklch' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* CMYK */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">CMYK</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-200 tabular-nums">
                  cmyk({color.cmyk.c}%, {color.cmyk.m}%, {color.cmyk.y}%, {color.cmyk.k}%)
                </span>
                <button
                  onClick={() => handleCopy(`cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`, 'cmyk')}
                  className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
                  title="Copy CMYK"
                >
                  {copiedFormat === 'cmyk' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
