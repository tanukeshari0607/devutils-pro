"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import CleanCSS from "clean-css";
import { css_beautify as beautifyCss } from "js-beautify";
import { clsx } from "clsx";
import { copyToClipboard } from "@/lib/toast";

type Action = "minify" | "format";

export function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [action, setAction] = useState<Action>("minify");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback((value: string, act: Action) => {
    setError("");
    if (!value.trim()) { setOutput(""); return; }
    if (act === "minify") {
      const result = new CleanCSS({}).minify(value);
      if (result.errors.length > 0) {
        setError(result.errors.join("; "));
        setOutput("");
      } else {
        setOutput(result.styles);
      }
    } else {
      setOutput(beautifyCss(value, { indent_size: 2 }));
    }
  }, []);

  const handleAction = (act: Action) => {
    setAction(act);
    run(input, act);
  };

  const handleInput = (v: string) => {
    setInput(v);
    run(v, action);
  };

  const copy = async () => {
    if (!output) return;
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => { setInput(""); setOutput(""); setError(""); };

  const origSize = new TextEncoder().encode(input).length;
  const outSize = new TextEncoder().encode(output).length;
  const reduction = origSize > 0 ? Math.round((1 - outSize / origSize) * 100) : 0;

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-[var(--border)]">
          <button
            onClick={() => handleAction("minify")}
            className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              action === "minify" ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            Minify
          </button>
          <button
            onClick={() => handleAction("format")}
            className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              action === "format" ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            Format
          </button>
        </div>
        {output && action === "minify" && (
          <span className="text-xs font-code ml-auto">
            <span className="text-[var(--text-muted)]">{origSize} B → {outSize} B</span>{" "}
            <span className={reduction >= 0 ? "text-green-400" : "text-yellow-400"}>({reduction}% smaller)</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--text-muted)]">Input CSS</label>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={".container {\n  display: flex;\n  padding: 1rem;\n}"}
          className="textarea-code h-64 resize-y"
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
              <button onClick={clear} className="btn-secondary py-1 text-xs">
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>
          <textarea readOnly value={output} className="textarea-code h-64 resize-y opacity-90" />
        </div>
      )}
    </div>
  );
}
