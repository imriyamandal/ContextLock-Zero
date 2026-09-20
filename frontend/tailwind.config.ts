import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B14",
        surface: "#101827",
        surfaceBorder: "#1E293B",
        card: "#0D1527",
        muted: "#94A3B8",
        primary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          glow: "rgba(139, 92, 246, 0.4)",
        },
        accent: {
          DEFAULT: "#22D3EE",
          hover: "#06B6D4",
          glow: "rgba(34, 211, 238, 0.35)",
        },
        conflict: {
          DEFAULT: "#EF4444",
          dark: "#7F1D1D",
          glow: "rgba(239, 68, 68, 0.35)",
        },
        success: {
          DEFAULT: "#10B981",
          dark: "#064E3B",
          glow: "rgba(16, 185, 129, 0.35)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          dark: "#78350F",
          glow: "rgba(245, 158, 11, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Geist", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "GeistMono", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        hero: ["40px", { lineHeight: "48px", fontWeight: "800" }],
        heading: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        card: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["15px", { lineHeight: "22px", fontWeight: "400" }],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)" },
          "100%": { boxShadow: "0 0 35px rgba(139, 92, 246, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
