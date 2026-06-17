"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  highlight: (value: string) => string;
  placeholder?: string;
  readOnly?: boolean;
  errorLine?: number;
  rightGutter?: ReactNode;
}

/**
 * Line-numbered code editor. Uses the classic transparent-textarea-over-highlighted-pre
 * overlay so the input keeps native caret/selection/IME behavior while still showing
 * syntax-highlighted text underneath. The gutter scrolls in lockstep via a shared ref.
 */
export function CodeEditor({
  value,
  onChange,
  highlight,
  placeholder,
  readOnly = false,
  errorLine,
}: CodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = value ? value.split("\n").length : 1;

  const syncScroll = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  return (
    <div className="relative flex h-full min-h-0 font-code text-[13px] leading-[1.6]">
      {/* Line numbers */}
      <div
        ref={gutterRef}
        className="select-none overflow-hidden text-right text-slate-600 bg-slate-900/60 px-2 py-3 shrink-0"
        style={{ minWidth: `${String(lineCount).length + 2}ch` }}
        aria-hidden
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className={
              errorLine === i + 1
                ? "text-red-400 font-semibold"
                : undefined
            }
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code area: highlighted <pre> behind a transparent <textarea> */}
      <div className="relative flex-1 min-w-0">
        <pre
          ref={preRef}
          className="absolute inset-0 m-0 overflow-auto whitespace-pre-wrap break-words px-3 py-3 pointer-events-none"
          dangerouslySetInnerHTML={{ __html: highlight(value) + "\n" }}
        />
        <textarea
          ref={taRef}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={syncScroll}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="absolute inset-0 w-full h-full resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent px-3 py-3 text-transparent caret-white outline-none placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
