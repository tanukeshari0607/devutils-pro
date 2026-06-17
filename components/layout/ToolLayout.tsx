import type { Tool } from "@/lib/tools";
import { AdSlot } from "@/components/ads/AdSlot";
import { UsageTracker } from "@/components/tools/UsageTracker";
import { ShareButton } from "@/components/tools/ShareButton";
import { FavoriteButton } from "@/components/tools/FavoriteButton";
import { RelatedTools } from "@/components/tools/RelatedTools";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

const BASE_URL = "https://devutilspro.com";

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/tools/${tool.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: BASE_URL },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${BASE_URL}/tools/${tool.slug}` },
    ],
  };

  const faqLd = tool.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* Tracks tool opens for the homepage usage counter / recently-used list */}
      <UsageTracker slug={tool.slug} />

      {/* Breadcrumb + title — kept compact so the tool itself appears with
          no scrolling on first load, per the "tool is the hero" requirement. */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-2">
        <a href="/" className="hover:text-indigo-400 transition-colors">Home</a>
        <span>›</span>
        <a href="/" className="hover:text-indigo-400 transition-colors">Tools</a>
        <span>›</span>
        <span className="text-[var(--text-secondary)]">{tool.name}</span>
      </div>

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{tool.name}</h1>
          <p className="mt-1 text-[var(--text-secondary)]">{tool.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FavoriteButton slug={tool.slug} />
          <ShareButton toolName={tool.name} />
        </div>
      </div>

      {/* Tool interface — full width, no ads competing for space here */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] overflow-hidden">
        {children}
      </div>

      {/* Mid-content ad — placed below the tool, never above or beside it */}
      <div className="mt-6 flex justify-center">
        <AdSlot id="ad-mid" width={336} height={280} />
      </div>

      <RelatedTools slug={tool.slug} />

      {/* SEO "What is X?" section */}
      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
          What is {tool.name}?
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {tool.longDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.keywords.map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-code"
            >
              {kw}
            </span>
          ))}
        </div>
      </section>

      {tool.whyUseIt && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            Why use {tool.name}?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">{tool.whyUseIt}</p>
        </section>
      )}

      {tool.useCases && tool.useCases.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Common use cases</h2>
          <ul className="space-y-2">
            {tool.useCases.map((uc, i) => (
              <li key={i} className="flex gap-2 text-[var(--text-secondary)] leading-relaxed">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tool.examples && tool.examples.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Examples</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tool.examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] overflow-hidden">
                <p className="px-3 py-2 text-xs font-medium text-[var(--text-muted)] bg-black/20">{ex.title}</p>
                <pre className="px-3 py-2 text-xs font-code text-[var(--text-secondary)] overflow-x-auto whitespace-pre-wrap">
                  {ex.input}
                </pre>
                <div className="px-3 py-1 text-xs text-indigo-400 border-t border-[var(--border)]">↓</div>
                <pre className="px-3 py-2 text-xs font-code text-green-400 overflow-x-auto whitespace-pre-wrap">
                  {ex.output}
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {tool.faqs && tool.faqs.length > 0 && (
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <div key={i}>
                <p className="font-medium text-[var(--text-primary)]">{faq.question}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
