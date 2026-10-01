import React, { useRef, useCallback, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Move,
  ChevronRight,
  Maximize2,
  Sliders,
} from 'lucide-react';
import {
  ColorObject,
  hsvToRgb,
  rgbToHsv,
  hslToRgb,
  buildColorObject,
  clamp,
} from '../utils/colorUtils';

interface ColorPositionCanvasProps {
  color: ColorObject;
  onColorChange: (newColor: ColorObject) => void;
}

export const ColorPositionCanvas: React.FC<ColorPositionCanvasProps> = ({
  color,
  onColorChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Compute HSV for 2D position canvas
  const hsv = color.hsv;
  // Position in canvas: x = saturation (0 to 100), y = 100 - brightness (0 to 100)
  const handleX = clamp(hsv.s, 0, 100);
  const handleY = clamp(100 - hsv.v, 0, 100);

  const updateFromPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);

      const newS = Math.round(x * 100);
      const newV = Math.round((1 - y) * 100);

      const rgb = hsvToRgb(hsv.h, newS, newV);
      onColorChange(buildColorObject(rgb));
    },
    [hsv.h, onColorChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      updateFromPosition(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Lightness position slider handler (adjusts HSL Lightness from 0% to 100%)
  const handleLightnessSlider = (newLight: number) => {
    const rgb = hslToRgb(color.hsl.h, color.hsl.s, clamp(newLight, 0, 100));
    onColorChange(buildColorObject(rgb));
  };

  // Quick preset lightness steps
  const quickPositions = [
    { label: 'Ultra Light', l: 94, desc: '94% Tint' },
    { label: 'Pastel Light', l: 82, desc: '82% Tint' },
    { label: 'Medium Light', l: 68, desc: '68% Tone' },
    { label: 'Balanced', l: 50, desc: '50% Pure' },
    { label: 'Deep Tone', l: 36, desc: '36% Shade' },
    { label: 'Dark Shade', l: 20, desc: '20% Shade' },
    { label: 'Midnight', l: 10, desc: '10% Ink' },
  ];

  const currentLightness = color.hsl.l;

  // Background hue for 2D field
  const pureHueCss = `hsl(${hsv.h}, 100%, 50%)`;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 sm:p-5 flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-sky-400" />
          <h4 className="text-sm font-semibold text-white tracking-wide">
            Adjust Color Position & Lightness
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span>Drag position handle or slide to get lighter/darker shades</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left: 2D Saturation / Value Color Area */}
        <div className="md:col-span-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium text-neutral-300">2D Color Position Plane</span>
            <span className="font-mono text-[11px] text-neutral-400">
              Sat: {handleX}% · Val: {100 - handleY}%
            </span>
          </div>

          <div
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden cursor-crosshair select-none touch-none shadow-inner border border-neutral-700/60"
            style={{ backgroundColor: pureHueCss }}
            title="Click or drag to move color position: Up = Lighter, Down = Darker, Left = Desaturated/White, Right = Vibrant"
          >
            {/* Horizontal gradient: White to transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none" />

            {/* Vertical gradient: Transparent to black */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            {/* Draggable Position Pin Handle */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center transition-transform active:scale-125"
              style={{
                left: `${handleX}%`,
                top: `${handleY}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Outer focus halo */}
                <div
                  className="h-6 w-6 rounded-full border-2 border-white shadow-md ring-2 ring-black/60"
                  style={{ backgroundColor: color.hex }}
                />
                {/* Center dot */}
                <div
                  className="absolute h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: color.bestTextColor,
                  }}
                />
              </div>
            </div>

            {/* Direction hints */}
            <div className="absolute top-2 left-2 text-[10px] font-sans font-medium text-black/60 bg-white/40 backdrop-blur-xs px-1.5 py-0.5 rounded pointer-events-none">
              ↑ Lighter
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-sans font-medium text-white/70 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded pointer-events-none">
              ↓ Darker
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-sans font-medium text-white/80 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded pointer-events-none">
              Vibrant →
            </div>
          </div>
        </div>

        {/* Right: Lightness Position Track & Rapid Step Bar */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          {/* Lightness Slider Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300 flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Lightness Position Slider</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-white tabular-nums">
                  {currentLightness}% Lightness
                </span>
              </div>
            </div>

            {/* Dynamic Lightness Gradient Slider */}
            <div className="relative h-8 rounded-lg overflow-hidden border border-neutral-700/80 shadow-inner">
              <input
                type="range"
                min="5"
                max="97"
                value={currentLightness}
                onChange={(e) => handleLightnessSlider(Number(e.target.value))}
                className="w-full h-full opacity-90 cursor-pointer appearance-none bg-transparent"
                style={{
                  background: `linear-gradient(to right, #000000 0%, hsl(${color.hsl.h}, ${color.hsl.s}%, 50%) 50%, #ffffff 100%)`,
                }}
              />
            </div>

            {/* Quick Adjustment Nudge Buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleLightnessSlider(currentLightness + 15)}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 rounded border border-amber-800/40 transition-colors text-center whitespace-nowrap active:scale-95"
              >
                +15% Lighter
              </button>
              <button
                type="button"
                onClick={() => handleLightnessSlider(currentLightness + 30)}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 rounded border border-sky-800/40 transition-colors text-center whitespace-nowrap active:scale-95"
              >
                +30% Light Tint
              </button>
              <button
                type="button"
                onClick={() => handleLightnessSlider(currentLightness - 15)}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 transition-colors text-center whitespace-nowrap active:scale-95"
              >
                -15% Darker
              </button>
            </div>
          </div>

          {/* Rapid Step Shade Picker (7 steps from 94% to 10%) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="text-[11px] font-medium text-neutral-400">
                Snap to Target Shade Position:
              </span>
              <span className="text-[10px] text-neutral-500">Click any step</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {quickPositions.map((step) => {
                const stepRgb = hslToRgb(color.hsl.h, color.hsl.s, step.l);
                const stepHex = `#${Math.round(stepRgb.r).toString(16).padStart(2, '0')}${Math.round(stepRgb.g).toString(16).padStart(2, '0')}${Math.round(stepRgb.b).toString(16).padStart(2, '0')}`;
                const isClosest = Math.abs(currentLightness - step.l) <= 6;

                return (
                  <button
                    key={step.l}
                    type="button"
                    onClick={() => handleLightnessSlider(step.l)}
                    className={`group relative flex flex-col items-center justify-between h-14 rounded-lg p-1 border transition-all ${
                      isClosest
                        ? 'border-white ring-2 ring-white/40 scale-105 z-10'
                        : 'border-neutral-800 hover:border-neutral-600 hover:scale-102'
                    }`}
                    style={{ backgroundColor: stepHex }}
                    title={`${step.label}: ${step.desc}`}
                  >
                    <span
                      className="text-[9px] font-mono font-bold leading-tight"
                      style={{
                        color: step.l > 55 ? '#000000' : '#ffffff',
                      }}
                    >
                      {step.l}%
                    </span>
                    <span
                      className="text-[8px] font-sans truncate max-w-full leading-tight opacity-75"
                      style={{
                        color: step.l > 55 ? '#000000' : '#ffffff',
                      }}
                    >
                      {step.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
