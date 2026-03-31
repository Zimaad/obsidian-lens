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
      colors: {
        "outline": "#928ea0",
        "surface-container-lowest": "#0e0e13",
        "inverse-primary": "#5944da",
        "surface-variant": "#35343a",
        "surface-bright": "#39383e",
        "surface": "#131318",
        "secondary": "#4ddada",
        "tertiary": "#c3d000",
        "background": "#131318",
        "tertiary-container": "#8e9800",
        "surface-container-low": "#1b1b20",
        "primary": "#c7bfff",
        "on-background": "#e4e1e9",
        "error": "#ffb4ab",
        "on-primary": "#2a009f",
        "on-surface": "#e4e1e9",
        "on-secondary": "#003737",
        "primary-fixed": "#e4dfff",
        "surface-dim": "#131318",
        "surface-container-high": "#2a292f",
        "secondary-fixed": "#6ff7f6",
        "secondary-fixed-dim": "#4ddada",
        "outline-variant": "#474555",
        "surface-container": "#1f1f25",
        "primary-container": "#8d7fff",
        "on-tertiary": "#2f3300",
        "surface-tint": "#c7bfff",
        "primary-fixed-dim": "#c7bfff",
        "secondary-container": "#00b3b3",
        "surface-container-highest": "#35343a",
        "on-surface-variant": "#c8c4d7",
        "on-secondary-fixed": "#002020",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
        full: "9999px",
      },
      transitionTimingFunction: {
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        "drawer": "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
