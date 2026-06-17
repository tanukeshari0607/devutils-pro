"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-8">
        <CheckCircle2 size={36} className="text-green-400" />
        <p className="text-lg font-semibold text-[var(--text-primary)]">
          Thanks{name ? `, ${name}` : ""}! We&apos;ll get back to you.
        </p>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">
          Your message has been noted. We typically respond within{" "}
          <strong className="text-[var(--text-primary)]">1–2 business days</strong>.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-secondary text-xs py-1.5 mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          Subject
        </label>
        <select className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all">
          <option value="">Select a topic…</option>
          <option value="bug">Bug Report</option>
          <option value="suggestion">Tool Suggestion</option>
          <option value="feedback">General Feedback</option>
          <option value="business">Business Enquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          Message
        </label>
        <textarea
          required
          rows={5}
          placeholder="Describe your request…"
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
        />
      </div>

      <button type="submit" className="btn-primary w-full justify-center py-2.5">
        <Mail size={15} />
        Send Message
      </button>
    </form>
  );
}
