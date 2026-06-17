import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DevUtils Pro privacy policy — how we handle data, cookies, Google Analytics, AdSense, and your privacy rights.",
  alternates: { canonical: "https://devutilspro.com/privacy-policy" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy – DevUtils Pro",
  url: "https://devutilspro.com/privacy-policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-indigo-400">Home</Link>
        <span>›</span>
        <span className="text-[var(--text-secondary)]">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Privacy Policy</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: June 16, 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <Section title="1. Overview">
          <p>
            DevUtils Pro (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website at{" "}
            <strong className="text-[var(--text-primary)]">devutilspro.com</strong>. This policy
            explains what information is collected when you visit, how it is used, and the
            choices available to you.
          </p>
          <p className="mt-3 text-green-400 font-medium">
            The short version: the text, files, and data you put into our tools never leave
            your browser. We do not run a server that processes or stores your tool input.
          </p>
        </Section>

        <Section title="2. Tool Data Is Never Sent to a Server">
          <p>
            Every tool on DevUtils Pro — JSON formatting, Base64 encoding, hash generation,
            regex testing, and all others — runs entirely as client-side JavaScript in your
            browser. We do not have a backend that receives, logs, or stores the content you
            paste, type, or upload into any tool. There is no database of user input because
            none is ever transmitted to us.
          </p>
        </Section>

        <Section title="3. Information Collected Automatically">
          <p>We use the following third-party services, which may collect limited technical data:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong className="text-[var(--text-primary)]">Google Analytics</strong> — collects
              anonymized usage data such as pages visited, time on page, approximate location
              (city/country level), browser type, and device type. This data is aggregated and
              is not used to personally identify you.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Google AdSense</strong> — we may
              display advertisements served by Google AdSense to support the site. Google and
              its partners use cookies (including the DoubleClick cookie) to serve ads based on
              your prior visits to this and other websites.
            </li>
          </ul>
        </Section>

        <Section title="4. How Google AdSense Uses Cookies">
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s
            prior visits to this website or other websites. Google&apos;s use of advertising
            cookies enables it and its partners to serve ads based on your visits to this site
            and/or other sites on the Internet.
          </p>
          <p className="mt-3">You can opt out of personalized advertising by visiting:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Google Ads Settings
              </a>{" "}
              — manage or opt out of personalized ads from Google
            </li>
            <li>
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                www.aboutads.info/choices
              </a>{" "}
              — opt out of interest-based advertising from participating companies
            </li>
            <li>
              <a
                href="https://www.networkadvertising.org/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Network Advertising Initiative
              </a>{" "}
              — opt-out tool covering multiple ad networks
            </li>
          </ul>
        </Section>

        <Section title="5. Cookies We Use">
          <p>
            Beyond the third-party advertising and analytics cookies described above, we use a
            single first-party cookie/local storage entry to remember your dark or light mode
            preference and, on the Color Picker tool, your recently used colors. Neither is used
            for tracking or advertising.
          </p>
        </Section>

        <Section title="6. Third-Party Links Disclaimer">
          <p>
            Our site may link to external tools, documentation, or resources we don&apos;t control.
            We are not responsible for the content, accuracy, or privacy practices of any
            third-party website. We encourage you to review the privacy policy of any site you
            visit after leaving devutilspro.com.
          </p>
        </Section>

        <Section title="7. Children's Privacy (COPPA)">
          <p>
            DevUtils Pro is not directed at children under the age of 13, and we do not
            knowingly collect personal information from children under 13. If you believe a
            child has provided us with personal information, please contact us and we will take
            steps to delete it. Because our tools process data entirely in the browser, we do
            not knowingly retain any data from any user, including children.
          </p>
        </Section>

        <Section title="8. Data Security">
          <p>
            Since tool input is never transmitted to or stored on our servers, the primary
            security consideration is your own device and browser. We recommend keeping your
            browser up to date and using devices you trust when working with sensitive data,
            even though that data stays local to your machine.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this policy from time to time to reflect changes in our practices or
            for legal reasons. The &ldquo;Last updated&rdquo; date at the top of this page will always
            reflect the most recent revision.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            Questions about this Privacy Policy or how we (or our advertising/analytics
            partners) handle data? Email us at{" "}
            <a href="mailto:contact@devutilspro.com" className="text-indigo-400 hover:underline font-code">
              contact@devutilspro.com
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
