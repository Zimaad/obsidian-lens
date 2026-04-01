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
        // Refined Cream Palette (Slightly darker and smoother)
        "cream": {
          50: "#F7F5E6",  // Darkened from FDFCF0
          100: "#F1EED7", // Adjusted
          200: "#E9E5C5",
          300: "#E1DBB2",
          400: "#D9D19F",
          DEFAULT: "#F7F5E6",
        },
        "charcoal": {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6D6D6D",
          600: "#5D5D5D",
          700: "#4F4F4F",
          800: "#454545",
          900: "#3D3D3D",
          950: "#1A1A1A",
          DEFAULT: "#1A1A1A",
        },
        "accent": {
          soft: "#C5A028", // Slightly more muted gold
          deep: "#4E342E", // Warmer brown
          DEFAULT: "#C5A028",
        },
        // Semantic overrides
        "primary": "#1A1A1A",
        "on-primary": "#F7F5E6",
        "secondary": "#C5A028",
        "on-secondary": "#1A1A1A",
        "background": "#F7F5E6",
        "surface": "#FDFCF0", // Keep a super light as a highlight
        "surface-variant": "#F1EED7",
        "outline": "#E1DBB2",
        "error": "#B91C1C",
      },
      fontFamily: {
        headline: ["var(--font-outfit)", "Inter", "sans-serif"],
        body: ["var(--font-geist)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.4rem", // Smoother edges
        lg: "0.8rem",
        xl: "1.2rem",
        "2xl": "2rem",
        full: "9999px",
      },
      transitionTimingFunction: {
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        "drawer": "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};

export default config;
