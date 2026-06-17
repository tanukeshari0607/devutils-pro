"use client";

import { useState, useMemo } from "react";
import { Copy, Check, AlertTriangle, Clock } from "lucide-react";
import { copyToClipboard } from "@/lib/toast";

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  error?: string;
}

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

function decodeJwt(token: string): DecodedJwt | null {
  if (!token.trim()) return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { header: {}, payload: {}, signature: "", error: "Token must have 3 parts separated by dots (header.payload.signature)." };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch (e) {
    return { header: {}, payload: {}, signature: "", error: `Failed to decode token: ${String(e).replace(/^.*?Error:\s*/i, "")}` };
  }
}

function formatTimestamp(ts: unknown): string | null {
  if (typeof ts !== "number") return null;
  const date = new Date(ts * 1000);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZoneName: "short",
  });
}

function CopyableJson({ data, colorClass }: { data: Record<string, unknown>; colorClass: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const copy = async () => {
    await copyToClipboard(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors z-10">
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      <pre className={`rounded-lg border p-4 font-code text-xs overflow-auto max-h-56 ${colorClass}`}>
        {json}
      </pre>
    </div>
  );
}

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzUyMzkwMjJ9.dQw4w9WgXcQ-rDlsmIQ_example_signature";

export function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => decodeJwt(token), [token]);

  const exp = decoded?.payload?.exp;
  const iat = decoded?.payload?.iat;
  const nbf = decoded?.payload?.nbf;
  const isExpired = typeof exp === "number" && Date.now() / 1000 > exp;

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-xs text-[var(--text-muted)]">JWT Token</label>
          <button
            onClick={() => setToken(SAMPLE_JWT)}
            className="text-xs text-indigo-400 hover:underline"
          >
            Use sample token
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste a JWT token here (eyJhbGc...)"
          className="textarea-code h-28 resize-y"
          spellCheck={false}
        />
      </div>

      {decoded?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          {decoded.error}
        </div>
      )}

      {decoded && !decoded.error && (
        <>
          {/* Expiry banner */}
          {typeof exp === "number" && (
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                isExpired
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-green-500/30 bg-green-500/10 text-green-400"
              }`}
            >
              <Clock size={15} className="shrink-0" />
              <span>
                {isExpired ? "Token expired on " : "Token expires on "}
                <strong>{formatTimestamp(exp)}</strong>
                {isExpired && " — this token is no longer valid."}
              </span>
            </div>
          )}

          {/* Three decoded sections */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-medium text-blue-400 mb-1.5">Header</p>
              <CopyableJson data={decoded.header} colorClass="border-blue-500/30 bg-blue-500/5 text-blue-200" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-400 mb-1.5">Payload</p>
              <CopyableJson data={decoded.payload} colorClass="border-green-500/30 bg-green-500/5 text-green-200" />
            </div>
            <div>
              <p className="text-xs font-medium text-red-400 mb-1.5">Signature</p>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 h-full">
                <p className="font-code text-xs text-red-200 break-all">{decoded.signature}</p>
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  Signature verification requires the secret/public key and is not performed client-side.
                </p>
              </div>
            </div>
          </div>

          {/* Claims summary */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {[
              { label: "Issued At (iat)", value: iat ? formatTimestamp(iat) : "—" },
              { label: "Expires At (exp)", value: exp ? formatTimestamp(exp) : "—" },
              { label: "Not Before (nbf)", value: nbf ? formatTimestamp(nbf) : "—" },
              { label: "Algorithm", value: String(decoded.header.alg ?? "—") },
              { label: "Type", value: String(decoded.header.typ ?? "—") },
              { label: "Subject", value: String(decoded.payload.sub ?? "—") },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[var(--text-muted)]">{label}</p>
                <p className="font-code text-[var(--text-primary)] mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
