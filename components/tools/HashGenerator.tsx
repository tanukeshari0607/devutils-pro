"use client";

import { useState, useCallback, useRef } from "react";
import { Copy, Check, Upload } from "lucide-react";
import CryptoJS from "crypto-js";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

type Mode = "text" | "file";

async function sha256Buffer(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha1Buffer(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha512Buffer(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-512", buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function wordArrayFromBuffer(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(
      ((bytes[i] ?? 0) << 24) | ((bytes[i + 1] ?? 0) << 16) | ((bytes[i + 2] ?? 0) << 8) | (bytes[i + 3] ?? 0)
    );
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

interface HashResult { md5: string; sha1: string; sha256: string; sha512: string; }

function CopyableHash({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-slate-950 px-3 py-2.5">
      <span className={clsx("text-xs font-medium w-16 shrink-0", colorClass)}>{label}</span>
      <span className="flex-1 font-code text-xs text-slate-200 break-all">{value}</span>
      <button onClick={copy} className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0">
        {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export function HashGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [textHashes, setTextHashes] = useState<HashResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileHashes, setFileHashes] = useState<HashResult | null>(null);
  const [hashing, setHashing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hashText = useCallback(async (value: string) => {
    if (!value) { setTextHashes(null); return; }
    const buf = new TextEncoder().encode(value).buffer;
    const [sha1, sha256, sha512] = await Promise.all([
      sha1Buffer(buf), sha256Buffer(buf), sha512Buffer(buf),
    ]);
    setTextHashes({
      md5: CryptoJS.MD5(value).toString(),
      sha1, sha256, sha512,
    });
  }, []);

  const handleTextChange = (v: string) => {
    setText(v);
    hashText(v);
  };

  const hashFile = async (file: File) => {
    setHashing(true);
    setFileName(file.name);
    const buf = await file.arrayBuffer();
    const [sha1, sha256, sha512] = await Promise.all([
      sha1Buffer(buf), sha256Buffer(buf), sha512Buffer(buf),
    ]);
    const wordArray = wordArrayFromBuffer(buf);
    setFileHashes({
      md5: CryptoJS.MD5(wordArray).toString(),
      sha1, sha256, sha512,
    });
    setHashing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) hashFile(file);
  };

  const HASH_LABELS: { key: keyof HashResult; label: string; color: string }[] = [
    { key: "md5", label: "MD5", color: "text-pink-400" },
    { key: "sha1", label: "SHA-1", color: "text-yellow-400" },
    { key: "sha256", label: "SHA-256", color: "text-green-400" },
    { key: "sha512", label: "SHA-512", color: "text-blue-400" },
  ];

  return (
    <div className="p-5 flex flex-col gap-4">
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
            {m}
          </button>
        ))}
      </div>

      {mode === "text" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-muted)]">Input text</label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter text to hash…"
              className="textarea-code h-40 resize-y"
              spellCheck={false}
            />
          </div>
          {textHashes && (
            <div className="flex flex-col gap-1.5">
              {HASH_LABELS.map(({ key, label, color }) => (
                <CopyableHash key={key} label={label} value={textHashes[key]} colorClass={color} />
              ))}
            </div>
          )}
        </>
      )}

      {mode === "file" && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              "flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all",
              dragging ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700 hover:border-indigo-500/60 hover:bg-indigo-500/5"
            )}
          >
            <Upload size={26} className="text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              Drag & drop a file, or <span className="text-indigo-400">browse</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) hashFile(f); }}
            />
          </div>

          {hashing && <p className="text-sm text-[var(--text-muted)]">Hashing {fileName}…</p>}

          {fileHashes && !hashing && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-[var(--text-secondary)] font-medium">{fileName}</p>
              {HASH_LABELS.map(({ key, label, color }) => (
                <CopyableHash key={key} label={label} value={fileHashes[key]} colorClass={color} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
