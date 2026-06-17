"use client";

import { useState, useEffect, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/toast";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Australia/Sydney",
];

function formatInTimezone(date: Date, tz: string) {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      weekday: "short",
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    return date.toString();
  }
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-slate-950 px-3 py-2.5">
      <span className="text-xs text-[var(--text-muted)] w-32 shrink-0">{label}</span>
      <span className="flex-1 font-code text-sm text-slate-200 truncate">{value}</span>
      <button onClick={copy} className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0">
        {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now());
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tz, setTz] = useState("UTC");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const tsResult = useMemo(() => {
    if (!tsInput.trim()) return null;
    const raw = tsInput.trim();
    const num = Number(raw);
    if (isNaN(num)) return { error: "Not a valid number" };
    // Heuristic: 10-digit = seconds, 13-digit = ms
    const ms = raw.length >= 13 ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return { error: "Invalid timestamp" };
    return {
      iso: date.toISOString(),
      local: date.toString(),
      tzFormatted: formatInTimezone(date, tz),
      relative: relativeTime(date),
      unixSeconds: Math.floor(ms / 1000).toString(),
      unixMs: ms.toString(),
    };
  }, [tsInput, tz]);

  const dateResult = useMemo(() => {
    if (!dateInput.trim()) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return { error: "Invalid date format" };
    return {
      unixSeconds: Math.floor(date.getTime() / 1000).toString(),
      unixMs: date.getTime().toString(),
      iso: date.toISOString(),
      tzFormatted: formatInTimezone(date, tz),
    };
  }, [dateInput, tz]);

  function relativeTime(date: Date): string {
    const diffMs = date.getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const abs = Math.abs(diffSec);
    const units: [number, string][] = [
      [60, "second"], [60, "minute"], [24, "hour"], [30, "day"], [12, "month"], [Infinity, "year"],
    ];
    let value = abs, unit = "second";
    for (const [size, name] of units) {
      if (value < size) { unit = name; break; }
      value = Math.floor(value / size);
      unit = name;
    }
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return rtf.format(diffSec < 0 ? -value : value, unit as Intl.RelativeTimeFormatUnit);
  }

  const nowDate = new Date(now);

  return (
    <div className="p-5 flex flex-col gap-6">
      {/* Live current timestamp */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-xs text-indigo-400 mb-1">Current Unix Timestamp (live)</p>
          <p className="font-code text-2xl text-[var(--text-primary)]">{Math.floor(now / 1000)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-muted)] mb-1">{tz}</p>
          <p className="font-code text-sm text-[var(--text-secondary)]">{formatInTimezone(nowDate, tz)}</p>
        </div>
      </div>

      {/* Timezone selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-[var(--text-muted)]">Display timezone:</label>
        <select
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
        >
          {TIMEZONES.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Timestamp -> Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-muted)]">Unix Timestamp → Date</label>
          <input
            type="text"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="1735239022"
            className="textarea-code h-10 px-3 py-0 flex items-center"
            spellCheck={false}
          />
          {tsResult && "error" in tsResult && (
            <p className="text-xs text-red-400">{tsResult.error}</p>
          )}
          {tsResult && !("error" in tsResult) && (
            <div className="flex flex-col gap-1.5 mt-1">
              <CopyRow label="ISO 8601" value={tsResult.iso} />
              <CopyRow label="Local" value={tsResult.local} />
              <CopyRow label={tz} value={tsResult.tzFormatted} />
              <CopyRow label="Relative" value={tsResult.relative} />
            </div>
          )}
        </div>

        {/* Date -> Timestamp */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-muted)]">Date → Unix Timestamp</label>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="textarea-code h-10 px-3 py-0 flex items-center"
          />
          {dateResult && "error" in dateResult && (
            <p className="text-xs text-red-400">{dateResult.error}</p>
          )}
          {dateResult && !("error" in dateResult) && (
            <div className="flex flex-col gap-1.5 mt-1">
              <CopyRow label="Unix (seconds)" value={dateResult.unixSeconds} />
              <CopyRow label="Unix (ms)" value={dateResult.unixMs} />
              <CopyRow label="ISO 8601" value={dateResult.iso} />
              <CopyRow label={tz} value={dateResult.tzFormatted} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
