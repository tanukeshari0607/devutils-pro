import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "DevUtils Pro terms of service — the rules and conditions for using our free developer tools.",
  alternates: { canonical: "https://devutilshub.vercel.app/terms" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service – DevUtils Pro",
  url: "https://devutilshub.vercel.app/terms",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>›</span>
        <span className="text-[var(--text-secondary)]">Terms of Service</span>
      </nav>

      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Terms of Service</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: June 16, 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using DevUtils Pro at <strong className="text-[var(--text-primary)]">devutilshub.vercel.app</strong>
            {" "}(the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do
            not agree, please do not use the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            DevUtils Pro provides free, browser-based developer utilities including but not
            limited to JSON formatting, Base64 encoding, regex testing, password generation,
            hash generation, and related text/data processing tools. All processing occurs
            client-side in your browser; we do not operate a backend that receives your tool
            input.
          </p>
        </Section>

        <Section title="3. Tools Provided 'As Is' — No Warranty">
          <p>
            The Service and all tools are provided <strong className="text-[var(--text-primary)]">&ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo;</strong> without warranties of any kind, whether express or implied,
            including but not limited to warranties of merchantability, fitness for a
            particular purpose, accuracy, or non-infringement. We do not guarantee that any
            tool will be error-free, uninterrupted, secure, or that its output will be
            accurate or suitable for any particular purpose, including production,
            cryptographic, or legal use.
          </p>
        </Section>

        <Section title="4. No Liability for Tool Output or Errors">
          <p>
            You use every tool entirely at your own risk. To the maximum extent permitted by
            law, DevUtils Pro and its operators shall not be liable for any direct, indirect,
            incidental, special, consequential, or punitive damages — including but not limited
            to data loss, lost profits, or business interruption — arising from or related to
            your use of, or inability to use, the Service, or from any error, bug, or
            inaccuracy in any tool&apos;s output. You are solely responsible for validating any
            output before relying on it.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree that you will not use DevUtils Pro to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Violate any applicable local, state, national, or international law or regulation</li>
            <li>Generate, decode, or process data in furtherance of fraud, hacking, or any illegal or malicious activity</li>
            <li>Attempt to overload, disrupt, reverse-engineer, or gain unauthorized access to our infrastructure</li>
            <li>Scrape, copy, or redistribute the site or its tools for commercial purposes without permission</li>
            <li>Process data that you do not have the legal right to access or process</li>
          </ul>
          <p className="mt-2">
            We reserve the right to restrict access to the Service for anyone found to be using
            it for illegal or abusive purposes.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The DevUtils Pro name, logo, branding, and website design are the intellectual
            property of DevUtils Pro. The underlying open-source libraries used to power
            individual tools remain subject to their own respective licenses. You may not
            reproduce, duplicate, or resell any part of the Service without prior written
            permission, except as permitted by an applicable open-source license.
          </p>
        </Section>

        <Section title="7. Changes to These Terms">
          <p>
            We reserve the right to modify these Terms at any time, at our sole discretion.
            Material changes will be reflected by updating the &ldquo;Last updated&rdquo; date above.
            Continued use of the Service after changes are posted constitutes acceptance of the
            revised Terms.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Questions about these Terms? Email{" "}
            <a href="mailto:contact@devutilshub.vercel.app" className="text-indigo-400 hover:underline font-code">
              contact@devutilshub.vercel.app
            </a>{" "}
            or use our <Link href="/contact" className="text-indigo-400 hover:underline">contact form</Link>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h2>
      {children}
    </section>
  );
}
