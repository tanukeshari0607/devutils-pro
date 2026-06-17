"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Trash2, Download } from "lucide-react";
import { format as formatSql } from "sql-formatter";
import { copyToClipboard } from "@/lib/toast";
import { clsx } from "clsx";

type Dialect = "mysql" | "postgresql" | "sqlite";

const DIALECTS: { value: Dialect; label: string }[] = [
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
];

function minifySql(sql: string): string {
  return sql.replace(/\s+/g, " ").replace(/\s*([,()])\s*/g, "$1").trim();
}

export function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("mysql");
  const [minified, setMinified] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback((value: string, d: Dialect, min: boolean) => {
    setError("");
    if (!value.trim()) { setOutput(""); return; }
    try {
      if (min) {
        setOutput(minifySql(value));
      } else {
        setOutput(formatSql(value, { language: d, keywordCase: "upper" }));
      }
    } catch (e) {
      setError(String(e).replace(/^.*?Error:\s*/i, ""));
      setOutput("");
    }
  }, []);

  const handleInput = (v: string) => { setInput(v); run(v, dialect, minified); };
  const handleDialect = (d: Dialect) => { setDialect(d); run(input, d, minified); };
  const toggleMinify = () => { const next = !minified; setMinified(next); run(input, dialect, next); };

  const copy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.sql";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => { setInput(""); setOutput(""); setError(""); };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--text-muted)]">Dialect:</span>
          {DIALECTS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleDialect(value)}
              className={clsx(
                "px-2.5 py-1 rounded text-xs font-medium border transition-colors",
                dialect === value
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-indigo-500"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={toggleMinify} className={clsx("btn-secondary text-xs py-1 ml-auto", minified && "bg-indigo-600 text-white border-indigo-600")}>
          {minified ? "Minified" : "Minify"}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--text-muted)]">Input SQL</label>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={"SELECT id, name FROM users WHERE active = 1 ORDER BY name;"}
          className="textarea-code h-40 resize-y"
          spellCheck={false}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {output && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Output</span>
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary py-1 text-xs">
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button onClick={download} className="btn-secondary py-1 text-xs">
                <Download size={12} /> Download
              </button>
              <button onClick={clear} className="btn-secondary py-1 text-xs">
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-slate-950 p-4 overflow-auto text-sm font-code text-slate-200 max-h-80 whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
