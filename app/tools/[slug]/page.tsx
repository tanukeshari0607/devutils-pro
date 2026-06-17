import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { ToolPlaceholder } from "@/components/tools/ToolPlaceholder";

interface Props {
  params: { slug: string };
}

// Each tool is code-split into its own chunk so a visitor only downloads the
// JS (and heavy deps like sql-formatter/marked/crypto-js) for the tool they open.
const TOOL_COMPONENTS: Partial<Record<string, React.ComponentType>> = {
  "json-formatter": dynamic(() => import(/* webpackChunkName: "tool-json-formatter" */ "@/components/tools/JsonFormatter").then((m) => m.JsonFormatter)),
  "base64-encoder": dynamic(() => import(/* webpackChunkName: "tool-base64-encoder" */ "@/components/tools/Base64Encoder").then((m) => m.Base64Encoder)),
  "password-generator": dynamic(() => import(/* webpackChunkName: "tool-password-generator" */ "@/components/tools/PasswordGenerator").then((m) => m.PasswordGenerator)),
  "regex-tester": dynamic(() => import(/* webpackChunkName: "tool-regex-tester" */ "@/components/tools/RegexTester").then((m) => m.RegexTester)),
  "diff-checker": dynamic(() => import(/* webpackChunkName: "tool-diff-checker" */ "@/components/tools/DiffChecker").then((m) => m.DiffChecker)),
  "url-encoder": dynamic(() => import(/* webpackChunkName: "tool-url-encoder" */ "@/components/tools/UrlEncoder").then((m) => m.UrlEncoder)),
  "html-formatter": dynamic(() => import(/* webpackChunkName: "tool-html-formatter" */ "@/components/tools/HtmlFormatter").then((m) => m.HtmlFormatter)),
  "color-picker": dynamic(() => import(/* webpackChunkName: "tool-color-picker" */ "@/components/tools/ColorPicker").then((m) => m.ColorPicker)),
  "jwt-decoder": dynamic(() => import(/* webpackChunkName: "tool-jwt-decoder" */ "@/components/tools/JwtDecoder").then((m) => m.JwtDecoder)),
  "timestamp-converter": dynamic(() => import(/* webpackChunkName: "tool-timestamp-converter" */ "@/components/tools/TimestampConverter").then((m) => m.TimestampConverter)),
  "hash-generator": dynamic(() => import(/* webpackChunkName: "tool-hash-generator" */ "@/components/tools/HashGenerator").then((m) => m.HashGenerator)),
  "css-minifier": dynamic(() => import(/* webpackChunkName: "tool-css-minifier" */ "@/components/tools/CssMinifier").then((m) => m.CssMinifier)),
  "sql-formatter": dynamic(() => import(/* webpackChunkName: "tool-sql-formatter" */ "@/components/tools/SqlFormatter").then((m) => m.SqlFormatter)),
  "markdown-previewer": dynamic(() => import(/* webpackChunkName: "tool-markdown-previewer" */ "@/components/tools/MarkdownPreviewer").then((m) => m.MarkdownPreviewer)),
  "image-to-base64": dynamic(() => import(/* webpackChunkName: "tool-image-to-base64" */ "@/components/tools/ImageToBase64").then((m) => m.ImageToBase64)),
  "uuid-generator": dynamic(() => import(/* webpackChunkName: "tool-uuid-generator" */ "@/components/tools/UuidGenerator").then((m) => m.UuidGenerator)),
};

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: "Tool Not Found" };
  const url = `https://devutilshub.vercel.app/tools/${tool.slug}`;
  return {
    title: `${tool.name} – Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} – DevUtils Pro`,
      description: tool.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} – DevUtils Pro`,
      description: tool.description,
    },
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[params.slug];

  return (
    <ToolLayout tool={tool}>
      {ToolComponent ? <ToolComponent /> : <ToolPlaceholder tool={tool} />}
    </ToolLayout>
  );
}
