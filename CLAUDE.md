# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (also runs typecheck + lint — treat a failing build as the source of truth)
npm run start    # serve the production build
npm run lint     # next lint (next/core-web-vitals + next/typescript)
npx tsc --noEmit -p tsconfig.json   # typecheck only, faster than a full build
```

There is no test framework configured (no Jest/Vitest/Playwright, no `test` script) — don't invent test commands or assume tests exist.

On Windows, prefer PowerShell `Remove-Item -Recurse -Force` over `rm -rf`, and use `-LiteralPath` when a path contains `[` or `]` (e.g. `app\tools\[slug]\`) — PowerShell treats brackets as wildcard globs otherwise and will silently no-op.

## Architecture

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `next-themes` for dark/light. Every tool runs entirely client-side — no backend, no database, no API routes. This is a deliberate privacy guarantee ("nothing you paste ever leaves your browser") that shows up in copy throughout the site; don't add a server-side data path for tool processing without flagging that it breaks this guarantee.

**Tool registry (`lib/tools.ts`)** is the single source of truth for every tool: slug, name, category, icon (a short text/emoji glyph, not an SVG component), description, and optional rich SEO fields (`whyUseIt`, `useCases`, `examples`, `faqs`). `TOOL_ICONS`-style duplicate lookup maps were removed in favor of just reading `tool.icon` directly — don't reintroduce per-component icon maps. Only `json-formatter` currently has the optional SEO fields filled in (used as the reference template); the other 15 tools fall back to just `longDescription`. `ToolLayout` renders each optional section conditionally, so adding `whyUseIt`/`useCases`/`examples`/`faqs` to a tool entry is the entire job — no other file needs to change.

**Adding a new tool** requires touching exactly these spots:
1. Add an entry to `TOOLS` in `lib/tools.ts`.
2. Create `components/tools/<ToolName>.tsx`.
3. Register it in the `TOOL_COMPONENTS` map in `app/tools/[slug]/page.tsx` via `dynamic(() => import(...))` — this is what code-splits each tool (and its heavy deps like `sql-formatter`/`marked`/`crypto-js`/`highlight.js`) into its own chunk so visitors only download what they use. `generateStaticParams` already derives all routes from `TOOLS`, so no routing changes needed.
4. Add the slug→icon mapping in `MobileNav`'s `CATEGORY_ICONS`-adjacent usages if it introduces a new category (it won't, normally — categories are fixed in `lib/tools.ts`'s `ToolCategory` union).
`UuidGenerator.tsx` is the cleanest recent example of this 3-step pattern.

**Layout shell (no sidebar):** `app/layout.tsx` renders `TopNav` → `{children}` → `Footer`. There is intentionally no persistent sidebar — it was removed in favor of a sticky top nav with Tools/Resources/Company dropdowns (`components/layout/TopNav.tsx`) plus a hamburger drawer for mobile (`components/layout/MobileNav.tsx`), because the product decision is that tool pages should read as a focused tool, not an admin dashboard. `Footer.tsx` is the deliberate internal-linking hub (popular tools, categories, resources) for SEO crawl depth. Don't resurrect a fixed-height `flex h-screen overflow-hidden` page shell — the site is meant to scroll naturally.

**`ToolLayout.tsx`** is the shared shell every `/tools/[slug]` page renders inside: breadcrumb → title/description → the tool itself (full width, nothing above or beside it) → one mid-content ad slot → `RelatedTools` → SEO sections (What is X / Why use it / Use cases / Examples / FAQ, each conditional) → JSON-LD (`WebApplication`, `BreadcrumbList`, and `FAQPage` when `tool.faqs` exists). The top leaderboard and sidebar skyscraper ad slots were deliberately removed from tool pages so the tool gets full viewport width — only `ad-mid` (336×280, below the tool) remains. If you're asked to add ads back above/beside the tool, flag the tradeoff before doing it.

**JSON Formatter (`components/tools/JsonFormatter.tsx` + `components/tools/json-formatter/`)** is the flagship/reference-quality tool: split-panel editor (`CodeEditor.tsx` — line numbers + syntax highlighting via a transparent-textarea-over-highlighted-`<pre>` overlay, scroll-synced) and a collapsible `JsonTreeView.tsx` with search. It has a "committed input" pattern (`committedInput` state, distinct from the live `input`) so the real-time-vs-manual toggle doesn't fight itself — real-time mode mirrors `input` into `committedInput` on every keystroke; manual mode only advances it when Format/Minify/Validate is clicked. If you add features here, follow that pattern rather than parsing `input` directly in the render path.

**Local-only personalization (`lib/usage.ts`):** recently-used tools, per-tool usage counts, and favorites/pins all live in `localStorage` only — there is no backend and no cross-user analytics. Favorites use a `window.dispatchEvent`/`addEventListener` pub-sub (`onFavoritesChanged`) so the homepage, tool page, and any other consumer stay in sync without prop drilling. "Most Used" / "Popular" sections on the homepage are editorially curated constants (`MOST_USED_SLUGS`), not derived from real cross-user data — don't present them as if they were without adding real analytics first.

**Styling:** colors are CSS variables in `app/globals.css` (`--bg-main` < `--bg-subtle` < `--bg-elevated` layering, plus `--border`/`--border-strong`/`--text-*`), swapped by `next-themes` toggling the `.dark` class on `<html>`. The dark theme is deliberately a softer slate blue-gray (`#0f172a` base), not near-black — that was a specific design correction, don't regress toward `#0d0f17`/`slate-950` for page chrome. Code editors/terminal-style surfaces (JSON Formatter, UUID Generator output) intentionally stay on `bg-slate-900` regardless of theme, like a code editor's own theme — that's fine and not inconsistent.

**Fonts:** `next/font/google` (Inter + JetBrains Mono) self-hosted via CSS variables in `app/layout.tsx`, consumed in `globals.css` as `var(--font-inter)` / `var(--font-jetbrains-mono)`. Do not reintroduce a `@import url(fonts.googleapis.com/...)` in CSS — that was a real render-blocking LCP regression that got fixed.

**Known gotchas:**
- `next/og`'s `ImageResponse` (dynamic OG image generation) crashes the production build on this Windows + Next 14.2.35 setup with `TypeError: Invalid URL` during prerender (a font-path resolution bug in the bundled `@vercel/og`). There is currently no `og-image.png` and no dynamic OG image route — don't re-add `opengraph-image.tsx` without testing the full `next build` on a non-Windows target first.
- `lucide-react` (pinned `^1.18.0`) dropped brand/logo icons (`Github`, `Twitter`, `Linkedin`, etc.) — the footer uses generic icons (`Mail`, `Rss`, `Globe`) as placeholders instead.
- The production URL is `https://devutilshub.vercel.app`, hardcoded as a `BASE_URL` const independently in `app/layout.tsx`, `app/sitemap.ts`, and `components/layout/ToolLayout.tsx` (plus inline in several `generateMetadata` calls). There's no single shared constant — if the domain changes again, all of these need updating together.
