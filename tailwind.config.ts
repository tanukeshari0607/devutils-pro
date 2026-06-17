import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        sidebar: {
          bg: "#0f1117",
          hover: "#1e2130",
          border: "#1e2130",
          text: "#a0aec0",
          active: "#6366f1",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
    },
  },
  plugins: [],
};
export default config;
