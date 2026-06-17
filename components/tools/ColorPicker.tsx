"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/toast";

interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface HSV { h: number; s: number; v: number; }

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function isValidHex(hex: string): boolean {
  return /^#([a-f\d]{6})$/i.test(hex);
}

const RECENTS_KEY = "devutils-recent-colors";
const DEFAULT_COLOR = "#6366f1";

function loadRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function ColorPicker() {
  const [hex, setHex] = useState(DEFAULT_COLOR);
  const [hexInput, setHexInput] = useState(DEFAULT_COLOR);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => setRecents(loadRecents()), []);

  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);

  const updateColor = useCallback((newHex: string) => {
    setHex(newHex);
    setHexInput(newHex);
  }, []);

  const saveToRecents = (color: string) => {
    setRecents((prev) => {
      const next = [color, ...prev.filter((c) => c !== color)].slice(0, 12);
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleHexInputChange = (v: string) => {
    setHexInput(v);
    const normalized = v.startsWith("#") ? v : `#${v}`;
    if (isValidHex(normalized)) {
      setHex(normalized);
    }
  };

  const handlePickerChange = (v: string) => {
    updateColor(v);
  };

  const handlePickerCommit = () => {
    saveToRecents(hex);
  };

  const copy = async (text: string, field: string) => {
    await copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Complementary 5-color palette generation
  const palette = [0, 1, 2, 3, 4].map((i) => {
    const h = (hsl.h + i * 72) % 360; // evenly spaced around wheel (analogous-style 5 colors)
    return rgbToHex(hslToRgb({ h, s: hsl.s, l: hsl.l }));
  });

  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "HSV", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  ];

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Color wheel / native picker + preview */}
        <div className="flex flex-col items-center gap-3">
          <input
            type="color"
            value={hex}
            onChange={(e) => handlePickerChange(e.target.value)}
            onBlur={handlePickerCommit}
            className="w-32 h-32 rounded-2xl cursor-pointer border-2 border-[var(--border)] bg-transparent"
            style={{ appearance: "none" } as React.CSSProperties}
          />
          <div
            className="w-full h-10 rounded-lg border border-[var(--border)]"
            style={{ backgroundColor: hex }}
          />
        </div>

        {/* Hex input + format values */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-muted)]">HEX</label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              onBlur={() => isValidHex(hex) && saveToRecents(hex)}
              placeholder="#6366f1"
              className="textarea-code h-10 px-3 py-0 flex items-center"
              spellCheck={false}
            />
          </div>

          {formats.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-slate-950 px-3 py-2">
              <span className="text-xs text-[var(--text-muted)] w-10 shrink-0">{label}</span>
              <span className="flex-1 font-code text-sm text-slate-200 truncate">{value}</span>
              <button onClick={() => copy(value, label)} className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0">
                {copiedField === label ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Palette generator */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2">5-Color Palette (based on selected hue)</p>
        <div className="grid grid-cols-5 gap-2">
          {palette.map((c, i) => (
            <button
              key={i}
              onClick={() => { updateColor(c); saveToRecents(c); }}
              className="group flex flex-col gap-1.5 items-center"
              title={c}
            >
              <div
                className="w-full h-16 rounded-lg border border-[var(--border)] group-hover:scale-105 transition-transform"
                style={{ backgroundColor: c }}
              />
              <span className="text-xs font-code text-[var(--text-muted)]">{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent colors */}
      {recents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--text-muted)]">Recently Used</p>
            <button
              onClick={() => { setRecents([]); localStorage.removeItem(RECENTS_KEY); }}
              className="text-xs text-[var(--text-muted)] hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={11} /> Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recents.map((c, i) => (
              <button
                key={i}
                onClick={() => updateColor(c)}
                className="w-9 h-9 rounded-lg border border-[var(--border)] hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
