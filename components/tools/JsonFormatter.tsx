"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Copy,
  Trash2,
  Check,
  AlertCircle,
  Download,
  Upload,
  FileJson,
  Search,
  ChevronsDownUp,
  ChevronsUpDown,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard, showToast } from "@/lib/toast";
import { CodeEditor } from "@/components/tools/json-formatter/CodeEditor";
import { JsonTreeView, type JsonValue } from "@/components/tools/json-formatter/JsonTreeView";

type Indent = 2 | 4 | "tab";
type ViewMode = "text" | "tree";

interface JsonError {
  message: string;
  line?: number;
  column?: number;
}

const SAMPLE_JSON = JSON.stringify(
  {
    id: "usr_8f2a1c",
    name: "Ada Lovelace",
    active: true,
    roles: ["admin", "editor"],
    profile: { age: 36, country: "UK", verified: true },
    tags: null,
    scores: [98.5, 87, 91.2],
  },
  null,
  2
);

function getLineAndColumn(input: string, position: number): { line: number; column: number } {
  const before = input.slice(0, position);
  const lines = before.split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function parseJsonError(raw: string, input: string): JsonError {
  const cleaned = raw.replace(/^SyntaxError:\s*/i, "");
  const posMatch = cleaned.match(/position (\d+)/i);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const { line, column } = getLineAndColumn(input, pos);
    return { message: cleaned, line, column };
  }
  const lineColMatch = cleaned.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return { message: cleaned, line: parseInt(lineColMatch[1], 10), column: parseInt(lineColMatch[2], 10) };
  }
  return { message: cleaned };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJson(json: string): string {
  if (!json) return "";
  return escapeHtml(json).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-amber-300"; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-indigo-300" : "text-green-300"; // key : string
      } else if (/true|false/.test(match)) {
        cls = "text-blue-300";
      } else if (/null/.test(match)) {
        cls = "text-slate-400";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<Indent>(2);
  const [realtime, setRealtime] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandSignal, setExpandSignal] = useState({ expand: true, key: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = input.length;
  const lineCount = input ? input.split("\n").length : 0;

  // Parse + format derived from a "committed" snapshot of the input. In
  // real-time mode the snapshot tracks every keystroke; in manual mode it
  // only advances when Format/Minify is explicitly triggered.
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [committedInput, setCommittedInput] = useState("");

  useEffect(() => {
    if (realtime) setCommittedInput(input);
  }, [input, realtime]);

  const result = useMemo(() => {
    if (!committedInput.trim()) return { output: "", parsed: null as JsonValue | null, error: null as JsonError | null };
    try {
      const parsed = JSON.parse(committedInput);
      const spaces = indent === "tab" ? "\t" : indent;
      const output = mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, spaces);
      return { output, parsed, error: null };
    } catch (e) {
      return { output: "", parsed: null, error: parseJsonError(String(e), committedInput) };
    }
  }, [committedInput, indent, mode]);

  const { output, parsed, error } = result;

  const format = useCallback(() => {
    setMode("format");
    setCommittedInput(input);
  }, [input]);

  const minify = useCallback(() => {
    setMode("minify");
    setCommittedInput(input);
  }, [input]);

  // Checks syntax without touching the committed/formatted output — useful
  // in manual mode when you just want a yes/no answer before reformatting.
  const validate = useCallback(() => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      showToast("Valid JSON ✓");
    } catch (e) {
      const { line, column } = parseJsonError(String(e), input);
      showToast(line ? `Invalid JSON — line ${line}${column ? `, col ${column}` : ""}` : "Invalid JSON");
    }
  }, [input]);

  const copy = useCallback(async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const clear = () => {
    setInput("");
    setSearch("");
  };

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setMode("format");
  };

  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ""));
      setMode("format");
    };
    reader.onerror = () => showToast("Failed to read file");
    reader.readAsText(file);
    e.target.value = "";
  };

  // Keyboard shortcuts: Ctrl/Cmd+Enter format, Ctrl/Cmd+Shift+M minify, Ctrl/Cmd+Shift+C copy
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === "Enter") {
        e.preventDefault();
        format();
      } else if (e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        minify();
      } else if (e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copy();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [format, minify, copy]);

  return (
    <div className="flex flex-col h-[78vh] min-h-[560px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-[var(--border)] shrink-0">
        <button onClick={format} className="btn-primary py-1.5">
          Format <kbd className="ml-1 text-xs opacity-60 font-code">⌃↵</kbd>
        </button>
        <button onClick={minify} className="btn-secondary py-1.5">
          Minify <kbd className="ml-1 text-xs opacity-60 font-code">⌃⇧M</kbd>
        </button>
        <button onClick={validate} className="btn-secondary py-1.5">
          <CheckCircle2 size={14} /> Validate
        </button>

        <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] cursor-pointer px-1">
          <input
            type="checkbox"
            checked={realtime}
            onChange={(e) => setRealtime(e.target.checked)}
            className="accent-indigo-500"
          />
          Real-time
        </label>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--text-muted)]">Indent:</span>
          {([2, 4, "tab"] as Indent[]).map((v) => (
            <button
              key={v}
              onClick={() => setIndent(v)}
              className={clsx(
                "px-2.5 py-1 rounded text-xs font-code border transition-colors",
                indent === v
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-indigo-500"
              )}
            >
              {v === "tab" ? "Tab" : v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={loadSample} className="btn-secondary py-1.5 text-xs">
            <FileJson size={13} /> Sample
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary py-1.5 text-xs">
            <Upload size={13} /> Upload
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleUpload} className="hidden" />
          <button onClick={clear} className="btn-secondary py-1.5 text-xs">
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Split panel */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* Input */}
        <div className="flex flex-col flex-1 min-h-0 md:border-r border-[var(--border)] border-b md:border-b-0">
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[var(--text-muted)] bg-slate-900/40 shrink-0">
            <span>Input</span>
            <span className="font-code">{charCount} chars · {lineCount} lines</span>
          </div>
          <div className="flex-1 min-h-0 bg-slate-900">
            <CodeEditor
              value={input}
              onChange={setInput}
              highlight={highlightJson}
              placeholder='Paste JSON here… e.g. {"name":"Alice","age":30}'
              errorLine={error?.line}
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 border-t border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 shrink-0">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>
                {error.line ? <strong>Line {error.line}{error.column ? `, Col ${error.column}` : ""}: </strong> : null}
                {error.message}
              </span>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-[var(--text-muted)] bg-slate-900/40 shrink-0">
            <div className="flex items-center gap-1">
              {(["text", "tree"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={clsx(
                    "px-2 py-0.5 rounded text-xs capitalize transition-colors",
                    viewMode === v ? "bg-indigo-600 text-white" : "hover:bg-white/10 text-[var(--text-secondary)]"
                  )}
                >
                  {v} View
                </button>
              ))}
              {viewMode === "tree" && (
                <>
                  <button
                    onClick={() => setExpandSignal((s) => ({ expand: true, key: s.key + 1 }))}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-white/10 text-[var(--text-secondary)]"
                    title="Expand all"
                  >
                    <ChevronsUpDown size={12} /> Expand
                  </button>
                  <button
                    onClick={() => setExpandSignal((s) => ({ expand: false, key: s.key + 1 }))}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-white/10 text-[var(--text-secondary)]"
                    title="Collapse all"
                  >
                    <ChevronsDownUp size={12} /> Collapse
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copy} className="btn-secondary py-1 text-xs" disabled={!output}>
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button onClick={downloadJson} className="btn-secondary py-1 text-xs" disabled={!output}>
                <Download size={12} /> Download
              </button>
            </div>
          </div>

          {viewMode === "tree" && output && (
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[var(--border)] shrink-0">
              <Search size={13} className="text-[var(--text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keys & values…"
                className="flex-1 bg-transparent text-xs outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
          )}

          <div className="flex-1 min-h-0 bg-slate-900 overflow-auto">
            {!output && !error && (
              <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)] gap-2 p-6 text-center">
                <Zap size={14} className="opacity-50" />
                Formatted output will appear here
              </div>
            )}
            {output && viewMode === "text" && (
              <CodeEditor value={output} highlight={highlightJson} readOnly />
            )}
            {output && viewMode === "tree" && parsed !== null && (
              <JsonTreeView data={parsed} searchTerm={search} expandSignal={expandSignal} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
