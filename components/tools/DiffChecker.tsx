"use client";

import { useState, useMemo } from "react";
import { clsx } from "clsx";
import { Columns2, AlignLeft, Trash2 } from "lucide-react";

// diff-match-patch exports the class as the default (module.exports = diff_match_patch)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const DiffMatchPatch = require("diff-match-patch") as new () => {
  diff_main: (a: string, b: string) => [number, string][];
  diff_cleanupSemantic: (d: [number, string][]) => void;
};

const DIFF_DELETE = -1;
const DIFF_INSERT = 1;

interface LineDiff {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNum?: number;
}

function buildLineDiffs(original: string, modified: string): LineDiff[] {
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(original, modified);
  dmp.diff_cleanupSemantic(diffs);

  // Reconstruct per-line results
  const lines: LineDiff[] = [];

  for (const [op, text] of diffs) {
    const parts = text.split("\n");
    for (let i = 0; i < parts.length; i++) {
      const content = parts[i];
      // Skip the empty string that appears after a trailing newline split
      if (i < parts.length - 1 || content !== "") {
        if (op === DIFF_DELETE) {
          lines.push({ type: "removed", content });
        } else if (op === DIFF_INSERT) {
          lines.push({ type: "added", content });
        } else {
          lines.push({ type: "unchanged", content });
        }
      }
    }
  }

  return lines;
}

function buildUnifiedDiff(original: string, modified: string) {
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(original, modified);
  dmp.diff_cleanupSemantic(diffs);

  // Build simple line-based view
  const result: { sign: "+" | "-" | " "; content: string }[] = [];
  for (const [op, text] of diffs) {
    const parts = text.split("\n");
    for (let i = 0; i < parts.length; i++) {
      if (i === parts.length - 1 && parts[i] === "") continue;
      const sign = op === DIFF_INSERT ? "+" : op === DIFF_DELETE ? "-" : " ";
      result.push({ sign, content: parts[i] });
    }
  }
  return result;
}

type ViewMode = "side" | "unified";

export function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [view, setView] = useState<ViewMode>("side");

  const { lineDiffs, unified, added, removed } = useMemo(() => {
    if (!original && !modified) return { lineDiffs: [], unified: [], added: 0, removed: 0 };
    const lineDiffs = buildLineDiffs(original, modified);
    const unified = buildUnifiedDiff(original, modified);
    const added = lineDiffs.filter((l) => l.type === "added").length;
    const removed = lineDiffs.filter((l) => l.type === "removed").length;
    return { lineDiffs, unified, added, removed };
  }, [original, modified]);

  const hasDiff = original || modified;

  const leftLines = lineDiffs.filter((l) => l.type !== "added");
  const rightLines = lineDiffs.filter((l) => l.type !== "removed");

  const LINE_CLASSES: Record<LineDiff["type"], string> = {
    added: "bg-green-500/10 border-l-2 border-green-500 text-green-200",
    removed: "bg-red-500/10 border-l-2 border-red-500 text-red-300",
    unchanged: "text-slate-400",
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-[var(--border)]">
          <button
            onClick={() => setView("side")}
            className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              view === "side" ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Columns2 size={13} /> Side by Side
          </button>
          <button
            onClick={() => setView("unified")}
            className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              view === "unified" ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <AlignLeft size={13} /> Unified
          </button>
        </div>
        {hasDiff && (
          <div className="flex gap-3 ml-2 text-xs font-code">
            <span className="text-green-400">+{added} added</span>
            <span className="text-red-400">−{removed} removed</span>
          </div>
        )}
        <button
          onClick={() => { setOriginal(""); setModified(""); }}
          className="btn-secondary text-xs py-1 ml-auto"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>

      {/* Input textareas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Original</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here…"
            className="textarea-code h-40 resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Modified</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here…"
            className="textarea-code h-40 resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Diff output */}
      {hasDiff && lineDiffs.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-[var(--border)] text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-subtle)]">
            {view === "side" ? (
              <>
                <div className="px-4 py-2 border-r border-[var(--border)]">Original</div>
                <div className="px-4 py-2">Modified</div>
              </>
            ) : (
              <div className="px-4 py-2 col-span-2">Unified diff</div>
            )}
          </div>

          {view === "side" ? (
            <div className="grid grid-cols-2 divide-x divide-[var(--border)] overflow-auto max-h-[28rem]">
              {/* Left (original) */}
              <div className="font-code text-xs">
                {leftLines.map((line, i) => (
                  <div key={i} className={clsx("flex gap-2 px-3 py-0.5 min-h-[1.5rem]", LINE_CLASSES[line.type])}>
                    <span className="select-none w-8 text-right text-slate-600 shrink-0">{i + 1}</span>
                    <span className="flex-1 whitespace-pre break-all">{line.content}</span>
                  </div>
                ))}
              </div>
              {/* Right (modified) */}
              <div className="font-code text-xs">
                {rightLines.map((line, i) => (
                  <div key={i} className={clsx("flex gap-2 px-3 py-0.5 min-h-[1.5rem]", LINE_CLASSES[line.type])}>
                    <span className="select-none w-8 text-right text-slate-600 shrink-0">{i + 1}</span>
                    <span className="flex-1 whitespace-pre break-all">{line.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="font-code text-xs overflow-auto max-h-[28rem]">
              {unified.map((line, i) => (
                <div
                  key={i}
                  className={clsx(
                    "flex gap-2 px-3 py-0.5 min-h-[1.5rem]",
                    line.sign === "+" && "bg-green-500/10 border-l-2 border-green-500 text-green-200",
                    line.sign === "-" && "bg-red-500/10 border-l-2 border-red-500 text-red-300",
                    line.sign === " " && "text-slate-400"
                  )}
                >
                  <span className={clsx("select-none w-4 shrink-0 font-bold",
                    line.sign === "+" ? "text-green-500" : line.sign === "-" ? "text-red-500" : "text-slate-600"
                  )}>
                    {line.sign === " " ? "" : line.sign}
                  </span>
                  <span className="flex-1 whitespace-pre break-all">{line.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasDiff && lineDiffs.length === 0 && (
        <div className="text-center py-6 text-sm text-green-400">
          ✓ No differences found — texts are identical.
        </div>
      )}
    </div>
  );
}
