import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Sun,
  Moon,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Bell,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ColorObject, PaletteItem } from '../utils/colorUtils';

interface UIPreviewLabProps {
  baseColor: ColorObject;
  palette: PaletteItem[];
}

export const UIPreviewLab: React.FC<UIPreviewLabProps> = ({
  baseColor,
  palette,
}) => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // Derive semantic roles safely from palette
  const primary = palette[0]?.color || baseColor;
  const accent = palette[1]?.color || palette[0]?.color || baseColor;
  const subtle = palette[2]?.color || palette[0]?.color || baseColor;
  const deep = palette[palette.length - 1]?.color || baseColor;

  const isDark = themeMode === 'dark';

  return (
    <div className="w-full space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Real-World Interface Preview
          </h3>
          <p className="text-xs text-neutral-400">
            Preview your generated palette applied to live interactive UI components
          </p>
        </div>

        {/* Theme mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setThemeMode('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isDark ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Dark Canvas</span>
          </button>
          <button
            onClick={() => setThemeMode('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              !isDark ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Light Canvas</span>
          </button>
        </div>
      </div>

      {/* Mockup Canvas */}
      <div
        className={`p-6 sm:p-10 rounded-2xl border transition-colors duration-300 ${
          isDark
            ? 'bg-neutral-950 border-neutral-800 text-neutral-100'
            : 'bg-neutral-50 border-neutral-200 text-neutral-900'
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mock SaaS Dashboard Widget */}
          <div
            className={`rounded-2xl border p-6 transition-all shadow-md ${
              isDark
                ? 'bg-neutral-900/80 border-neutral-800'
                : 'bg-white border-neutral-200/80'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-inherit gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm"
                  style={{
                    backgroundColor: primary.hex,
                    color: primary.bestTextColor,
                  }}
                >
                  CF
                </div>
                <div>
                  <h4 className="text-base font-bold tracking-tight">
                    Active Pipeline Performance
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>Analytics</span>
                    <span>·</span>
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-2 text-xs font-medium rounded-lg border transition-all"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  }}
                >
                  View Documentation
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-transform active:scale-95"
                  style={{
                    backgroundColor: primary.hex,
                    color: primary.bestTextColor,
                  }}
                >
                  Deploy Changes
                </button>
              </div>
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card 1 */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50/80 border-neutral-200'
                }`}
              >
                <div className="text-xs text-neutral-400 mb-1 font-medium">Conversion Yield</div>
                <div className="text-2xl font-bold font-mono tabular-nums mb-2">94.8%</div>
                <div
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${accent.hex}22`,
                    color: accent.hex,
                  }}
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.4% vs last cycle</span>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50/80 border-neutral-200'
                }`}
              >
                <div className="text-xs text-neutral-400 mb-1 font-medium">Monthly Active Tokens</div>
                <div className="text-2xl font-bold font-mono tabular-nums mb-2">1,842,000</div>
                <div
                  className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${subtle.hex}25`,
                    color: subtle.hex,
                  }}
                >
                  <span>Quota: 85% consumed</span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50/80 border-neutral-200'
                }`}
              >
                <div className="text-xs text-neutral-400 mb-1 font-medium">System Health</div>
                <div className="text-2xl font-bold font-mono tabular-nums mb-2">99.98%</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>All endpoints nominal</span>
                </div>
              </div>
            </div>

            {/* Interactive Progress & Form Elements */}
            <div className="space-y-4 pt-4 border-t border-inherit">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-400">Palette Integration Progress</span>
                  <span className="font-mono tabular-nums font-semibold" style={{ color: primary.hex }}>
                    76%
                  </span>
                </div>
                {/* Custom colored progress bar */}
                <div
                  className={`h-2.5 w-full rounded-full overflow-hidden ${
                    isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                  }`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: '76%',
                      backgroundColor: primary.hex,
                    }}
                  />
                </div>
              </div>

              {/* Sample form input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="test-api-token-9883"
                  className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border focus:outline-none ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                      : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                />
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium rounded-lg text-white"
                  style={{
                    backgroundColor: deep.hex,
                    color: deep.bestTextColor,
                  }}
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Color Tokens Legend */}
          <div
            className={`p-4 rounded-xl border text-xs ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="font-semibold mb-3">Color Mapping in this Preview:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: primary.hex }} />
                <div>
                  <div className="font-medium">Primary Accent</div>
                  <div className="font-mono text-[10px] text-neutral-500">{primary.hex}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: accent.hex }} />
                <div>
                  <div className="font-medium">Secondary / Stat</div>
                  <div className="font-mono text-[10px] text-neutral-500">{accent.hex}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: subtle.hex }} />
                <div>
                  <div className="font-medium">Tertiary Glow</div>
                  <div className="font-mono text-[10px] text-neutral-500">{subtle.hex}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: deep.hex }} />
                <div>
                  <div className="font-medium">Surface Depth</div>
                  <div className="font-mono text-[10px] text-neutral-500">{deep.hex}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
