import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, Globe, Code2, Mail, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About DevUtils Pro",
  description:
    "DevUtils Pro is a free, fast, browser-based collection of developer tools. All processing happens in your browser — no data is ever sent to a server.",
  alternates: { canonical: "https://devutilspro.com/about" },
  openGraph: {
    title: "About DevUtils Pro",
    description: "Free, fast, browser-based developer tools. Privacy first, no login required.",
    url: "https://devutilspro.com/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About DevUtils Pro",
  url: "https://devutilspro.com/about",
  description: "DevUtils Pro is a free, browser-based collection of developer tools.",
  publisher: { "@type": "Organization", name: "DevUtils Pro", url: "https://devutilspro.com" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>›</span>
        <span className="text-[var(--text-secondary)]">About</span>
      </nav>

      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">About DevUtils Pro</h1>
      <p className="text-lg text-[var(--text-secondary)] mb-10">
        DevUtils Pro is a free, fast, browser-based collection of developer tools.
        Every tool — from the JSON formatter to the hash generator — runs entirely
        on your device. Nothing you type, paste, or upload is ever sent to a server.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          {
            icon: <Zap size={20} className="text-indigo-400" />,
            title: "Fast & Free",
            desc: "Every tool runs entirely in your browser. No server round-trip means instant results, even offline once the page is loaded.",
          },
          {
            icon: <Shield size={20} className="text-green-400" />,
            title: "Privacy First",
            desc: "We never see your data. There is no backend processing your input — it's all JavaScript running locally on your machine.",
          },
          {
            icon: <Globe size={20} className="text-blue-400" />,
            title: "No Login Required",
            desc: "Open any tool and start using it immediately. No accounts, no email verification, no paywalls.",
          },
          {
            icon: <Code2 size={20} className="text-purple-400" />,
            title: "Built for Real Workflows",
            desc: "Designed for developers, designers, students, and anyone learning to code — not just specialists.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5"
          >
            <div className="mb-3">{icon}</div>
            <h2 className="font-semibold text-[var(--text-primary)] mb-1">{title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Why We Built This</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Most &ldquo;free&rdquo; online tools quietly cost you something: an account you didn&apos;t
          want, a clipboard full of ads, or — worse — your data passing through
          someone else&apos;s server before you ever see the result. We got tired of
          pasting API keys, JWT tokens, and customer data into random websites with
          no idea where that data actually went.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mt-3">
          DevUtils Pro exists to fix that. Every tool here — JSON formatting, Base64
          encoding, hash generation, regex testing, and the rest — runs as plain
          JavaScript in your own browser tab. We built the kind of tool we wanted to
          use ourselves: fast to open, free to use, and safe to paste sensitive data
          into, because it never leaves your device in the first place.
        </p>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={18} className="text-green-400" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Our Promise</h2>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--text-primary)]">All processing happens in your browser.</strong>{" "}
          We do not run a backend that receives, stores, or logs the text, files, or
          images you put into our tools. There is nothing to breach, sell, or
          subpoena, because we simply don&apos;t have it.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mt-3">
          That promise won&apos;t change as DevUtils Pro grows. If we ever add a feature
          that genuinely requires server-side processing, it will be clearly labeled
          as such and entirely optional — the core tools will always remain
          client-side and private. Read the full details in our{" "}
          <Link href="/privacy-policy" className="text-indigo-400 hover:underline">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Get in Touch</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Have a suggestion, found a bug, or want a new tool added? We&apos;d love to hear
          from you.
        </p>
        <p className="flex items-center gap-2 mt-3 text-[var(--text-secondary)]">
          <Mail size={15} className="text-indigo-400" />
          <a href="mailto:contact@devutilspro.com" className="text-indigo-400 hover:underline font-code text-sm">
            contact@devutilspro.com
          </a>
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Or use our <Link href="/contact" className="text-indigo-400 hover:underline">contact form</Link> instead.
        </p>
      </section>
    </div>
  );
}
