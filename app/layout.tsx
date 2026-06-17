import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ToastContainer";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";

const BASE_URL = "https://devutilspro.com";

// Self-hosted via next/font: removes the render-blocking Google Fonts CSS
// request that previously delayed first paint on every cold page load.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "DevUtils Pro – Free Online Developer Tools",
    template: "%s | DevUtils Pro",
  },
  description:
    "Free online developer utilities: JSON formatter, Base64 encoder, regex tester, password generator, diff checker, and 15+ more tools for developers.",
  keywords: [
    "developer tools",
    "json formatter",
    "base64 encoder",
    "regex tester",
    "password generator",
    "url encoder",
    "jwt decoder",
    "hash generator",
    "devutils",
  ],
  authors: [{ name: "DevUtils Pro" }],
  creator: "DevUtils Pro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "DevUtils Pro",
    title: "DevUtils Pro – Free Online Developer Tools",
    description:
      "Free online developer utilities: JSON formatter, Base64 encoder, regex tester, password generator, and 15+ more tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevUtils Pro – Free Online Developer Tools",
    description: "15+ free online developer tools in one place.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-[var(--bg-main)]">
            <TopNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastContainer />
          <KeyboardShortcutsModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
