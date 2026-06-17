"use client";

import type { Tool } from "@/lib/tools";
import { Wrench } from "lucide-react";

const TOOL_ICONS: Record<string, string> = {
  "json-formatter": "{ }",
  "html-formatter": "</>",
  "sql-formatter": "⊢",
  "css-minifier": "#",
  "base64-encoder": "64",
  "url-encoder": "%",
  "jwt-decoder": "🔑",
  "password-generator": "🔒",
  "hash-generator": "##",
  "timestamp-converter": "⏱",
  "color-picker": "🎨",
  "image-to-base64": "🖼",
  "regex-tester": ".*",
  "diff-checker": "↔",
  "markdown-previewer": "M↓",
};

interface Props {
  tool: Tool;
}

export function ToolPlaceholder({ tool }: Props) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[340px] gap-5 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-code text-2xl text-indigo-400">
        {TOOL_ICONS[tool.slug] ?? <Wrench size={24} />}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
          {tool.name}
        </h2>
        <p className="text-[var(--text-secondary)] max-w-md text-sm">
          {tool.description}
        </p>
      </div>

      {/* Placeholder input area */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-main)] rounded-t-lg px-4 py-2 border border-[var(--border)] border-b-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-code">Input</span>
        </div>
        <textarea
          readOnly
          placeholder={`Paste your input here for ${tool.name}…`}
          className="textarea-code w-full h-32 rounded-t-none cursor-default"
        />
        <div className="flex justify-center gap-3 pt-1">
          <button className="btn-primary opacity-60 cursor-not-allowed" disabled>
            Process
          </button>
          <button className="btn-secondary opacity-60 cursor-not-allowed" disabled>
            Clear
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-main)] rounded-t-lg px-4 py-2 border border-[var(--border)] border-b-0 mt-4">
          <span className="font-code">Output</span>
        </div>
        <textarea
          readOnly
          placeholder="Output will appear here…"
          className="textarea-code w-full h-32 rounded-t-none cursor-default opacity-50"
        />
      </div>

      <p className="text-xs text-[var(--text-muted)] font-code bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-4 py-2">
        🚧 Full implementation coming soon — this is a placeholder UI
      </p>
    </div>
  );
}
