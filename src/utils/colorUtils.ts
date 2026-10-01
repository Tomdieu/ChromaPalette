/**
 * Comprehensive Color Science & Manipulation Utility
 * Supports HEX, RGB, HSL, HSV, OKLCH, CMYK, and CSS Named Colors
 */

export interface RgbColor {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a?: number; // 0 - 1
}

export interface HslColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
  a?: number; // 0 - 1
}

export interface HsvColor {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export interface OklchColor {
  l: number; // 0 - 1 (or 0-100%)
  c: number; // 0 - 0.4+
  h: number; // 0 - 360
}

export interface CmykColor {
  c: number; // 0 - 100
  m: number; // 0 - 100
  y: number; // 0 - 100
  k: number; // 0 - 100
}

export interface ColorObject {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  hsv: HsvColor;
  oklch: OklchColor;
  cmyk: CmykColor;
  name: string;
  luminance: number; // 0 - 1
  contrastWhite: number; // 1 - 21
  contrastBlack: number; // 1 - 21
  bestTextColor: '#FFFFFF' | '#000000';
}

export interface ParsedColorResult {
  ok: boolean;
  color?: ColorObject;
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'cmyk' | 'named';
  rawInput: string;
  error?: string;
}

// 148 standard CSS Named Colors
export const CSS_NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};

// Rich curated design names for nearest matching
const DESIGN_COLOR_NAMES: Array<{ name: string; hex: string }> = [
  { name: 'Obsidian', hex: '#0B0D13' },
  { name: 'Pitch Black', hex: '#000000' },
  { name: 'Charcoal Night', hex: '#1E232A' },
  { name: 'Slate Gray', hex: '#4A5568' },
  { name: 'Steel Gray', hex: '#718096' },
  { name: 'Silver Mist', hex: '#CBD5E0' },
  { name: 'Pure Snow', hex: '#FFFFFF' },
  { name: 'Alabaster', hex: '#F7FAFC' },
  { name: 'Crimson Ember', hex: '#E53E3E' },
  { name: 'Scarlet Red', hex: '#FF2A2A' },
  { name: 'Ruby Wine', hex: '#9B2C2C' },
  { name: 'Coral Blossom', hex: '#FF6B6B' },
  { name: 'Terracotta', hex: '#DD6B20' },
  { name: 'Persimmon', hex: '#ED8936' },
  { name: 'Sunburst Orange', hex: '#F6AD55' },
  { name: 'Warm Amber', hex: '#D69E2E' },
  { name: 'Golden Honey', hex: '#ECC94B' },
  { name: 'Canary Yellow', hex: '#FAF089' },
  { name: 'Electric Lime', hex: '#38A169' },
  { name: 'Matcha Forest', hex: '#2F855A' },
  { name: 'Emerald Gem', hex: '#10B981' },
  { name: 'Sage Leaf', hex: '#68D391' },
  { name: 'Mint Breeze', hex: '#9AE6B4' },
  { name: 'Deep Pine', hex: '#22543D' },
  { name: 'Seafoam Teal', hex: '#319795' },
  { name: 'Pacific Turquoise', hex: '#38B2AC' },
  { name: 'Aqua Lagoon', hex: '#4FD1C5' },
  { name: 'Glacier Cyan', hex: '#00B4D8' },
  { name: 'Sky Cerulean', hex: '#3182CE' },
  { name: 'Electric Indigo', hex: '#6366F1' },
  { name: 'Ultramarine Blue', hex: '#2B6CB0' },
  { name: 'Navy Midnight', hex: '#1A365D' },
  { name: 'Deep Cobalt', hex: '#002B5B' },
  { name: 'Royal Sapphire', hex: '#1E40AF' },
  { name: 'Wisteria Lavender', hex: '#805AD5' },
  { name: 'Amethyst Purple', hex: '#6B46C1' },
  { name: 'Neon Violet', hex: '#9F7AEA' },
  { name: 'Lilac Orchid', hex: '#D6BCFA' },
  { name: 'Magenta Rose', hex: '#D53F8C' },
  { name: 'Wild Raspberry', hex: '#97266D' },
  { name: 'Blush Peony', hex: '#F687B3' },
  { name: 'Cotton Candy', hex: '#FED7E2' },
  { name: 'Toasted Pecan', hex: '#7B341E' },
  { name: 'Espresso Bean', hex: '#3C1A14' },
  { name: 'Sandstone Dune', hex: '#D4B896' },
  { name: 'Oatmeal Milk', hex: '#F3EDE2' },
];

/** Clamp helper */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** RGB to Hex */
export function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const rHex = Math.round(clamp(r, 0, 255)).toString(16).padStart(2, '0');
  const gHex = Math.round(clamp(g, 0, 255)).toString(16).padStart(2, '0');
  const bHex = Math.round(clamp(b, 0, 255)).toString(16).padStart(2, '0');
  if (a !== undefined && a < 1) {
    const aHex = Math.round(clamp(a, 0, 1) * 255).toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}${aHex}`.toUpperCase();
  }
  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

/** Hex to RGB */
export function hexToRgb(hex: string): RgbColor | null {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  } else if (clean.length === 4) {
    clean = clean.split('').map(c => c + c).join('');
  }

  if (clean.length === 6) {
    const num = parseInt(clean, 16);
    if (isNaN(num)) return null;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      a: 1,
    };
  } else if (clean.length === 8) {
    const num = parseInt(clean, 16);
    if (isNaN(num)) return null;
    return {
      r: (num >> 24) & 255,
      g: (num >> 16) & 255,
      b: (num >> 8) & 255,
      a: parseFloat(((num & 255) / 255).toFixed(3)),
    };
  }
  return null;
}

/** RGB to HSL */
export function rgbToHsl(r: number, g: number, b: number, a: number = 1): HslColor {
  const rNorm = clamp(r, 0, 255) / 255;
  const gNorm = clamp(g, 0, 255) / 255;
  const bNorm = clamp(b, 0, 255) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a,
  };
}

/** HSL to RGB */
export function hslToRgb(h: number, s: number, l: number, a: number = 1): RgbColor {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  const sNorm = clamp(s, 0, 100) / 100;
  const lNorm = clamp(l, 0, 100) / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val, a };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
    a,
  };
}

/** RGB to HSV */
export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  const rNorm = clamp(r, 0, 255) / 255;
  const gNorm = clamp(g, 0, 255) / 255;
  const bNorm = clamp(b, 0, 255) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/** HSV to RGB */
export function hsvToRgb(h: number, s: number, v: number): RgbColor {
  const hNorm = ((h % 360) + 360) % 360 / 60;
  const sNorm = clamp(s, 0, 100) / 100;
  const vNorm = clamp(v, 0, 100) / 100;

  const i = Math.floor(hNorm);
  const f = hNorm - i;
  const p = vNorm * (1 - sNorm);
  const q = vNorm * (1 - f * sNorm);
  const t = vNorm * (1 - (1 - f) * sNorm);

  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = vNorm; g = t; b = p; break;
    case 1: r = q; g = vNorm; b = p; break;
    case 2: r = p; g = vNorm; b = t; break;
    case 3: r = p; g = q; b = vNorm; break;
    case 4: r = t; g = p; b = vNorm; break;
    case 5: r = vNorm; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: 1,
  };
}

/** RGB to CMYK */
export function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  const rNorm = clamp(r, 0, 255) / 255;
  const gNorm = clamp(g, 0, 255) / 255;
  const bNorm = clamp(b, 0, 255) / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

/** CMYK to RGB */
export function cmykToRgb(c: number, m: number, y: number, k: number): RgbColor {
  const cNorm = clamp(c, 0, 100) / 100;
  const mNorm = clamp(m, 0, 100) / 100;
  const yNorm = clamp(y, 0, 100) / 100;
  const kNorm = clamp(k, 0, 100) / 100;

  const r = 255 * (1 - cNorm) * (1 - kNorm);
  const g = 255 * (1 - mNorm) * (1 - kNorm);
  const b = 255 * (1 - yNorm) * (1 - kNorm);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: 1,
  };
}

/** RGB linearize helper */
function sRgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** RGB to OKLCH */
export function rgbToOklch(r: number, g: number, b: number): OklchColor {
  const lr = sRgbToLinear(r);
  const lg = sRgbToLinear(g);
  const lb = sRgbToLinear(b);

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bOklab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + bOklab * bOklab);
  let h = (Math.atan2(bOklab, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return {
    l: parseFloat(L.toFixed(3)),
    c: parseFloat(C.toFixed(3)),
    h: Math.round(h),
  };
}

/** OKLCH to RGB */
export function oklchToRgb(l: number, c: number, h: number): RgbColor {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const bOklab = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * bOklab;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bOklab;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * bOklab;

  const lCubed = l_ * l_ * l_;
  const mCubed = m_ * m_ * m_;
  const sCubed = s_ * s_ * s_;

  const lr = +4.0767434729 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed;
  const lg = -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed;
  const lb = -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.7076147010 * sCubed;

  return {
    r: Math.round(clamp(linearToSrgb(lr) * 255, 0, 255)),
    g: Math.round(clamp(linearToSrgb(lg) * 255, 0, 255)),
    b: Math.round(clamp(linearToSrgb(lb) * 255, 0, 255)),
    a: 1,
  };
}

/** Relative Luminance (WCAG 2.1) */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const rs = sRgbToLinear(r);
  const gs = sRgbToLinear(g);
  const bs = sRgbToLinear(b);
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Contrast Ratio (WCAG 2.1) */
export function getContrastRatio(lum1: number, lum2: number): number {
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return parseFloat(((l1 + 0.05) / (l2 + 0.05)).toFixed(2));
}

/** Nearest Color Name Finder */
export function getNearestColorName(r: number, g: number, b: number): string {
  let minDistance = Infinity;
  let closestName = 'Custom Shade';

  for (const item of DESIGN_COLOR_NAMES) {
    const itemRgb = hexToRgb(item.hex);
    if (!itemRgb) continue;
    // Weighted Euclidean distance for human perception
    const rDiff = r - itemRgb.r;
    const gDiff = g - itemRgb.g;
    const bDiff = b - itemRgb.b;
    const dist = Math.sqrt(2 * rDiff * rDiff + 4 * gDiff * gDiff + 3 * bDiff * bDiff);

    if (dist < minDistance) {
      minDistance = dist;
      closestName = item.name;
    }
  }

  // Also check standard CSS names for exact or ultra-close matches
  for (const [name, hex] of Object.entries(CSS_NAMED_COLORS)) {
    const cRgb = hexToRgb(hex);
    if (!cRgb) continue;
    const rDiff = r - cRgb.r;
    const gDiff = g - cRgb.g;
    const bDiff = b - cRgb.b;
    const dist = Math.sqrt(2 * rDiff * rDiff + 4 * gDiff * gDiff + 3 * bDiff * bDiff);
    if (dist < 10) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  return closestName;
}

/** Build full ColorObject from RGB */
export function buildColorObject(rgb: RgbColor): ColorObject {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b, rgb.a);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b, rgb.a ?? 1);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const name = getNearestColorName(rgb.r, rgb.g, rgb.b);
  const luminance = parseFloat(getRelativeLuminance(rgb.r, rgb.g, rgb.b).toFixed(4));
  const contrastWhite = getContrastRatio(luminance, 1.0);
  const contrastBlack = getContrastRatio(luminance, 0.0);
  const bestTextColor = contrastWhite >= contrastBlack ? '#FFFFFF' : '#000000';

  return {
    hex,
    rgb,
    hsl,
    hsv,
    oklch,
    cmyk,
    name,
    luminance,
    contrastWhite,
    contrastBlack,
    bestTextColor,
  };
}

/**
 * Universal Color Parser:
 * Parses HEX, RGB, RGBA, HSL, HSLA, HSV, OKLCH, CMYK, CSS Names, raw numbers
 */
export function parseAnyColor(rawInput: string): ParsedColorResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { ok: false, rawInput, error: 'Please enter or paste a color code.' };
  }

  const lower = trimmed.toLowerCase();

  // 1. Check CSS named color
  if (CSS_NAMED_COLORS[lower]) {
    const rgb = hexToRgb(CSS_NAMED_COLORS[lower]);
    if (rgb) {
      return {
        ok: true,
        color: buildColorObject(rgb),
        format: 'named',
        rawInput,
      };
    }
  }

  // 2. Check HEX (# optional, 3, 4, 6, 8 hex digits)
  const hexRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  if (hexRegex.test(trimmed)) {
    const hex = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    const rgb = hexToRgb(hex);
    if (rgb) {
      return {
        ok: true,
        color: buildColorObject(rgb),
        format: 'hex',
        rawInput,
      };
    }
  }

  // 3. Check RGB / RGBA: rgb(255, 99, 71) or rgb(255 99 71 / 0.8) or 255, 99, 71
  const rgbFuncMatch = lower.match(/^rgba?\s*\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/);
  if (rgbFuncMatch) {
    const parseComponent = (v: string, max: number = 255) => {
      if (v.endsWith('%')) {
        return (parseFloat(v) / 100) * max;
      }
      return parseFloat(v);
    };

    const r = clamp(Math.round(parseComponent(rgbFuncMatch[1], 255)), 0, 255);
    const g = clamp(Math.round(parseComponent(rgbFuncMatch[2], 255)), 0, 255);
    const b = clamp(Math.round(parseComponent(rgbFuncMatch[3], 255)), 0, 255);
    let a = 1;
    if (rgbFuncMatch[4]) {
      a = rgbFuncMatch[4].endsWith('%') ? parseFloat(rgbFuncMatch[4]) / 100 : parseFloat(rgbFuncMatch[4]);
      a = clamp(a, 0, 1);
    }

    return {
      ok: true,
      color: buildColorObject({ r, g, b, a }),
      format: 'rgb',
      rawInput,
    };
  }

  // Raw space/comma separated 3 numbers (e.g. "255, 99, 71" or "255 99 71")
  const rawRgbMatch = lower.match(/^(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})$/);
  if (rawRgbMatch) {
    const r = clamp(parseInt(rawRgbMatch[1], 10), 0, 255);
    const g = clamp(parseInt(rawRgbMatch[2], 10), 0, 255);
    const b = clamp(parseInt(rawRgbMatch[3], 10), 0, 255);
    return {
      ok: true,
      color: buildColorObject({ r, g, b, a: 1 }),
      format: 'rgb',
      rawInput,
    };
  }

  // 4. Check HSL / HSLA: hsl(210, 100%, 50%) or hsl(210deg 100% 50% / 0.5)
  const hslMatch = lower.match(/^hsla?\s*\(\s*([\d.]+(?:deg|turn|rad)?)\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/);
  if (hslMatch) {
    let h = 0;
    const hRaw = hslMatch[1];
    if (hRaw.endsWith('turn')) {
      h = parseFloat(hRaw) * 360;
    } else if (hRaw.endsWith('rad')) {
      h = (parseFloat(hRaw) * 180) / Math.PI;
    } else {
      h = parseFloat(hRaw.replace('deg', ''));
    }

    const s = clamp(parseFloat(hslMatch[2]), 0, 100);
    const l = clamp(parseFloat(hslMatch[3]), 0, 100);
    let a = 1;
    if (hslMatch[4]) {
      a = hslMatch[4].endsWith('%') ? parseFloat(hslMatch[4]) / 100 : parseFloat(hslMatch[4]);
      a = clamp(a, 0, 1);
    }

    const rgb = hslToRgb(h, s, l, a);
    return {
      ok: true,
      color: buildColorObject(rgb),
      format: 'hsl',
      rawInput,
    };
  }

  // 5. Check HSV / HSB: hsv(210, 80%, 70%) or hsb(...)
  const hsvMatch = lower.match(/^hs[vb]\s*\(\s*([\d.]+)\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*\)$/);
  if (hsvMatch) {
    const h = parseFloat(hsvMatch[1]);
    const s = clamp(parseFloat(hsvMatch[2]), 0, 100);
    const v = clamp(parseFloat(hsvMatch[3]), 0, 100);
    const rgb = hsvToRgb(h, s, v);
    return {
      ok: true,
      color: buildColorObject(rgb),
      format: 'hsv',
      rawInput,
    };
  }

  // 6. Check OKLCH: oklch(0.65 0.24 25) or oklch(65% 0.24 25)
  const oklchMatch = lower.match(/^oklch\s*\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*[/]\s*[\d.]+%?)?\s*\)$/);
  if (oklchMatch) {
    let l = parseFloat(oklchMatch[1]);
    if (oklchMatch[1].endsWith('%')) {
      l = l / 100;
    }
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    const rgb = oklchToRgb(l, c, h);
    return {
      ok: true,
      color: buildColorObject(rgb),
      format: 'oklch',
      rawInput,
    };
  }

  // 7. Check CMYK: cmyk(0%, 50%, 100%, 0%) or cmyk(0 50 100 0)
  const cmykMatch = lower.match(/^cmyk\s*\(\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*\)$/);
  if (cmykMatch) {
    const c = clamp(parseFloat(cmykMatch[1]), 0, 100);
    const m = clamp(parseFloat(cmykMatch[2]), 0, 100);
    const y = clamp(parseFloat(cmykMatch[3]), 0, 100);
    const k = clamp(parseFloat(cmykMatch[4]), 0, 100);
    const rgb = cmykToRgb(c, m, y, k);
    return {
      ok: true,
      color: buildColorObject(rgb),
      format: 'cmyk',
      rawInput,
    };
  }

  return {
    ok: false,
    rawInput,
    error: `Unrecognized color format: "${trimmed}". Try #HEX, rgb(), hsl(), hsv(), oklch(), or a name like "coral".`,
  };
}

/** Random Color Generator with Mode Styles */
export type GeneratorPreset = 'vibrant' | 'pastel' | 'deep' | 'neon' | 'earthy' | 'minimal' | 'random';

export function generateRandomColor(preset: GeneratorPreset = 'vibrant'): ColorObject {
  let h = Math.floor(Math.random() * 360);
  let s = 70;
  let l = 50;

  switch (preset) {
    case 'vibrant':
      s = 75 + Math.floor(Math.random() * 25); // 75 - 100%
      l = 45 + Math.floor(Math.random() * 15); // 45 - 60%
      break;
    case 'pastel':
      s = 40 + Math.floor(Math.random() * 35); // 40 - 75%
      l = 75 + Math.floor(Math.random() * 18); // 75 - 93%
      break;
    case 'deep':
      s = 60 + Math.floor(Math.random() * 35); // 60 - 95%
      l = 18 + Math.floor(Math.random() * 18); // 18 - 36%
      break;
    case 'neon':
      s = 95 + Math.floor(Math.random() * 5);  // 95 - 100%
      l = 50 + Math.floor(Math.random() * 12); // 50 - 62%
      break;
    case 'earthy':
      // Warm hues: 20° to 60° (oranges, browns, ochres) or 80°-140° (moss, sage)
      h = Math.random() > 0.4 ? 20 + Math.floor(Math.random() * 45) : 80 + Math.floor(Math.random() * 50);
      s = 35 + Math.floor(Math.random() * 35); // 35 - 70%
      l = 30 + Math.floor(Math.random() * 30); // 30 - 60%
      break;
    case 'minimal':
      s = 5 + Math.floor(Math.random() * 20);  // 5 - 25%
      l = 25 + Math.floor(Math.random() * 60); // 25 - 85%
      break;
    case 'random':
    default:
      s = Math.floor(Math.random() * 100);
      l = Math.floor(Math.random() * 100);
      break;
  }

  const rgb = hslToRgb(h, s, l);
  return buildColorObject(rgb);
}

/** Palette Generation Types */
export type HarmonyType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'design-system'
  | 'ui-cohesive';

export interface PaletteItem {
  id: string;
  color: ColorObject;
  role: string;
  locked?: boolean;
}

/**
 * Generate a custom palette strictly anchored on the specific base shade
 */
export function generatePaletteFromShade(
  base: ColorObject,
  harmony: HarmonyType,
  existingPalette?: PaletteItem[]
): PaletteItem[] {
  const { h, s, l } = base.hsl;

  let colors: Array<{ role: string; h: number; s: number; l: number }> = [];

  switch (harmony) {
    case 'monochromatic':
      colors = [
        { role: 'Tint 1', h, s: Math.max(s - 30, 10), l: Math.min(l + 35, 96) },
        { role: 'Tint 2', h, s: Math.max(s - 15, 15), l: Math.min(l + 20, 88) },
        { role: 'Base Shade', h, s, l },
        { role: 'Shade 1', h, s: Math.min(s + 10, 100), l: Math.max(l - 18, 16) },
        { role: 'Deep Shade', h, s: Math.min(s + 20, 100), l: Math.max(l - 32, 8) },
      ];
      break;

    case 'analogous':
      colors = [
        { role: 'Cool Shift', h: (h - 40 + 360) % 360, s: Math.max(s - 10, 20), l: Math.min(l + 10, 85) },
        { role: 'Analogous -25°', h: (h - 25 + 360) % 360, s, l },
        { role: 'Base Shade', h, s, l },
        { role: 'Analogous +25°', h: (h + 25) % 360, s, l },
        { role: 'Warm Shift', h: (h + 45) % 360, s: Math.min(s + 10, 95), l: Math.max(l - 10, 25) },
      ];
      break;

    case 'complementary':
      colors = [
        { role: 'Base Ambient', h, s: Math.max(s - 35, 15), l: 94 },
        { role: 'Base Shade', h, s, l },
        { role: 'Base Accent', h, s: Math.min(s + 15, 100), l: Math.max(l - 15, 20) },
        { role: 'Complement Accent', h: (h + 180) % 360, s: Math.min(s + 10, 100), l },
        { role: 'Complement Soft', h: (h + 180) % 360, s: Math.max(s - 25, 20), l: Math.min(l + 25, 90) },
      ];
      break;

    case 'split-complementary':
      colors = [
        { role: 'Base Shade', h, s, l },
        { role: 'Base Deep', h, s: Math.min(s + 15, 100), l: Math.max(l - 25, 12) },
        { role: 'Split Right (+150°)', h: (h + 150) % 360, s: Math.max(s - 10, 30), l },
        { role: 'Split Left (+210°)', h: (h + 210) % 360, s: Math.max(s - 10, 30), l },
        { role: 'Ambient Glow', h: (h + 180) % 360, s: 20, l: 93 },
      ];
      break;

    case 'triadic':
      colors = [
        { role: 'Base Shade', h, s, l },
        { role: 'Base Soft', h, s: Math.max(s - 20, 25), l: Math.min(l + 25, 90) },
        { role: 'Triad 2 (+120°)', h: (h + 120) % 360, s, l },
        { role: 'Triad 3 (+240°)', h: (h + 240) % 360, s, l },
        { role: 'Deep Contrast', h: (h + 240) % 360, s: Math.min(s + 15, 100), l: Math.max(l - 28, 14) },
      ];
      break;

    case 'tetradic':
      colors = [
        { role: 'Base Shade', h, s, l },
        { role: 'Harmonic (+90°)', h: (h + 90) % 360, s, l },
        { role: 'Opposite (+180°)', h: (h + 180) % 360, s, l },
        { role: 'Harmonic (+270°)', h: (h + 270) % 360, s, l },
        { role: 'Neutral Slate', h, s: 15, l: 18 },
      ];
      break;

    case 'ui-cohesive':
      colors = [
        { role: 'Primary Anchor', h, s, l },
        { role: 'Action Accent', h: (h + 35) % 360, s: Math.min(s + 15, 98), l: Math.min(l + 10, 65) },
        { role: 'Surface Tint', h, s: Math.max(s - 45, 12), l: 96 },
        { role: 'Subtle Slate', h: (h + 10) % 360, s: 20, l: 45 },
        { role: 'Dark Surface', h, s: Math.max(s - 30, 20), l: 12 },
      ];
      break;

    case 'design-system':
      // 10-step full design system scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
      return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step, idx) => {
        // Curve lightness smoothly from 97% to 10%
        const lightMap: Record<number, number> = {
          50: 97,
          100: 92,
          200: 84,
          300: 72,
          400: 60,
          500: l, // Anchored exactly to base shade!
          600: Math.max(l * 0.8, 38),
          700: Math.max(l * 0.64, 28),
          800: Math.max(l * 0.48, 18),
          900: Math.max(l * 0.35, 12),
          950: Math.max(l * 0.22, 6),
        };
        const satMap: Record<number, number> = {
          50: Math.max(s - 30, 15),
          100: Math.max(s - 20, 25),
          200: Math.max(s - 10, 35),
          300: s,
          400: s,
          500: s,
          600: Math.min(s + 5, 100),
          700: Math.min(s + 10, 100),
          800: Math.min(s + 15, 100),
          900: Math.min(s + 20, 100),
          950: Math.min(s + 25, 100),
        };
        const targetL = lightMap[step];
        const targetS = satMap[step];
        const rgb = hslToRgb(h, targetS, targetL);
        return {
          id: `step-${step}`,
          color: buildColorObject(rgb),
          role: `${step}`,
        };
      });
  }

  // Merge with existing locked items if present
  return colors.map((c, index) => {
    const existing = existingPalette?.[index];
    if (existing?.locked) {
      return existing;
    }
    const rgb = hslToRgb(c.h, c.s, c.l);
    return {
      id: `palette-${harmony}-${index}-${Date.now()}`,
      color: buildColorObject(rgb),
      role: c.role,
      locked: false,
    };
  });
}

/** Tweak shade parameters directly */
export function adjustColor(
  base: ColorObject,
  delta: {
    hue?: number; // absolute 0-360 or relative
    saturation?: number; // 0-100
    lightness?: number; // 0-100
    temperature?: number; // -50 (cooler/blue) to +50 (warmer/amber)
  }
): ColorObject {
  let { h, s, l } = base.hsl;

  if (delta.hue !== undefined) {
    h = ((delta.hue % 360) + 360) % 360;
  }
  if (delta.saturation !== undefined) {
    s = clamp(delta.saturation, 0, 100);
  }
  if (delta.lightness !== undefined) {
    l = clamp(delta.lightness, 0, 100);
  }

  // Temperature shift: cooler shifts hue toward 210° (blue), warmer shifts hue toward 35° (amber)
  if (delta.temperature !== undefined && delta.temperature !== 0) {
    const temp = clamp(delta.temperature, -50, 50);
    const targetH = temp > 0 ? 35 : 210;
    const factor = Math.abs(temp) / 100;
    // Interpolate hue toward target
    const diff = ((targetH - h + 540) % 360) - 180;
    h = ((h + diff * factor) + 360) % 360;
  }

  const rgb = hslToRgb(h, s, l);
  return buildColorObject(rgb);
}

/** Export formatters */
export function exportToCssVariables(palette: PaletteItem[], baseName = 'brand'): string {
  const lines = [':root {'];
  palette.forEach((item, i) => {
    const cleanRole = item.role.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    lines.push(`  --color-${baseName}-${cleanRole || i}: ${item.color.hex};`);
  });
  lines.push('}');
  return lines.join('\n');
}

export function exportToTailwindConfig(palette: PaletteItem[], paletteName = 'custom'): string {
  const obj: Record<string, string> = {};
  palette.forEach((item, i) => {
    const key = item.role.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `shade${i}`;
    obj[key] = item.color.hex;
  });
  return `// tailwind.config.js / theme.extend.colors\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${paletteName}': ${JSON.stringify(obj, null, 10).replace(/"([^"]+)":/g, '$1:')}\n      }\n    }\n  }\n};`;
}

export function exportToJson(palette: PaletteItem[]): string {
  const data = palette.map(p => ({
    role: p.role,
    name: p.color.name,
    hex: p.color.hex,
    rgb: `rgb(${p.color.rgb.r}, ${p.color.rgb.g}, ${p.color.rgb.b})`,
    hsl: `hsl(${p.color.hsl.h}, ${p.color.hsl.s}%, ${p.color.hsl.l}%)`,
    oklch: `oklch(${p.color.oklch.l} ${p.color.oklch.c} ${p.color.oklch.h})`,
    bestTextColor: p.color.bestTextColor,
  }));
  return JSON.stringify(data, null, 2);
}

export function exportToSvg(palette: PaletteItem[]): string {
  const swatchWidth = 120;
  const swatchHeight = 180;
  const totalWidth = swatchWidth * palette.length;
  const rects = palette.map((p, idx) => {
    const x = idx * swatchWidth;
    return `
    <g transform="translate(${x}, 0)">
      <rect width="${swatchWidth}" height="${swatchHeight}" fill="${p.color.hex}" />
      <text x="12" y="${swatchHeight - 48}" fill="${p.color.bestTextColor}" font-family="sans-serif" font-size="12" font-weight="bold">${p.role}</text>
      <text x="12" y="${swatchHeight - 28}" fill="${p.color.bestTextColor}" font-family="monospace" font-size="13">${p.color.hex}</text>
      <text x="12" y="${swatchHeight - 12}" fill="${p.color.bestTextColor}" font-family="sans-serif" font-size="10" opacity="0.8">${p.color.name}</text>
    </g>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${swatchHeight}" width="${totalWidth}" height="${swatchHeight}">
  ${rects}
</svg>`;
}
