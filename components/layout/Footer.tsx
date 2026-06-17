import Link from "next/link";
import { Mail, Rss, Globe, Zap } from "lucide-react";
import { CATEGORIES } from "@/lib/tools";

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const RESOURCE_LINKS = [
  { href: "/blog/what-is-json", label: "What is JSON?" },
  { href: "/blog/what-is-base64", label: "What is Base64?" },
];

const POPULAR_TOOL_LINKS = [
  { href: "/tools/json-formatter", label: "JSON Formatter" },
  { href: "/tools/jwt-decoder", label: "JWT Decoder" },
  { href: "/tools/regex-tester", label: "Regex Tester" },
  { href: "/tools/uuid-generator", label: "UUID Generator" },
];

// Plain icons — lucide-react dropped brand/logo glyphs (GitHub, Twitter, etc.)
// in this version; swap in actual brand icons (e.g. simple-icons) when real
// social profiles exist.
const SOCIAL_LINKS = [
  { href: "mailto:contact@devutilspro.com", label: "Email", icon: Mail },
  { href: "/blog/what-is-json", label: "Blog", icon: Rss },
  { href: "https://devutilspro.com", label: "Website", icon: Globe },
];

// Footer doubles as the site's internal-linking hub: every tool/category/
// resource page is reachable from here without depending on a persistent
// sidebar, which keeps tool pages focused while still aiding SEO crawl depth.
export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-semibold text-[var(--text-primary)]">
                DevUtils <span className="text-indigo-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Fast, free, privacy-friendly developer tools. Everything runs in your browser.
            </p>
          </div>

          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
          <FooterColumn title="Popular Tools" links={POPULAR_TOOL_LINKS} />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Categories
            </p>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="text-sm text-[var(--text-secondary)] hover:text-indigo-400 transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} DevUtils Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-indigo-400 hover:bg-[var(--bg-main)] transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-indigo-400 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
