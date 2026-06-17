import type { Metadata } from "next";
import { HomepageClient } from "@/components/home/HomepageClient";

export const metadata: Metadata = {
  title: "DevUtils Pro – Free Online Developer Tools",
  description:
    "15+ free online developer utilities: JSON formatter, Base64 encoder, regex tester, password generator, diff checker, JWT decoder, and more. No signup required.",
  openGraph: {
    title: "DevUtils Pro – Free Online Developer Tools",
    description: "15+ free online developer utilities in one place.",
    url: "https://devutilspro.com",
  },
  alternates: { canonical: "https://devutilspro.com" },
};

export default function HomePage() {
  return <HomepageClient />;
}
