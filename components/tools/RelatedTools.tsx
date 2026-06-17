import Link from "next/link";
import { getRelatedTools } from "@/lib/tools";
import { ArrowRight } from "lucide-react";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
        Related Tools
      </h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-3 hover:border-indigo-500/50 transition-colors"
          >
            <span className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-code text-xs text-indigo-400 shrink-0">
              {tool.icon}
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors truncate">
              {tool.name}
            </span>
            <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </section>
  );
}
