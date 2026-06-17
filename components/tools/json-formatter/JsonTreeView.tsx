"use client";

import { useState, useEffect, memo } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonTreeViewProps {
  data: JsonValue;
  searchTerm?: string;
  /** bumped to force all nodes open/closed */
  expandSignal: { expand: boolean; key: number };
}

function matches(text: string, term: string) {
  return term.length > 0 && text.toLowerCase().includes(term.toLowerCase());
}

function Highlighted({ text, term }: { text: string; term: string }) {
  if (!term || !matches(text, term)) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-400/40 text-amber-200 rounded-sm">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

function valueClass(v: JsonValue): string {
  if (typeof v === "string") return "text-green-300";
  if (typeof v === "number") return "text-amber-300";
  if (typeof v === "boolean") return "text-blue-300";
  if (v === null) return "text-slate-400";
  return "";
}

function formatPrimitive(v: JsonValue): string {
  if (typeof v === "string") return `"${v}"`;
  return String(v);
}

function nodeContainsTerm(value: JsonValue, term: string): boolean {
  if (!term) return false;
  if (value === null) return matches("null", term);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, JsonValue>).some(
      ([k, v]) => matches(k, term) || nodeContainsTerm(v, term)
    );
  }
  return matches(formatPrimitive(value), term);
}

const TreeNode = memo(function TreeNode({
  keyName,
  value,
  depth,
  searchTerm,
  expandSignal,
}: {
  keyName: string | null;
  value: JsonValue;
  depth: number;
  searchTerm: string;
  expandSignal: { expand: boolean; key: number };
}) {
  const isContainer = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const hasContent = isContainer && Object.keys(value as object).length > 0;
  const autoOpenForSearch = searchTerm.length > 0 && nodeContainsTerm(value, searchTerm);

  const [open, setOpen] = useState(depth < 1 || autoOpenForSearch);

  useEffect(() => {
    if (expandSignal.key > 0) setOpen(expandSignal.expand);
  }, [expandSignal]);

  useEffect(() => {
    if (autoOpenForSearch) setOpen(true);
  }, [autoOpenForSearch]);

  if (!isContainer) {
    return (
      <div className="flex gap-1.5 py-0.5" style={{ paddingLeft: depth * 16 }}>
        {keyName !== null && (
          <span className="text-indigo-300">
            <Highlighted text={`"${keyName}"`} term={searchTerm} />
            <span className="text-slate-500">: </span>
          </span>
        )}
        <span className={valueClass(value)}>
          <Highlighted text={formatPrimitive(value)} term={searchTerm} />
        </span>
      </div>
    );
  }

  const entries = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, JsonValue>);

  const bracketOpen = isArray ? "[" : "{";
  const bracketClose = isArray ? "]" : "}";

  return (
    <div>
      <div
        className="flex items-center gap-1 py-0.5 cursor-pointer hover:bg-white/5 rounded"
        style={{ paddingLeft: depth * 16 }}
        onClick={() => hasContent && setOpen((o) => !o)}
      >
        {hasContent ? (
          open ? (
            <ChevronDown size={12} className="text-slate-500 shrink-0" />
          ) : (
            <ChevronRight size={12} className="text-slate-500 shrink-0" />
          )
        ) : (
          <span className="w-3" />
        )}
        {keyName !== null && (
          <span className="text-indigo-300">
            <Highlighted text={`"${keyName}"`} term={searchTerm} />
            <span className="text-slate-500">: </span>
          </span>
        )}
        <span className="text-slate-500">
          {bracketOpen}
          {!open && hasContent && (
            <span className="text-slate-600 text-xs"> {entries.length} items </span>
          )}
          {!hasContent && bracketClose}
        </span>
      </div>
      {open && hasContent && (
        <>
          {entries.map(([k, v]) => (
            <TreeNode
              key={k}
              keyName={isArray ? null : k}
              value={v}
              depth={depth + 1}
              searchTerm={searchTerm}
              expandSignal={expandSignal}
            />
          ))}
          <div className="text-slate-500" style={{ paddingLeft: depth * 16 }}>
            {bracketClose}
          </div>
        </>
      )}
    </div>
  );
});

export function JsonTreeView({ data, searchTerm = "", expandSignal }: JsonTreeViewProps) {
  return (
    <div className="font-code text-[13px] leading-relaxed p-3 overflow-auto h-full">
      <TreeNode
        keyName={null}
        value={data}
        depth={0}
        searchTerm={searchTerm}
        expandSignal={expandSignal}
      />
    </div>
  );
}
