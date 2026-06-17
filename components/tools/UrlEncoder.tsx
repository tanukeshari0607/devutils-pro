"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Trash2, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

type Direction = "encode" | "decode";
type Mode = "full" | "component";

function encodeQueryParamsOnly(url: string): string {
  const qIndex = url.indexOf("?");
  if (qIndex === -1) return url;
  const base = url.slice(0, qIndex + 1);
  const query = url.slice(qIndex + 1);
  const encodedQuery = query
    .split("&")
    .map((pair) => {
      const [k, ...rest] = pair.split("=");
      const v = rest.join("=");
      const encK = encodeURIComponent(decodeURIComponentSafe(k));
      if (v === undefined) return encK;
      return `${encK}=${encodeURIComponent(decodeURIComponentSafe(v))}`;
    })
    .join("&");
  return base + encodedQuery;
}

function decodeQueryParamsOnly(url: string): string {
  const qIndex = url.indexOf("?");
  if (qIndex === -1) return url;
  const base = url.slice(0, qIndex + 1);
  const query = url.slice(qIndex + 1);
  const decodedQuery = query
    .split("&")
    .map((pair) => {
      const [k, ...rest] = pair.split("=");
      const v = rest.join("=");
      const decK = decodeURIComponentSafe(k);
      if (v === undefined) return decK;
      return `${decK}=${decodeURIComponentSafe(v)}`;
    })
    .join("&");
  return base + decodedQuery;
}

function decodeURIComponentSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function UrlEncoder() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [mode, setMode] = useState<Mode>("full");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const process = useCallback((value: string, dir: Direction, m: Mode) => {
    setError("");
    if (!value) { setOutput(""); return; }
    try {
      if (m === "full") {
        setOutput(dir === "encode" ? encodeURI(value) : decodeURI(value));
      } else {
        if (dir === "encode") {
          // Component mode: if it looks like a URL with query params, encode only those;
          // otherwise treat the whole input as a component to encode.
          setOutput(value.includes("?") ? encodeQueryParamsOnly(value) : encodeURIComponent(value));
        } else {
          setOutput(value.includes("?") ? decodeQueryParamsOnly(value) : decodeURIComponent(value));
        }
      }
    } catch (e) {
      setError(`Invalid input for ${dir === "decode" ? "decoding" : "encoding"}: ${String(e).replace(/^.*?Error:\s*/i, "")}`);
      setOutput("");
    }
  }, []);

  const handleInput = (v: string) => {
    setInput(v);
    process(v, direction, mode);
  };

  const flipDirection = () => {
    const next: Direction = direction === "encode" ? "decode" : "encode";
    setDirection(next);
    setInput(output);
    process(output, next, mode);
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    process(input, direction, m);
  };

  const copy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-[var(--border)] w-fit">
        {([
          { v: "full", label: "Full URL" },
          { v: "component", label: "Component (query params)" },
        ] as { v: Mode; label: string }[]).map(({ v, label }) => (
          <button
            key={v}
            onClick={() => changeMode(v)}
            className={clsx(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              mode === v ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Encode/Decode toggle */}
      <div className="flex items-center gap-3">
        <span className={clsx("text-sm font-medium", direction === "encode" ? "text-indigo-400" : "text-[var(--text-muted)]")}>Encode</span>
        <button
          onClick={flipDirection}
          className="relative w-12 h-6 rounded-full bg-slate-700 border border-slate-600 transition-colors hover:border-indigo-500"
          aria-label="Switch encode/decode"
        >
          <span className={clsx(
            "absolute top-0.5 w-5 h-5 rounded-full bg-indigo-500 transition-all",
            direction === "encode" ? "left-0.5" : "left-6"
          )} />
        </button>
        <span className={clsx("text-sm font-medium", direction === "decode" ? "text-indigo-400" : "text-[var(--text-muted)]")}>Decode</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[var(--text-muted)]">
          {direction === "encode" ? "Plain URL / text input" : "Encoded URL / text input"}
        </span>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={
            mode === "full"
              ? "https://example.com/search?q=hello world&lang=en"
              : "q=hello world&category=books & more"
          }
          className="textarea-code h-32 resize-y"
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1.5">
          <AlertTriangle size={14} /> {error}
        </p>
      )}

      {output && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Output</span>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary py-1 text-xs">
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button onClick={clear} className="btn-secondary py-1 text-xs">
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>
          <textarea readOnly value={output} className="textarea-code h-32 resize-y opacity-90" />
        </div>
      )}

      {!output && (
        <button onClick={clear} className="btn-secondary text-xs py-1 w-fit">
          <Trash2 size={12} /> Clear
        </button>
      )}
    </div>
  );
}
