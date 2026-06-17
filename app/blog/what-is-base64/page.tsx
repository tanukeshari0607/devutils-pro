import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is Base64 Encoding? How It Works Explained",
  description:
    "Learn what Base64 encoding is, how the algorithm works, when to use it, and common use cases like data URIs, email attachments, and API payloads.",
  keywords: ["base64", "what is base64", "base64 encoding", "base64 tutorial", "encode decode"],
  alternates: { canonical: "https://devutilshub.vercel.app/blog/what-is-base64" },
  openGraph: {
    title: "What is Base64 Encoding? How It Works Explained",
    description: "Learn what Base64 encoding is, how it works, and when to use it.",
    url: "https://devutilshub.vercel.app/blog/what-is-base64",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What is Base64 Encoding? How It Works Explained",
  description:
    "Learn what Base64 encoding is, how the algorithm works, when to use it, and common use cases.",
  url: "https://devutilshub.vercel.app/blog/what-is-base64",
  author: { "@type": "Organization", name: "DevUtils Pro" },
  publisher: {
    "@type": "Organization",
    name: "DevUtils Pro",
    url: "https://devutilshub.vercel.app",
  },
};

export default function WhatIsBase64Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>›</span>
        <Link href="/blog/what-is-base64" className="text-[var(--text-secondary)]">What is Base64?</Link>
      </nav>

      <article>
        <header className="mb-8">
          <span className="inline-block px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-3">
            Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
            What is Base64 Encoding?
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Base64 is an encoding scheme that converts binary data into a sequence of
            printable ASCII characters. It is widely used in data URIs, email
            attachments, JWT tokens, and API payloads.
          </p>
        </header>

        <Section title="Why Base64 Was Invented">
          <p>
            Early email protocols (and many other text-based systems) were built to carry
            7-bit ASCII text — not raw binary. Sending a binary file like an image straight
            through one of these channels could corrupt it, since bytes above the 7-bit range
            might get stripped, misinterpreted, or mangled by intermediate servers. Base64 was
            invented as a workaround: it re-encodes any binary data using only 64 universally
            safe, printable ASCII characters, so it can travel through systems that only
            understand plain text.
          </p>
        </Section>

        <Section title="The Core Idea">
          <p>
            Binary data (like images or files) cannot always be safely transmitted as
            raw bytes through text-based channels like email or JSON. Base64 solves
            this by mapping every 3 bytes (24 bits) of binary data into 4 printable
            ASCII characters chosen from a 64-character alphabet.
          </p>
          <p className="mt-3">
            The 64-character alphabet consists of:
            <code className="font-code text-indigo-400 ml-2">
              A–Z, a–z, 0–9, +, /
            </code>{" "}
            with <code className="font-code text-indigo-400">=</code> used for padding.
          </p>
        </Section>

        <Section title="How the Algorithm Works">
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-secondary)]">
            <li>Take 3 bytes (24 bits) of binary input</li>
            <li>Split into 4 groups of 6 bits each</li>
            <li>Map each 6-bit value (0–63) to the Base64 alphabet</li>
            <li>If the input is not divisible by 3, pad with <code className="font-code text-indigo-400">=</code></li>
          </ol>
          <div className="mt-4 rounded-xl bg-slate-950 border border-[var(--border)] p-5 font-code text-sm">
            <p className="text-slate-400 mb-2"># Encoding &quot;Hi&quot; (2 bytes → padded to 3)</p>
            <p className="text-green-400">H      → 72  → 01001000</p>
            <p className="text-green-400">i      → 105 → 01101001</p>
            <p className="text-yellow-400 mt-2">Combined: 010010000110100100</p>
            <p className="text-indigo-400 mt-2">Base64: SGk=</p>
          </div>
        </Section>

        <Section title="Base64 in Practice">
          <div className="space-y-3">
            {[
              {
                title: "Data URIs",
                desc: "Embed images directly in HTML/CSS without external file requests.",
                example: 'src="data:image/png;base64,iVBORw0KGgo..."',
              },
              {
                title: "JSON Payloads",
                desc: "Send binary data (like file contents) inside a JSON string field.",
                example: '{ "file": "SGVsbG8gV29ybGQ=" }',
              },
              {
                title: "JWT Tokens",
                desc: "JWT header and payload are Base64URL-encoded (URL-safe variant).",
                example: "eyJhbGciOiJIUzI1NiJ9.eyJ...",
              },
              {
                title: "Email Attachments",
                desc: "MIME encodes binary attachments in Base64 for transport.",
                example: "Content-Transfer-Encoding: base64",
              },
              {
                title: "Images in CSS",
                desc: "Small icons or background images can be inlined directly in a stylesheet, avoiding an extra HTTP request.",
                example: ".icon { background: url(data:image/png;base64,iVBORw0...); }",
              },
            ].map(({ title, desc, example }) => (
              <div
                key={title}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4"
              >
                <p className="font-semibold text-[var(--text-primary)] mb-1">{title}</p>
                <p className="text-sm text-[var(--text-secondary)] mb-2">{desc}</p>
                <code className="font-code text-xs text-indigo-400 break-all">{example}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Common Misconception: Base64 Is Not Encryption">
          <p>
            This is the single most important thing to understand about Base64:{" "}
            <strong className="text-red-400">it is encoding, not encryption.</strong> Encoding
            is reversible by anyone, instantly, with no key or password required — it simply
            represents the same data in a different character set. Encrypting data requires a
            secret key and is designed to be computationally infeasible to reverse without it.
          </p>
          <p className="mt-3">
            Anyone can decode a Base64 string in one line of code or by pasting it into a tool
            like ours. If you Base64-encode a password or API key thinking it&apos;s &ldquo;hidden,&rdquo;
            it is not — it&apos;s in plain sight to anyone who decodes it. Base64 should only be
            used for safe transport of data, never to protect secrets. For that, use real
            encryption (like AES) or hashing (like SHA-256) instead.
          </p>
        </Section>

        <Section title="Base64 vs Base64URL">
          <p>
            Standard Base64 uses <code className="font-code text-indigo-400">+</code> and{" "}
            <code className="font-code text-indigo-400">/</code>, which are unsafe in
            URLs. <strong>Base64URL</strong> replaces them with{" "}
            <code className="font-code text-indigo-400">-</code> and{" "}
            <code className="font-code text-indigo-400">_</code> and omits padding —
            used in JWT, OAuth, and URL-safe contexts.
          </p>
        </Section>

        <Section title="Size Overhead">
          <p>
            Base64 encoding increases data size by approximately{" "}
            <strong className="text-indigo-400">33%</strong> — 3 bytes become 4
            characters. For large files (images, videos) this overhead is significant,
            which is why Base64 is best suited for small payloads or cases where
            binary transport is impossible.
          </p>
        </Section>

        <div className="mt-8 p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
          <p className="text-[var(--text-secondary)] text-sm">
            Need to encode or decode Base64 now?{" "}
            <Link
              href="/tools/base64-encoder"
              className="text-indigo-400 hover:underline font-medium"
            >
              Try our free Base64 Encoder/Decoder →
            </Link>
          </p>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{title}</h2>
      <div className="text-[var(--text-secondary)] leading-relaxed">{children}</div>
    </section>
  );
}
