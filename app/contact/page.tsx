import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Bug, Lightbulb } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the DevUtils Pro team — report bugs, suggest tools, or ask questions.",
  alternates: { canonical: "https://devutilspro.com/contact" },
  openGraph: {
    title: "Contact DevUtils Pro",
    description: "Get in touch with the DevUtils Pro team.",
    url: "https://devutilspro.com/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact DevUtils Pro",
  url: "https://devutilspro.com/contact",
  description: "Contact page for DevUtils Pro developer tools.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>›</span>
        <span className="text-[var(--text-secondary)]">Contact</span>
      </nav>

      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Contact Us</h1>
      <p className="text-[var(--text-secondary)] mb-3">
        We&apos;d love to hear from you. Pick the most relevant option below, or email us directly.
      </p>
      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
        <a href="mailto:contact@devutilspro.com" className="flex items-center gap-1.5 text-indigo-400 hover:underline font-code">
          <Mail size={15} /> contact@devutilspro.com
        </a>
        <span className="text-[var(--text-muted)]">
          Response time: <strong className="text-[var(--text-secondary)]">1–2 business days</strong>
        </span>
      </div>

      {/* Contact reason cards */}
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {[
          {
            icon: <Bug size={18} className="text-red-400" />,
            title: "Report a Bug",
            desc: "Found something broken? Let us know so we can fix it.",
          },
          {
            icon: <Lightbulb size={18} className="text-yellow-400" />,
            title: "Suggest a Tool",
            desc: "Think a useful tool is missing? We want to know.",
          },
          {
            icon: <MessageSquare size={18} className="text-blue-400" />,
            title: "General Feedback",
            desc: "Tell us what you like or what we can improve.",
          },
          {
            icon: <Mail size={18} className="text-green-400" />,
            title: "Business Enquiry",
            desc: "Advertising, partnerships, or other business matters.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4 flex gap-3"
          >
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
              <p className="font-medium text-[var(--text-primary)] text-sm">{title}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Send a Message</h2>
        <ContactForm />
      </div>
    </div>
  );
}
