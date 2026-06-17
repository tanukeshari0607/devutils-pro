"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Trash2, Download } from "lucide-react";
import { clsx } from "clsx";
import { html_beautify as beautifyHtml } from "js-beautify";
import { copyToClipboard } from "@/lib/toast";

type Action = "format" | "minify";

function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, "")
    .trim();
}

export function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [action, setAction] = useState<Action>("format");
  const [copied, setCopied] = useState(false);

  const run = useCallback((value: string, act: Action) => {
    if (!value.trim()) { setOutput(""); return; }
    if (act === "format") {
      setOutput(
        beautifyHtml(value, {
          indent_size: 2,
          wrap_line_length: 0,
          preserve_newlines: true,
          max_preserve_newlines: 1,
        })
      );
    } else {
      setOutput(minifyHtml(value));
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

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const origSize = new TextEncoder().encode(input).length;
  const outSize = new TextEncoder().encode(output).length;

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-[var(--border)]">
          <button
            onClick={() => handleAction("format")}
            className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              action === "format" ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            Format
          </button>
          <button
            onClick={() => handleAction("minify")}
            className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              action === "minify" ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            Minify
          </button>
        </div>
        {output && (
          <span className="text-xs text-[var(--text-muted)] font-code ml-auto">
            {origSize} B → {outSize} B
            {origSize > 0 && (
              <span className={outSize <= origSize ? "text-green-400" : "text-yellow-400"}>
                {" "}({Math.round((1 - outSize / origSize) * 100)}%)
              </span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--text-muted)]">Input HTML</label>
        <textarea
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="<div class='container'><p>Hello world</p></div>"
          className="textarea-code h-44 resize-y"
          spellCheck={false}
        />
      </div>

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
          <textarea readOnly value={output} className="textarea-code h-44 resize-y opacity-90" />
        </div>
      )}
    </div>
  );
}
