import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is JSON? A Complete Guide for Developers",
  description:
    "Learn what JSON (JavaScript Object Notation) is, how it works, its syntax rules, common use cases, and why it became the dominant data interchange format on the web.",
  keywords: ["json", "what is json", "json tutorial", "json format", "json syntax"],
  alternates: { canonical: "https://devutilspro.com/blog/what-is-json" },
  openGraph: {
    title: "What is JSON? A Complete Guide for Developers",
    description:
      "Learn what JSON is, how it works, its syntax, and why it's the web's dominant data format.",
    url: "https://devutilspro.com/blog/what-is-json",
    type: "article",
    images: [{ url: "https://devutilspro.com/og-image.png", width: 1200, height: 630 }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What is JSON? A Complete Guide for Developers",
  description:
    "Learn what JSON is, how it works, its syntax rules, common use cases, and why it became the dominant data interchange format on the web.",
  url: "https://devutilspro.com/blog/what-is-json",
  author: { "@type": "Organization", name: "DevUtils Pro" },
  publisher: {
    "@type": "Organization",
    name: "DevUtils Pro",
    url: "https://devutilspro.com",
  },
};

export default function WhatIsJsonPage() {
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
        <Link href="/blog/what-is-json" className="text-[var(--text-secondary)]">What is JSON?</Link>
      </nav>

      <article className="prose-custom">
        <header className="mb-8">
          <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-3">
            Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
            What is JSON? A Complete Guide for Developers
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            JSON (JavaScript Object Notation) is a lightweight, human-readable
            data-interchange format that has become the backbone of modern web APIs
            and configuration files.
          </p>
        </header>

        <Section title="What is JSON?">
          <p>
            JSON stands for <strong>JavaScript Object Notation</strong>. It was
            originally derived from the JavaScript programming language (specifically
            the object literal syntax), but it is completely language-independent —
            parsers exist for virtually every programming language.
          </p>
          <p className="mt-3">
            JSON was formalized by Douglas Crockford in the early 2000s and is now
            defined by{" "}
            <span className="font-code text-sm text-indigo-400">RFC 8259</span>.
          </p>
        </Section>

        <Section title="JSON Syntax Rules">
          <ul className="list-disc pl-6 space-y-1 text-[var(--text-secondary)]">
            <li>Data is in name/value pairs</li>
            <li>Data is separated by commas</li>
            <li>Curly braces hold objects <code className="font-code text-indigo-400">{"{}"}</code></li>
            <li>Square brackets hold arrays <code className="font-code text-indigo-400">{"[]"}</code></li>
            <li>Strings must use double quotes</li>
            <li>No trailing commas allowed</li>
            <li>No comments allowed in standard JSON</li>
          </ul>
        </Section>

        <Section title="JSON Data Types">
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: "string", example: '"Hello World"' },
              { type: "number", example: "42 / 3.14" },
              { type: "boolean", example: "true / false" },
              { type: "null", example: "null" },
              { type: "object", example: '{ "key": "value" }' },
              { type: "array", example: "[1, 2, 3]" },
            ].map(({ type, example }) => (
              <div
                key={type}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3"
              >
                <p className="font-code text-sm text-indigo-400">{type}</p>
                <p className="font-code text-xs text-[var(--text-muted)] mt-0.5">{example}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Example JSON">
          <pre className="rounded-xl bg-slate-950 border border-[var(--border)] p-5 overflow-x-auto font-code text-sm text-slate-200 leading-relaxed">
{`{
  "name": "Alice",
  "age": 30,
  "isAdmin": false,
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  },
  "tags": ["developer", "designer"],
  "profile": null
}`}
          </pre>
        </Section>

        <Section title="Why is JSON so Popular?">
          <ul className="list-disc pl-6 space-y-1 text-[var(--text-secondary)]">
            <li>Human-readable and easy to write</li>
            <li>Natively supported in all modern browsers via <code className="font-code text-indigo-400">JSON.parse()</code></li>
            <li>Compact compared to XML</li>
            <li>Language-agnostic — supported everywhere</li>
            <li>Used by all major REST APIs and databases</li>
          </ul>
        </Section>

        <Section title="Common Uses of JSON">
          <p>JSON shows up almost everywhere in modern software. The three most common places you&apos;ll encounter it:</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            {[
              {
                title: "APIs",
                desc: "REST and GraphQL APIs send and receive JSON as the standard request/response format between client and server.",
              },
              {
                title: "Config Files",
                desc: "package.json, tsconfig.json, and countless other tools store their configuration as JSON because it's easy to read and edit.",
              },
              {
                title: "Data Storage",
                desc: "NoSQL databases like MongoDB store documents natively as JSON-like objects (BSON), and many apps cache data as JSON locally.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                <p className="font-semibold text-[var(--text-primary)] mb-1 text-sm">{title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="JSON vs XML">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 text-[var(--text-secondary)]">Feature</th>
                  <th className="text-left py-2 px-3 text-indigo-400">JSON</th>
                  <th className="text-left py-2 px-3 text-[var(--text-secondary)]">XML</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-secondary)]">
                {[
                  ["Readability", "High", "Medium"],
                  ["Verbosity", "Low", "High"],
                  ["Native JS support", "Yes", "No"],
                  ["Comments", "No", "Yes"],
                  ["Schema support", "JSON Schema", "XSD/DTD"],
                ].map(([feat, json, xml]) => (
                  <tr key={feat} className="border-b border-[var(--border)]/50">
                    <td className="py-2 px-3 font-medium">{feat}</td>
                    <td className="py-2 px-3 text-green-400">{json}</td>
                    <td className="py-2 px-3">{xml}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <div className="mt-8 p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
          <p className="text-[var(--text-secondary)] text-sm">
            Ready to work with JSON?{" "}
            <Link
              href="/tools/json-formatter"
              className="text-indigo-400 hover:underline font-medium"
            >
              Try our free JSON Formatter →
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
