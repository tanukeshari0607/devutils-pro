"use client";

import { useState, useMemo, useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { Download, FileCode } from "lucide-react";

const DEFAULT_MD = `# Welcome to Markdown Previewer

Write **Markdown** on the left, see the *live preview* on the right.

## Features
- GitHub-flavored Markdown
- Syntax highlighted code blocks
- Tables, lists, and links

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

| Feature | Supported |
|---------|-----------|
| Tables  | ✅ |
| Code    | ✅ |

> Blockquotes work too.

[Visit DevUtils Pro](/)
`;

marked.setOptions({
  gfm: true,
  breaks: true,
});

// Custom renderer for syntax-highlighted code blocks
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
  const highlighted = hljs.highlight(text, { language: validLang }).value;
  return `<pre class="hljs rounded-lg p-4 overflow-x-auto text-sm font-code my-3"><code class="language-${validLang}">${highlighted}</code></pre>`;
};
renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
  const titleAttr = title ? ` title="${title}"` : "";
  return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" />`;
};
marked.use({ renderer });

export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const html = useMemo(() => {
    if (!mounted) return "";
    try {
      return marked.parse(markdown) as string;
    } catch {
      return "<p>Error rendering markdown</p>";
    }
  }, [markdown, mounted]);

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Exported Markdown</title></head>
<body>${html}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "preview.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-end">
        <button onClick={downloadMd} className="btn-secondary text-xs py-1.5">
          <FileCode size={13} /> Download .md
        </button>
        <button onClick={downloadHtml} className="btn-secondary text-xs py-1.5">
          <Download size={13} /> Export .html
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Markdown</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="textarea-code h-[28rem] resize-y"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-muted)]">Preview</label>
          <div
            className="markdown-preview h-[28rem] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-main)] p-5 text-sm text-[var(--text-primary)]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <style jsx global>{`
        .markdown-preview h1 { font-size: 1.6em; font-weight: 700; margin: 0.6em 0 0.4em; }
        .markdown-preview h2 { font-size: 1.35em; font-weight: 700; margin: 0.6em 0 0.4em; }
        .markdown-preview h3 { font-size: 1.15em; font-weight: 600; margin: 0.5em 0 0.3em; }
        .markdown-preview p { margin: 0.5em 0; line-height: 1.6; }
        .markdown-preview ul, .markdown-preview ol { margin: 0.5em 0; padding-left: 1.5em; }
        .markdown-preview li { margin: 0.2em 0; }
        .markdown-preview a { color: #818cf8; text-decoration: underline; }
        .markdown-preview blockquote { border-left: 3px solid #6366f1; padding-left: 1em; margin: 0.5em 0; color: var(--text-secondary); }
        .markdown-preview table { border-collapse: collapse; width: 100%; margin: 0.5em 0; }
        .markdown-preview th, .markdown-preview td { border: 1px solid var(--border); padding: 0.4em 0.7em; text-align: left; }
        .markdown-preview th { background: var(--bg-subtle); }
        .markdown-preview code { font-family: "JetBrains Mono", monospace; background: var(--bg-subtle); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .markdown-preview pre code { background: transparent; padding: 0; }
        .markdown-preview img { max-width: 100%; border-radius: 6px; }
        .markdown-preview hr { border-color: var(--border); margin: 1em 0; }
      `}</style>
    </div>
  );
}
