"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS: { keys: string; description: string }[] = [
  { keys: "?", description: "Open this keyboard shortcuts panel" },
  { keys: "Esc", description: "Close this panel / any open modal" },
  { keys: "Ctrl + Enter", description: "Format input (JSON Formatter, and similar tools)" },
  { keys: "Ctrl + K", description: "Focus the search bar" },
];

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !isTypingTarget(e.target)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg-main)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Keyboard size={17} className="text-indigo-400" />
            <h2 className="font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {SHORTCUTS.map(({ keys, description }) => (
            <div key={keys} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-[var(--text-secondary)]">{description}</span>
              <kbd className="px-2 py-1 rounded-md bg-slate-800 text-slate-200 font-code text-xs border border-slate-700 shrink-0 ml-3">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-[var(--bg-subtle)] text-xs text-[var(--text-muted)]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-code border border-slate-700">?</kbd> anytime to toggle this panel.
        </div>
      </div>
    </div>
  );
}
