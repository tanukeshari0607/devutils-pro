import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Zap size={28} className="text-indigo-400" />
      </div>
      <div>
        <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-2">404</h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Page not found — this URL doesn&apos;t match any of our tools.
        </p>
      </div>
      <Link
        href="/"
        className="btn-primary"
      >
        ← Back to all tools
      </Link>
    </div>
  );
}
