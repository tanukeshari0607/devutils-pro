"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDown, X } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { CATEGORY_ICONS } from "./TopNav";
import { Logo } from "./Logo";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-[var(--bg-main)] border-r border-[var(--border)] overflow-y-auto md:hidden">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-main)]">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Logo />
            <span className="font-semibold text-[var(--text-primary)]">
              DevUtils <span className="text-indigo-400">Pro</span>
            </span>
          </Link>
          <button onClick={onClose} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 text-sm">
          {CATEGORIES.map((category) => {
            const tools = TOOLS.filter((t) => t.category === category);
            const isOpen = openCategory === category;
            return (
              <div key={category}>
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-md text-[var(--text-primary)] font-medium active:bg-[var(--bg-subtle)]"
                >
                  <span className="flex items-center gap-2">
                    {CATEGORY_ICONS[category]}
                    {category}
                  </span>
                  <ChevronDown size={16} className={clsx("transition-transform text-[var(--text-muted)]", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="pl-4 pb-2 space-y-0.5">
                    {tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={onClose}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-[var(--text-secondary)] active:bg-[var(--bg-subtle)]",
                          pathname === `/tools/${tool.slug}` && "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10"
                        )}
                      >
                        <span className="font-code text-xs w-5 text-center opacity-70">{tool.icon}</span>
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="my-3 border-t border-[var(--border)]" />

          <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Resources
          </p>
          {[
            { href: "/blog/what-is-json", label: "What is JSON?" },
            { href: "/blog/what-is-base64", label: "What is Base64?" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="block px-3 py-2.5 rounded-md text-[var(--text-secondary)] active:bg-[var(--bg-subtle)]"
            >
              {label}
            </Link>
          ))}

          <div className="my-3 border-t border-[var(--border)]" />

          <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Company
          </p>
          {[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="block px-3 py-2.5 rounded-md text-[var(--text-secondary)] active:bg-[var(--bg-subtle)]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
