import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import {
  ColorObject,
  PaletteItem,
  getContrastRatio,
  hexToRgb,
  buildColorObject,
} from '../utils/colorUtils';

interface ContrastMatrixViewProps {
  palette: PaletteItem[];
  baseColor: ColorObject;
}

export const ContrastMatrixView: React.FC<ContrastMatrixViewProps> = ({
  palette,
  baseColor,
}) => {
  // Always include White & Black for complete benchmark
  const testColors: ColorObject[] = [
    buildColorObject({ r: 255, g: 255, b: 255 }),
    buildColorObject({ r: 0, g: 0, b: 0 }),
    ...palette.map(p => p.color),
  ];

  const [selectedPair, setSelectedPair] = useState<{
    fg: ColorObject;
    bg: ColorObject;
    ratio: number;
  }>({
    fg: palette[0]?.color || baseColor,
    bg: buildColorObject({ r: 255, g: 255, b: 255 }),
    ratio: palette[0]?.color.contrastWhite || 4.5,
  });

  return (
    <div className="w-full space-y-6">
      {/* Intro Card */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              WCAG Accessibility & Contrast Matrix
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Click any matrix intersection cell to test foreground text legibility on background surfaces.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-neutral-300">AAA (≥7:1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <span className="text-neutral-300">AA (≥4.5:1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-neutral-300">Large (≥3:1)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-600" />
            <span className="text-neutral-500">Fail (&lt;3:1)</span>
          </div>
        </div>
      </div>

      {/* Selected Pair Preview Sandbox */}
      <div
        className="p-6 rounded-2xl border border-neutral-700/80 transition-colors shadow-lg flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          backgroundColor: selectedPair.bg.hex,
          color: selectedPair.fg.hex,
        }}
      >
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
            Live Typography Test Bed
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            The quick brown fox jumps over the lazy dog.
          </h2>
          <p className="text-sm opacity-90 leading-relaxed">
            Good design starts with accessible, effortless readability. Contrast ensures your interface is inclusive for all users under varied display and lighting conditions.
          </p>
        </div>

        <div
          className="p-4 rounded-xl border flex flex-col items-center justify-center shrink-0 min-w-[200px]"
          style={{
            borderColor: selectedPair.fg.hex,
            backgroundColor: 'rgba(0,0,0,0.15)',
          }}
        >
          <div className="text-3xl font-mono font-bold tabular-nums">
            {selectedPair.ratio}:1
          </div>
          <div className="text-xs font-semibold mt-1">
            {selectedPair.ratio >= 7 ? (
              <span className="text-emerald-400">WCAG AAA Enhanced</span>
            ) : selectedPair.ratio >= 4.5 ? (
              <span className="text-sky-400">WCAG AA Normal</span>
            ) : selectedPair.ratio >= 3 ? (
              <span className="text-amber-400">WCAG AA Large Only</span>
            ) : (
              <span className="text-rose-400">Fails WCAG Text</span>
            )}
          </div>
          <div className="text-[11px] opacity-75 mt-2 font-mono">
            FG: {selectedPair.fg.hex} · BG: {selectedPair.bg.hex}
          </div>
        </div>
      </div>

      {/* The Matrix Table */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/80">
              <th className="p-3 text-left font-semibold text-neutral-400 min-w-[120px]">
                Foreground ↓ / Background →
              </th>
              {testColors.map((bg, idx) => (
                <th key={`head-${bg.hex}-${idx}`} className="p-2.5 text-center font-mono font-normal">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="h-5 w-5 rounded border border-white/20 shadow-sm"
                      style={{ backgroundColor: bg.hex }}
                    />
                    <span className="text-[10px] text-neutral-400">{bg.hex}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {testColors.map((fg, rowIdx) => (
              <tr key={`row-${fg.hex}-${rowIdx}`} className="border-b border-neutral-900 hover:bg-neutral-900/40">
                <td className="p-3 font-medium text-neutral-300">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded border border-white/20 shrink-0"
                      style={{ backgroundColor: fg.hex }}
                    />
                    <div className="truncate max-w-[100px]">
                      <div className="font-mono text-[11px]">{fg.hex}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{fg.name}</div>
                    </div>
                  </div>
                </td>

                {testColors.map((bg, colIdx) => {
                  const ratio = getContrastRatio(fg.luminance, bg.luminance);
                  const isSelected =
                    selectedPair.fg.hex === fg.hex && selectedPair.bg.hex === bg.hex;

                  let badgeColor = 'text-neutral-500 bg-neutral-900';
                  let status = 'Fail';
                  if (ratio >= 7) {
                    badgeColor = 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 font-bold';
                    status = 'AAA';
                  } else if (ratio >= 4.5) {
                    badgeColor = 'text-sky-400 bg-sky-950/60 border border-sky-800/40';
                    status = 'AA';
                  } else if (ratio >= 3) {
                    badgeColor = 'text-amber-400 bg-amber-950/40 border border-amber-800/30';
                    status = 'Large';
                  }

                  return (
                    <td
                      key={`cell-${fg.hex}-${bg.hex}-${colIdx}`}
                      onClick={() => setSelectedPair({ fg, bg, ratio })}
                      className={`p-2 text-center cursor-pointer transition-all hover:scale-105 ${
                        isSelected ? 'ring-2 ring-white rounded' : ''
                      }`}
                    >
                      <div
                        className={`py-1 px-1.5 rounded font-mono text-[11px] tabular-nums ${badgeColor}`}
                      >
                        {ratio}:1
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
