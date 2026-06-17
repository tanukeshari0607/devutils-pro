"use client";

import { useState, useRef } from "react";
import { Copy, Check, Upload, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

interface ImgData {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  base64: string;
}

function CopyBlock({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-[var(--text-muted)]">{label}</label>
        <button onClick={copy} className="btn-secondary py-1 text-xs">
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <textarea readOnly value={value} className="textarea-code h-24 resize-y text-xs opacity-90" />
    </div>
  );
}

export function ImageToBase64() {
  const [img, setImg] = useState<ImgData | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setError("Unsupported file type. Please use JPG, PNG, GIF, WebP, or SVG.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1] ?? "";
      setImg({ name: file.name, size: file.size, type: file.type, dataUrl, base64 });
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

  const clear = () => { setImg(null); setError(""); };

  const imgTag = img ? `<img src="${img.dataUrl}" alt="${img.name}" loading="lazy" />` : "";
  const cssBackground = img ? `background-image: url("${img.dataUrl}");` : "";

  return (
    <div className="p-5 flex flex-col gap-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          "flex flex-col items-center justify-center gap-3 h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all",
          dragging ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700 hover:border-indigo-500/60 hover:bg-indigo-500/5"
        )}
      >
        <Upload size={28} className="text-[var(--text-muted)]" />
        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Drag & drop an image, or <span className="text-indigo-400">browse</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG, GIF, WebP, SVG</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {img && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Preview */}
            <div className="shrink-0 rounded-lg border border-[var(--border)] bg-slate-950 p-3 flex items-center justify-center w-40 h-40 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.dataUrl} alt={img.name} loading="lazy" className="max-w-full max-h-full object-contain" />
            </div>

            {/* Metadata */}
            <div className="flex-1 flex flex-col gap-1.5">
              <p className="text-sm font-medium text-[var(--text-primary)]">{img.name}</p>
              <div className="flex gap-4 text-xs text-[var(--text-muted)] font-code">
                <span>Type: {img.type}</span>
                <span>Original: {formatBytes(img.size)}</span>
                <span>Base64: {formatBytes(img.base64.length)}</span>
                <span>Overhead: +{Math.round((img.base64.length / (img.size || 1) - 1) * 100)}%</span>
              </div>
              <button onClick={clear} className="btn-secondary text-xs py-1 w-fit mt-2">
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>

          <CopyBlock label="Base64 string" value={img.base64} />
          <CopyBlock label="<img> tag (ready to paste)" value={imgTag} />
          <CopyBlock label="CSS background-image" value={cssBackground} />
          <CopyBlock label="Full data URI" value={img.dataUrl} />
        </>
      )}
    </div>
  );
}
