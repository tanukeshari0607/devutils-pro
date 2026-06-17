export type ToolCategory =
  | "Formatters"
  | "Encoders"
  | "Security"
  | "Converters"
  | "Testing"
  | "Text";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  input: string;
  output: string;
}

export interface Tool {
  slug: string;
  name: string;
  category: ToolCategory;
  icon: string;
  description: string;
  longDescription: string;
  keywords: string[];
  /** Optional rich SEO content. Falls back gracefully when absent. */
  whyUseIt?: string;
  useCases?: string[];
  examples?: ToolExample[];
  faqs?: ToolFaq[];
}

export const TOOLS: Tool[] = [
  // ── Formatters ────────────────────────────────────────────────
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "Formatters",
    icon: "{ }",
    description: "Format, validate and beautify JSON data instantly.",
    longDescription:
      "JSON (JavaScript Object Notation) is a lightweight, text-based data-interchange format originally derived from JavaScript object syntax but now used as a language-agnostic standard across nearly every modern API, config file, and data pipeline. Our JSON Formatter lets you paste raw, minified, or malformed JSON and instantly beautify it with proper indentation, detect syntax errors down to the exact line and column, minify it for production payloads, explore it visually in a collapsible tree view, and copy or download the cleaned result — all without sending a single byte to a server.",
    whyUseIt:
      "API responses, log lines, and database exports are almost always minified or inconsistently formatted, which makes them painful to read with the naked eye. Pasting that data into a generic text editor doesn't help, because plain text editors have no concept of JSON structure — they can't tell you that a brace is unbalanced or that a comma is missing three lines up. A dedicated JSON formatter parses the document the same way your application's JSON.parse() would, so the moment something is malformed you get a precise, actionable error instead of a silent failure deep inside your app. Because everything runs client-side in your browser, you can safely paste sensitive payloads — auth tokens, internal API responses, customer records — without that data ever leaving your machine, which matters when generic 'online JSON viewers' are a non-starter for security-conscious teams.",
    useCases: [
      "Debugging a minified API response by pasting it in and instantly seeing the full nested structure with indentation.",
      "Validating hand-written or AI-generated JSON config files before committing them, catching trailing commas and unescaped quotes immediately.",
      "Minifying a JSON payload before embedding it in a build artifact or URL parameter to save bytes.",
      "Exploring a deeply nested API response in Tree View and using search to jump straight to a specific key without manually scanning hundreds of lines.",
      "Converting an inconsistently indented JSON file (e.g. one mixing tabs and 4-space indents) to a single consistent style with one click.",
      "Teaching JSON syntax to someone new — the color-coded keys, strings, numbers, and booleans make the structure self-explanatory.",
    ],
    examples: [
      {
        title: "Minified → Formatted",
        input: `{"id":1,"name":"Ada","active":true,"roles":["admin","editor"]}`,
        output: `{\n  "id": 1,\n  "name": "Ada",\n  "active": true,\n  "roles": [\n    "admin",\n    "editor"\n  ]\n}`,
      },
      {
        title: "Common syntax error caught instantly",
        input: `{"id": 1, "name": "Ada",}`,
        output: `Error — Line 1, Col 26: Unexpected token } — trailing commas are not valid JSON`,
      },
    ],
    faqs: [
      {
        question: "Is my JSON data uploaded to a server?",
        answer:
          "No. Parsing, formatting, minifying, and rendering all happen entirely in your browser using JavaScript's built-in JSON.parse/JSON.stringify. Nothing you paste is transmitted anywhere, which makes it safe to use with sensitive or proprietary data.",
      },
      {
        question: "What's the difference between Format and Minify?",
        answer:
          "Format (Ctrl+Enter) re-indents the JSON with your chosen indent style (2 spaces, 4 spaces, or tabs) for human readability. Minify (Ctrl+Shift+M) strips all unnecessary whitespace to produce the smallest possible payload, typically used before sending data over the network or embedding it in production code.",
      },
      {
        question: "Why does it say 'Unexpected token' when my JSON looks fine?",
        answer:
          "The most common causes are trailing commas after the last item in an object or array, single quotes instead of double quotes around strings, or unquoted object keys — all valid in JavaScript object literals but not in strict JSON. The error message includes the exact line and column so you can jump straight to the problem.",
      },
      {
        question: "Can I format very large JSON files?",
        answer:
          "Yes, the formatter handles multi-megabyte JSON without issue since it relies on the browser's native JSON engine. For extremely large files (tens of megabytes), formatting may take a moment since the entire document is parsed into memory before re-serializing.",
      },
      {
        question: "Does Tree View support searching nested keys?",
        answer:
          "Yes. Typing in the search box while in Tree View automatically expands and highlights any branch containing a matching key or value, so you don't have to manually drill down through deeply nested objects.",
      },
    ],
    keywords: ["json", "format", "beautify", "validate", "minify", "pretty print", "json viewer", "json tree"],
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "Formatters",
    icon: "</>",
    description: "Beautify and format HTML markup with proper indentation.",
    longDescription:
      "HTML Formatter cleans up messy or minified HTML markup and applies consistent indentation and formatting. Useful for reading minified HTML from production sites or standardizing template files.",
    keywords: ["html", "format", "beautify", "indent", "markup"],
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "Formatters",
    icon: "⊢",
    description: "Format and beautify SQL queries for readability.",
    longDescription:
      "SQL Formatter takes raw or compressed SQL queries and formats them with consistent keyword casing, newlines, and indentation. Supports SELECT, INSERT, UPDATE, DELETE and complex JOINs.",
    keywords: ["sql", "format", "query", "beautify", "database"],
  },
  {
    slug: "css-minifier",
    name: "CSS Minifier",
    category: "Formatters",
    icon: "#",
    description: "Minify and compress CSS to reduce file size.",
    longDescription:
      "CSS Minifier strips whitespace, comments, and redundant characters from your CSS stylesheets, producing a compressed output that reduces page load times. Also supports expanding minified CSS back to readable form.",
    keywords: ["css", "minify", "compress", "optimize", "stylesheet"],
  },

  // ── Encoders ──────────────────────────────────────────────────
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    category: "Encoders",
    icon: "64",
    description: "Encode and decode text or files to/from Base64.",
    longDescription:
      "Base64 is an encoding scheme that converts binary data into ASCII text using 64 characters. It's widely used in data URIs, email attachments, and API payloads. This tool encodes plain text or files to Base64 and decodes Base64 strings back to their original form.",
    keywords: ["base64", "encode", "decode", "binary", "ascii"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    category: "Encoders",
    icon: "%",
    description: "Encode and decode URL components and query strings.",
    longDescription:
      "URL Encoder (percent-encoding) converts special characters in URLs to their %XX hex equivalent so they can be safely transmitted over the internet. This tool handles both encodeURIComponent-style encoding and full URL encoding.",
    keywords: ["url", "encode", "decode", "percent", "uri", "query string"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Encoders",
    icon: "🔑",
    description: "Decode and inspect JWT tokens without a secret.",
    longDescription:
      "JSON Web Tokens (JWT) are a compact, URL-safe way of representing claims between parties. This tool decodes the header, payload, and signature of a JWT so you can inspect its contents, expiry, and algorithm — no secret key required for decoding.",
    keywords: ["jwt", "token", "decode", "json web token", "auth", "bearer"],
  },

  // ── Security ──────────────────────────────────────────────────
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "Security",
    icon: "🔒",
    description: "Generate strong, cryptographically secure passwords.",
    longDescription:
      "Password Generator creates high-entropy passwords using a cryptographically secure random number generator. Customize length, and include uppercase, lowercase, numbers, and symbols to meet any site's requirements.",
    keywords: ["password", "generator", "secure", "random", "strong", "entropy"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Security",
    icon: "##",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes.",
    longDescription:
      "Hash Generator computes cryptographic hash digests (MD5, SHA-1, SHA-256, SHA-384, SHA-512) for any input string. Useful for verifying file integrity, storing passwords, and generating checksums.",
    keywords: ["hash", "md5", "sha256", "sha512", "checksum", "digest", "crypto"],
  },

  // ── Converters ────────────────────────────────────────────────
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    category: "Converters",
    icon: "⏱",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    longDescription:
      "Unix timestamps represent time as seconds (or milliseconds) elapsed since January 1, 1970 UTC. This converter translates between Unix timestamps and ISO 8601 / human-readable date formats, with timezone support.",
    keywords: ["timestamp", "unix", "epoch", "date", "time", "convert", "iso8601"],
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "Converters",
    icon: "🎨",
    description: "Pick colors and convert between HEX, RGB, HSL, and HSV.",
    longDescription:
      "Color Picker is a visual color selection tool that converts between HEX, RGB, RGBA, HSL, HSLA, and HSV color formats. Pick a color visually or paste any format to instantly see all representations.",
    keywords: ["color", "picker", "hex", "rgb", "hsl", "hsv", "convert"],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    category: "Converters",
    icon: "🖼",
    description: "Convert images to Base64 data URIs for inline embedding.",
    longDescription:
      "Image to Base64 converts PNG, JPG, GIF, SVG, and WebP images into Base64-encoded data URIs. Useful for embedding images directly in CSS, HTML, or JSON without external file references.",
    keywords: ["image", "base64", "data uri", "png", "jpg", "svg", "embed"],
  },

  // ── Testing ───────────────────────────────────────────────────
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Testing",
    icon: ".*",
    description: "Test and debug regular expressions with live match highlighting.",
    longDescription:
      "Regex Tester lets you write regular expressions and test them against sample text in real time. See matches highlighted inline, inspect capture groups, and toggle flags (global, case-insensitive, multiline).",
    keywords: ["regex", "regular expression", "test", "match", "pattern", "flags"],
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    category: "Testing",
    icon: "↔",
    description: "Compare two texts side-by-side and highlight differences.",
    longDescription:
      "Diff Checker compares two blocks of text and highlights additions, deletions, and unchanged lines. Supports word-level and character-level diffing — perfect for reviewing code changes or document revisions.",
    keywords: ["diff", "compare", "text", "difference", "changes", "side by side"],
  },

  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Security",
    icon: "ID",
    description: "Generate RFC 4122 v4 UUIDs in bulk, instantly.",
    longDescription:
      "A UUID (Universally Unique Identifier) is a 128-bit value used to uniquely identify records, sessions, and resources without a central authority. This generator creates cryptographically random v4 UUIDs using your browser's native crypto API, in single or bulk quantities, with optional uppercase and hyphen-free formatting.",
    keywords: ["uuid", "guid", "generator", "v4", "unique id", "random id"],
  },

  // ── Text ──────────────────────────────────────────────────────
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    category: "Text",
    icon: "M↓",
    description: "Write Markdown and preview the rendered HTML in real time.",
    longDescription:
      "Markdown Previewer renders GitHub-Flavored Markdown (GFM) in real time as you type. Supports headings, bold, italic, links, images, code blocks, tables, and task lists — perfect for drafting README files or blog posts.",
    keywords: ["markdown", "preview", "md", "gfm", "render", "html"],
  },
];

export const CATEGORIES: ToolCategory[] = [
  "Formatters",
  "Encoders",
  "Security",
  "Converters",
  "Testing",
  "Text",
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getRelatedTools(slug: string, count = 3): Tool[] {
  const current = getToolBySlug(slug);
  if (!current) return [];

  const sameCategory = TOOLS.filter((t) => t.slug !== slug && t.category === current.category);
  if (sameCategory.length >= count) return sameCategory.slice(0, count);

  const others = TOOLS.filter((t) => t.slug !== slug && t.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}
