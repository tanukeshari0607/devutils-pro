"use client";

import { useState, useRef, useCallback } from "react";
import { Copy, Check, Trash2, Upload, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

type Mode = "text" | "file";
type Direction = "encode" | "decode";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function Base64Encoder() {
  const [mode, setMode] = useState<Mode>("text");
  const [direction, setDirection] = useState<Direction>("encode");
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [textError, setTextError] = useState("");
  const [copied, setCopied] = useState(false);

  // File mode state
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileOutput, setFileOutput] = useState("");
  const [fileWarning, setFileWarning] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Text mode ────────────────────────────────────────────────
  const processText = useCallback((value: string, dir: Direction) => {
    setTextError("");
    if (!value) { setTextOutput(""); return; }
    try {
      if (dir === "encode") {
        setTextOutput(btoa(unescape(encodeURIComponent(value))));
      } else {
        setTextOutput(decodeURIComponent(escape(atob(value))));
      }
    } catch {
      setTextError(dir === "decode" ? "Invalid Base64 string." : "Encoding failed.");
      setTextOutput("");
    }
  }, []);

  const handleTextChange = (v: string) => {
    setTextInput(v);
    processText(v, direction);
  };

  const flipDirection = () => {
    const next: Direction = direction === "encode" ? "decode" : "encode";
    setDirection(next);
    // Swap input/output
    setTextInput(textOutput);
    processText(textOutput, next);
  };

  // ── File mode ────────────────────────────────────────────────
  const processFile = (file: File) => {
    setFileWarning("");
    setFileOutput("");
    setFileName(file.name);
    setFileSize(file.size);
    if (file.size > MAX_FILE_BYTES) {
      setFileWarning(`File is ${formatBytes(file.size)} — exceeds the 5 MB limit. Output may be very large.`);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // dataUrl = "data:<mime>;base64,<data>" — extract the base64 part
      const b64 = dataUrl.split(",")[1] ?? "";
      setFileOutput(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const copy = async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const outputText = mode === "text" ? textOutput : fileOutput;

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-[var(--border)] w-fit">
        {(["text", "file"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
              mode === m ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {m === "text" ? "Text" : "File"}
          </button>
        ))}
      </div>

      {mode === "text" && (
        <>
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
              {direction === "encode" ? "Plain text input" : "Base64 input"}
            </span>
            <textarea
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={direction === "encode" ? "Enter text to encode…" : "Enter Base64 string to decode…"}
              className="textarea-code h-48 resize-y"
              spellCheck={false}
            />
          </div>

          {textError && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14} /> {textError}
            </p>
          )}

          {textOutput && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{direction === "encode" ? "Base64 output" : "Decoded text"}</span>
                <button onClick={() => copy(textOutput)} className="btn-secondary py-1 text-xs">
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <textarea
                readOnly
                value={textOutput}
                className="textarea-code h-48 resize-y opacity-90"
              />
              <div className="flex gap-4 text-xs text-[var(--text-muted)] font-code">
                <span>Input: {formatBytes(new TextEncoder().encode(textInput).length)}</span>
                <span>Output: {formatBytes(new TextEncoder().encode(textOutput).length)}</span>
              </div>
            </div>
          )}
        </>
      )}

      {mode === "file" && (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              "flex flex-col items-center justify-center gap-3 h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all",
              dragging
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-slate-700 hover:border-indigo-500/60 hover:bg-indigo-500/5"
            )}
          >
            <Upload size={28} className="text-[var(--text-muted)]" />
            <div className="text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Drag & drop any file, or <span className="text-indigo-400">browse</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Max recommended: 5 MB</p>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInput} />
          </div>

          {fileWarning && (
            <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {fileWarning}
            </div>
          )}

          {fileOutput && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="font-medium text-[var(--text-secondary)]">{fileName}</span>
                <button onClick={() => copy(fileOutput)} className="btn-secondary py-1 text-xs">
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <textarea
                readOnly
                value={fileOutput}
                className="textarea-code h-60 resize-y text-xs opacity-90"
              />
              <div className="flex gap-4 text-xs text-[var(--text-muted)] font-code">
                <span>Original: {formatBytes(fileSize)}</span>
                <span>Base64: {formatBytes(fileOutput.length)}</span>
                <span>Overhead: +{Math.round((fileOutput.length / (fileSize || 1) - 1) * 100)}%</span>
              </div>
            </div>
          )}
        </>
      )}

      {outputText && (
        <button
          onClick={() => { setTextInput(""); setTextOutput(""); setFileOutput(""); setFileName(""); setTextError(""); }}
          className="btn-secondary text-xs py-1 w-fit"
        >
          <Trash2 size={12} /> Clear all
        </button>
      )}
    </div>
  );
}
