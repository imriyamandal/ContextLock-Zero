import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1C",
        surface: "#111827",
        surfaceBorder: "#1E293B",
        card: "#0E1526",
        primary: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          glow: "rgba(124, 58, 237, 0.4)",
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
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
        mono: ["GeistMono", "JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(124, 58, 237, 0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(124, 58, 237, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
