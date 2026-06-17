"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, AlertCircle, Copy, Check } from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

const ALL_FLAGS = ["g", "i", "m", "s", "u"] as const;
type Flag = (typeof ALL_FLAGS)[number];

interface MatchInfo {
  index: number;
  value: string;
  groups: string[];
}

const CHEAT_SHEET = [
  { cat: "Anchors", items: [{ p: "^", d: "Start of string" }, { p: "$", d: "End of string" }, { p: "\\b", d: "Word boundary" }] },
  { cat: "Character Classes", items: [{ p: "\\d", d: "Digit [0-9]" }, { p: "\\w", d: "Word char [a-zA-Z0-9_]" }, { p: "\\s", d: "Whitespace" }, { p: ".", d: "Any char except newline" }] },
  { cat: "Quantifiers", items: [{ p: "*", d: "0 or more" }, { p: "+", d: "1 or more" }, { p: "?", d: "0 or 1" }, { p: "{n,m}", d: "Between n and m" }] },
  { cat: "Groups", items: [{ p: "(abc)", d: "Capture group" }, { p: "(?:abc)", d: "Non-capture group" }, { p: "(?=abc)", d: "Lookahead" }, { p: "(?!abc)", d: "Negative lookahead" }] },
];

const COMMON_PATTERNS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "gi" },
  { label: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*", flags: "gi" },
  { label: "Phone (US)", pattern: "(\\+1[\\s.-]?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", flags: "g" },
  { label: "IPv4", pattern: "(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)", flags: "g" },
  { label: "Hex color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}", flags: "gi" },
];

function highlightMatches(text: string, regex: RegExp): string {
  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const safeRegex = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  // reset
  safeRegex.lastIndex = 0;

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  while ((match = safeRegex.exec(text)) !== null) {
    result += escape(text.slice(lastIndex, match.index));
    result += `<mark class="bg-yellow-400/30 text-yellow-200 rounded px-0.5">${escape(match[0])}</mark>`;
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) safeRegex.lastIndex++; // avoid infinite loop on zero-width
  }
  result += escape(text.slice(lastIndex));
  return result;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<Flag>>(new Set<Flag>(["g"]));
  const [testStr, setTestStr] = useState("");
  const [openCheat, setOpenCheat] = useState<string | null>(null);
  const [copiedPattern, setCopiedPattern] = useState(false);

  const toggleFlag = (f: Flag) =>
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) { next.delete(f); } else { next.add(f); }
      return next;
    });

  const { regexError, matches, highlighted } = useMemo(() => {
    if (!pattern) return { regexError: null, matches: [], highlighted: testStr };
    try {
      const re = new RegExp(pattern, Array.from(flags).join(""));
      const found: MatchInfo[] = [];
      let m: RegExpExecArray | null;
      const safeRe = new RegExp(pattern, flags.has("g") ? Array.from(flags).join("") : Array.from(flags).join("") + "g");
      safeRe.lastIndex = 0;
      while ((m = safeRe.exec(testStr)) !== null) {
        found.push({ index: m.index, value: m[0], groups: m.slice(1) });
        if (m[0].length === 0) safeRe.lastIndex++;
        if (found.length > 500) break;
      }
      return { regexError: null, matches: found, highlighted: highlightMatches(testStr, re) };
    } catch (e) {
      return { regexError: String(e).replace(/^.*?Error:\s*/i, ""), matches: [], highlighted: testStr };
    }
  }, [pattern, flags, testStr]);

  const applyCommonPattern = (p: { pattern: string; flags: string }) => {
    setPattern(p.pattern);
    const f = new Set<Flag>(
      p.flags.split("").filter((c): c is Flag => (ALL_FLAGS as readonly string[]).includes(c))
    );
    setFlags(f);
  };

  const copyPattern = async () => {
    await copyToClipboard(`/${pattern}/${Array.from(flags).join("")}`);
    setCopiedPattern(true);
    setTimeout(() => setCopiedPattern(false), 1500);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Left: inputs + results */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Regex input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-muted)]">Regular Expression</label>
            <div className="flex items-center rounded-lg border border-[var(--border)] bg-slate-950 focus-within:border-indigo-500 overflow-hidden">
              <span className="px-3 text-slate-500 font-code text-sm select-none border-r border-[var(--border)]">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
                className="flex-1 bg-transparent font-code text-sm text-slate-100 px-3 py-2.5 outline-none placeholder:text-slate-600"
                spellCheck={false}
              />
              <span className="px-2 text-slate-500 font-code text-sm select-none">/</span>
              {/* Flags */}
              <div className="flex border-l border-[var(--border)]">
                {ALL_FLAGS.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFlag(f)}
                    className={clsx(
                      "px-2.5 py-2.5 font-code text-xs transition-colors",
                      flags.has(f) ? "text-indigo-400 bg-indigo-500/10" : "text-slate-600 hover:text-slate-400"
                    )}
                    title={`Toggle ${f} flag`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={copyPattern} className="px-2.5 text-slate-500 hover:text-indigo-400 transition-colors border-l border-[var(--border)] py-2.5">
                {copiedPattern ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
            {regexError && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                <AlertCircle size={12} /> {regexError}
              </p>
            )}
          </div>

          {/* Test string */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <label>Test String</label>
              {matches.length > 0 && (
                <span className="text-indigo-400 font-medium">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
              )}
            </div>
            <div
              className="relative min-h-[9rem] rounded-lg border border-[var(--border)] bg-slate-950 focus-within:border-indigo-500"
            >
              {/* Highlighted overlay */}
              <div
                className="absolute inset-0 px-4 py-3 font-code text-sm leading-relaxed whitespace-pre-wrap break-words pointer-events-none text-transparent"
                dangerouslySetInnerHTML={{ __html: highlighted || "" }}
                style={{ color: "transparent" }}
              />
              <textarea
                value={testStr}
                onChange={(e) => setTestStr(e.target.value)}
                placeholder="Enter test string here…"
                className="relative w-full h-36 bg-transparent font-code text-sm text-slate-200 px-4 py-3 outline-none resize-y placeholder:text-slate-600 caret-white"
                spellCheck={false}
                style={{ caretColor: "white" }}
              />
            </div>
          </div>

          {/* Match results */}
          {matches.length > 0 && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] overflow-hidden">
              <div className="px-4 py-2 border-b border-[var(--border)] text-xs font-medium text-[var(--text-secondary)]">
                Match Results ({matches.length})
              </div>
              <div className="max-h-44 overflow-y-auto divide-y divide-[var(--border)]">
                {matches.map((m, i) => (
                  <div key={i} className="px-4 py-2 flex items-start gap-3 text-xs font-code">
                    <span className="text-indigo-400 w-6 shrink-0">#{i + 1}</span>
                    <span className="text-green-300 flex-1 break-all">{m.value || <em className="text-slate-500">empty match</em>}</span>
                    <span className="text-slate-500 shrink-0">idx {m.index}</span>
                    {m.groups.length > 0 && (
                      <span className="text-yellow-300 shrink-0">
                        [{m.groups.map((g, gi) => <span key={gi} title={`group ${gi + 1}`}>{g ?? "—"}</span>)}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common patterns */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Common patterns (click to use):</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PATTERNS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyCommonPattern(p)}
                  className="px-2.5 py-1 rounded-md border border-[var(--border)] text-xs text-[var(--text-secondary)] hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: cheat sheet */}
        <div className="lg:w-64 shrink-0 flex flex-col gap-1">
          <p className="text-xs font-medium text-[var(--text-muted)] mb-1">Regex Cheat Sheet</p>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            {CHEAT_SHEET.map(({ cat, items }) => (
              <div key={cat} className="border-b border-[var(--border)] last:border-0">
                <button
                  onClick={() => setOpenCheat(openCheat === cat ? null : cat)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  {cat}
                  {openCheat === cat ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                {openCheat === cat && (
                  <div className="bg-[var(--bg-subtle)] divide-y divide-[var(--border)]/50">
                    {items.map(({ p, d }) => (
                      <button
                        key={p}
                        onClick={() => setPattern((prev) => prev + p)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-indigo-500/10 transition-colors text-left"
                        title="Click to append"
                      >
                        <code className="font-code text-xs text-indigo-400 w-20 shrink-0">{p}</code>
                        <span className="text-xs text-[var(--text-muted)]">{d}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
