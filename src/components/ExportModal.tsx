import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  FileCode,
  FileJson,
  Sparkles,
  Link,
} from 'lucide-react';
import {
  ColorObject,
  PaletteItem,
  exportToCssVariables,
  exportToTailwindConfig,
  exportToJson,
  exportToSvg,
} from '../utils/colorUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: PaletteItem[];
  baseColor: ColorObject;
}

type ExportTab = 'css' | 'tailwind' | 'json' | 'svg' | 'share';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  palette,
  baseColor,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  if (!isOpen) return null;

  // Build snippet based on active tab
  let codeSnippet = '';
  let fileExtension = 'css';
  let mimeType = 'text/plain';

  switch (activeTab) {
    case 'css':
      codeSnippet = exportToCssVariables(palette, 'brand');
      fileExtension = 'css';
      mimeType = 'text/css';
      break;
    case 'tailwind':
      codeSnippet = exportToTailwindConfig(palette, 'brand');
      fileExtension = 'js';
      mimeType = 'application/javascript';
      break;
    case 'json':
      codeSnippet = exportToJson(palette);
      fileExtension = 'json';
      mimeType = 'application/json';
      break;
    case 'svg':
      codeSnippet = exportToSvg(palette);
      fileExtension = 'svg';
      mimeType = 'image/svg+xml';
      break;
    case 'share':
      // Encode base hex and colors in URL hash
      const hashParams = encodeURIComponent(
        JSON.stringify({
          base: baseColor.hex,
          colors: palette.map(p => p.color.hex),
        })
      );
      codeSnippet = `${window.location.origin}${window.location.pathname}#palette=${hashParams}`;
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeSnippet], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromaforge-palette.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-sky-400" />
            <h3 className="text-base font-bold text-white">Export Palette</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Export Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-neutral-800 overflow-x-auto bg-neutral-950/30">
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'css'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            CSS Variables
          </button>
          <button
            onClick={() => setActiveTab('tailwind')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'tailwind'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Tailwind Config
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'json'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            JSON Data
          </button>
          <button
            onClick={() => setActiveTab('svg')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'svg'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            SVG Swatches
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'share'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Shareable URL
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="relative">
            <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto max-h-72 selection:bg-neutral-800">
              <code>{codeSnippet}</code>
            </pre>
          </div>

          {/* Quick Palette Preview Strip */}
          <div className="flex h-6 rounded-lg overflow-hidden border border-neutral-800">
            {palette.map((item) => (
              <div
                key={item.id}
                className="flex-1"
                style={{ backgroundColor: item.color.hex }}
                title={`${item.role}: ${item.color.hex}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/60">
          <div className="text-xs text-neutral-500">
            {palette.length} color swatches exported
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'share' && (
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors border border-neutral-700"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .{fileExtension}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
