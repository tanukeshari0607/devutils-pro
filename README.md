# DevUtils Pro

Free, fast, browser-based developer tools — JSON formatting, Base64 encoding, regex
testing, hash generation, and more. Everything runs as client-side JavaScript; no
backend ever receives the data you paste into a tool.

Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app hot-reloads as you edit files.

To build and run a production build locally:

```bash
npm run build
npm run start
```

## Project structure

```
app/                   Routes (App Router) — pages, sitemap.ts, robots.ts
components/
  layout/               Sidebar, Header, ToolLayout (shared tool page shell)
  tools/                One component per tool (JsonFormatter, Base64Encoder, …)
  ads/                   AdSlot — the reusable ad placeholder component
  home/                  Homepage client component (search, filters, usage stats)
lib/
  tools.ts               Tool registry (name, slug, category, descriptions)
  usage.ts                localStorage-based usage counter / recently-used tracking
  toast.ts                Global toast notification emitter + copyToClipboard helper
```

## Adding real Google AdSense code

Every tool page renders three placeholder ad slots via the `<AdSlot>` component
([components/ads/AdSlot.tsx](components/ads/AdSlot.tsx)):

| Slot id       | Size     | Location                          |
|---------------|----------|------------------------------------|
| `ad-top`      | 728×90   | Above the tool, below the title    |
| `ad-mid`      | 336×280  | Below the tool card                |
| `ad-sidebar`  | 160×600  | Right rail (desktop only, `xl:` breakpoint up) |

To go live with AdSense:

1. Add the AdSense loader script to `app/layout.tsx`'s `<head>`:
   ```tsx
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossOrigin="anonymous"
   />
   ```
2. In `components/ads/AdSlot.tsx`, replace the placeholder `<div>` with a real ad unit:
   ```tsx
   <ins
     className="adsbygoogle"
     style={{ display: "block", width, height }}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
   />
   ```
3. Push the ad after the component mounts (add a `useEffect` once `AdSlot` is a client
   component):
   ```tsx
   useEffect(() => {
     (window.adsbygoogle = window.adsbygoogle || []).push({});
   }, []);
   ```
4. Keep the same `id` values (`ad-top`, `ad-mid`, `ad-sidebar`) — they're already wired
   into every tool page via `ToolLayout`, so no other files need to change.

## Adding Google Analytics

1. Install the official Next.js analytics helper (optional, or use a plain script tag):
   ```bash
   npm install @next/third-parties
   ```
2. In `app/layout.tsx`, import and mount it inside `<body>`:
   ```tsx
   import { GoogleAnalytics } from "@next/third-parties/google";
   // ...
   <GoogleAnalytics gaId="G-XXXXXXXXXX" />
   ```
   Or, without the package, add directly to `<head>`:
   ```tsx
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
   <script
     dangerouslySetInnerHTML={{
       __html: `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-XXXXXXXXXX');
       `,
     }}
   />
   ```
3. Update [app/privacy-policy/page.tsx](app/privacy-policy/page.tsx) if your actual GA
   configuration differs from what's described there (it already discloses GA + AdSense
   cookie usage and opt-out links).

## Deployment (Vercel)

This repo includes a [vercel.json](vercel.json) with sane defaults (Next.js framework
preset, immutable caching for static assets, basic security headers). To deploy:

```bash
npx vercel
```

or connect the repository at [vercel.com/new](https://vercel.com/new) — no extra
configuration is required beyond setting the project root if it isn't the repo root.

### Before going live

- Replace `https://devutilspro.com` in `app/layout.tsx`, `app/sitemap.ts`, the tool/blog
  page metadata, and `app/robots.ts` with your actual production domain.
- Add a real `/public/og-image.png` (1200×630) — referenced by every page's Open Graph
  metadata.
- Wire up real AdSense/Analytics per the sections above.

## Tech stack

- **Next.js 14** (App Router, static generation for all tool/blog/legal pages)
- **TypeScript**
- **Tailwind CSS** (dark mode via `next-themes`, default dark)
- **Per-tool libraries**: `js-beautify`, `clean-css`, `sql-formatter`, `marked`,
  `highlight.js`, `crypto-js`, `diff-match-patch` — each is code-split via
  `next/dynamic` so a visitor only downloads the dependencies for the tool they open.
