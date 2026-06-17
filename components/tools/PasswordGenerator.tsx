"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
  ambiguous: /[0Ol1I]/g,
};

function scorePassword(pwd: string): 0 | 1 | 2 | 3 {
  if (pwd.length < 8) return 0;
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return 0;
  if (score === 3) return 1;
  if (score === 4 || score === 5) return 2;
  return 3;
}

const STRENGTH_LABEL = ["Weak", "Fair", "Strong", "Very Strong"];
const STRENGTH_COLOR = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-400",
  "bg-green-500",
];
const STRENGTH_TEXT = [
  "text-red-400",
  "text-yellow-400",
  "text-blue-400",
  "text-green-400",
];

function generateOne(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  noAmbiguous: boolean
): string {
  let charset = "";
  if (useUpper) charset += CHARS.upper;
  if (useLower) charset += CHARS.lower;
  if (useNumbers) charset += CHARS.numbers;
  if (useSymbols) charset += CHARS.symbols;
  if (!charset) charset = CHARS.lower;
  if (noAmbiguous) charset = charset.replace(CHARS.ambiguous, "");
  if (!charset) return "";

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => charset[n % charset.length]).join("");
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      list.push(generateOne(length, useUpper, useLower, useNumbers, useSymbols, noAmbiguous));
    }
    setPasswords(list);
  }, [length, useUpper, useLower, useNumbers, useSymbols, noAmbiguous, bulkCount]);

  const copy = async (text: string, idx: number) => {
    await copyToClipboard(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    await copyToClipboard(passwords.join("\n"), `Copied ${passwords.length} passwords`);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const strength = passwords[0] ? scorePassword(passwords[0]) : null;

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Left: sliders + checkboxes */}
        <div className="flex flex-col gap-4">
          {/* Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Length</label>
              <span className="font-code text-indigo-400 text-sm">{length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1 font-code">
              <span>8</span><span>128</span>
            </div>
          </div>

          {/* Character sets */}
          <div className="space-y-2">
            {[
              { label: "Uppercase (A–Z)", value: useUpper, set: setUseUpper },
              { label: "Lowercase (a–z)", value: useLower, set: setUseLower },
              { label: "Numbers (0–9)", value: useNumbers, set: setUseNumbers },
              { label: "Symbols (!@#…)", value: useSymbols, set: setUseSymbols },
              { label: "Exclude ambiguous (0, O, l, 1, I)", value: noAmbiguous, set: setNoAmbiguous },
            ].map(({ label, value, set }) => (
              <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => set(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Right: bulk count */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Bulk generate</label>
              <span className="font-code text-indigo-400 text-sm">{bulkCount}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={bulkCount}
              onChange={(e) => setBulkCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1 font-code">
              <span>1</span><span>20</span>
            </div>
          </div>

          <button onClick={generate} className="btn-primary justify-center py-2.5 mt-2">
            <RefreshCw size={15} /> Generate
          </button>

          {passwords.length > 1 && (
            <button onClick={copyAll} className="btn-secondary justify-center py-2 text-xs">
              {copiedAll ? <><Check size={12} /> Copied all!</> : <><Copy size={12} /> Copy all ({passwords.length})</>}
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      {passwords.length > 0 && (
        <div className="flex flex-col gap-2">
          {/* Strength bar (for first password) */}
          {strength !== null && bulkCount === 1 && (
            <div className="flex items-center gap-3 mb-1">
              <div className="flex gap-1 flex-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={clsx(
                      "h-1.5 flex-1 rounded-full transition-all",
                      i <= strength ? STRENGTH_COLOR[strength] : "bg-slate-800"
                    )}
                  />
                ))}
              </div>
              <span className={clsx("text-xs font-medium w-20 text-right", STRENGTH_TEXT[strength])}>
                {STRENGTH_LABEL[strength]}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
            {passwords.map((pwd, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-slate-950 px-4 py-2.5 group"
              >
                <span className="flex-1 font-code text-sm text-slate-200 break-all">{pwd}</span>
                <button
                  onClick={() => copy(pwd, i)}
                  className="shrink-0 p-1.5 rounded text-slate-500 hover:text-indigo-400 transition-colors"
                  aria-label="Copy"
                >
                  {copiedIdx === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPasswords([])}
            className="btn-secondary text-xs py-1 w-fit mt-1"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
