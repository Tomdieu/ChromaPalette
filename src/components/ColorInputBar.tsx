import React, { useState, useEffect } from 'react';
import { Clipboard, Check, AlertCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import { parseAnyColor, ColorObject } from '../utils/colorUtils';

interface ColorInputBarProps {
  onColorSelect: (color: ColorObject, sourceFormat?: string) => void;
  currentColorHex: string;
}

const QUICK_EXAMPLES = [
  { label: 'HEX', code: '#6366F1' },
  { label: 'RGB', code: 'rgb(244, 63, 94)' },
  { label: 'HSL', code: 'hsl(160, 84%, 39%)' },
  { label: 'OKLCH', code: 'oklch(0.65 0.24 25)' },
  { label: 'CMYK', code: 'cmyk(0%, 75%, 90%, 0%)' },
  { label: 'Name', code: 'rebeccapurple' },
];

export const ColorInputBar: React.FC<ColorInputBarProps> = ({
  onColorSelect,
  currentColorHex,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ColorObject | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clipboardSuccess, setClipboardSuccess] = useState(false);

  // Update validation whenever input changes
  useEffect(() => {
    if (!inputValue.trim()) {
      setParsedPreview(null);
      setDetectedFormat(null);
      setErrorMessage(null);
      return;
    }

    const res = parseAnyColor(inputValue);
    if (res.ok && res.color) {
      setParsedPreview(res.color);
      setDetectedFormat(res.format?.toUpperCase() || 'CUSTOM');
      setErrorMessage(null);
    } else {
      setParsedPreview(null);
      setDetectedFormat(null);
      setErrorMessage(res.error || 'Invalid color code');
    }
  }, [inputValue]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    const res = parseAnyColor(inputValue);
    if (res.ok && res.color) {
      onColorSelect(res.color, res.format);
      setInputValue('');
      setErrorMessage(null);
    } else {
      setErrorMessage(res.error || 'Please enter a valid color code');
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputValue(text.trim());
          const res = parseAnyColor(text.trim());
          if (res.ok && res.color) {
            onColorSelect(res.color, res.format);
            setClipboardSuccess(true);
            setTimeout(() => setClipboardSuccess(false), 2000);
          }
        }
      } else {
        // Fallback prompt
        const promptText = window.prompt('Paste your color code here:');
        if (promptText) {
          setInputValue(promptText.trim());
          const res = parseAnyColor(promptText.trim());
          if (res.ok && res.color) {
            onColorSelect(res.color, res.format);
          }
        }
      }
    } catch {
      setErrorMessage('Could not access clipboard. Please paste manually into the input box.');
    }
  };

  const handleSelectExample = (code: string) => {
    setInputValue(code);
    const res = parseAnyColor(code);
    if (res.ok && res.color) {
      onColorSelect(res.color, res.format);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleApply} className="relative flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          {/* Leading preview swatch inside input */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <div
              className="h-5 w-5 rounded-md border border-white/20 shadow-inner transition-colors duration-200"
              style={{
                backgroundColor: parsedPreview ? parsedPreview.hex : currentColorHex,
              }}
            />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste any color: #6366f1, rgb(99 102 241), hsl(210 100% 50%), oklch(...), coral..."
            className="w-full h-11 pl-11 pr-28 text-sm font-mono bg-neutral-900 border border-neutral-700/80 rounded-lg text-white placeholder:text-neutral-500 placeholder:font-sans focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
            aria-label="Paste or type any color code"
          />

          {/* Right badges & controls inside input */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {detectedFormat && (
              <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded px-1.5 py-0.5">
                {detectedFormat}
              </span>
            )}

            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
                title="Clear input"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="flex-1 sm:flex-none h-11 px-3.5 flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700/80 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            title="Paste from clipboard"
          >
            {clipboardSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Pasted!</span>
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 text-neutral-400" />
                <span>Paste</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || !parsedPreview}
            className={`flex-1 sm:flex-none h-11 px-4 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-all ${
              inputValue.trim() && parsedPreview
                ? 'bg-white text-neutral-950 hover:bg-neutral-200 cursor-pointer shadow-sm active:scale-95'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/40'
            }`}
          >
            <span>Set Base Shade</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Error or hint display */}
      {errorMessage && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick example click chips */}
      <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-neutral-400">
        <span className="text-[11px] text-neutral-500 shrink-0">Quick formats:</span>
        <div className="flex items-center gap-1.5">
          {QUICK_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleSelectExample(ex.code)}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-colors whitespace-nowrap"
            >
              {ex.label}: <span className="text-neutral-400">{ex.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
