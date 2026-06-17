"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Download } from "lucide-react";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

function generateUuid(): string {
  return crypto.randomUUID();
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateUuid));
  const [copied, setCopied] = useState(false);

  const format = useCallback(
    (id: string) => {
      let v = noHyphens ? id.replace(/-/g, "") : id;
      if (uppercase) v = v.toUpperCase();
      return v;
    },
    [uppercase, noHyphens]
  );

  const regenerate = useCallback(() => {
    setUuids(Array.from({ length: count }, generateUuid));
  }, [count]);

  const copyAll = async () => {
    await copyToClipboard(uuids.map(format).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([uuids.map(format).join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          Count:
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
            className="w-20 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2 py-1 text-sm outline-none focus:border-indigo-500"
          />
        </label>
        <label className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-indigo-500" />
          Uppercase
        </label>
        <label className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={noHyphens} onChange={(e) => setNoHyphens(e.target.checked)} className="accent-indigo-500" />
          No hyphens
        </label>
        <button onClick={regenerate} className="btn-primary ml-auto">
          <RefreshCw size={14} /> Generate
        </button>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-slate-900 max-h-96 overflow-auto">
        {uuids.map((id, i) => (
          <div
            key={i}
            className={clsx(
              "px-4 py-2 font-code text-sm text-green-300",
              i % 2 === 0 ? "bg-white/[0.02]" : ""
            )}
          >
            {format(id)}
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={copyAll} className="btn-secondary text-xs py-1.5">
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy All</>}
        </button>
        <button onClick={download} className="btn-secondary text-xs py-1.5">
          <Download size={12} /> Download .txt
        </button>
      </div>
    </div>
  );
}
