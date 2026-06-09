import type { Config } from "tailwindcss";

/**
 * Design system derived from the official Pedro Cunha Carpintaria logo.
 * Ink color sampled directly from /logo.png (#1B1B1B warm near-black).
 * Palette, spacing rhythm and line weights echo the monogram geometry:
 * thin precise hairlines, generous negative space, warm neutral paper.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem", xl: "3.5rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // sampled from the logo ink
        ink: {
          DEFAULT: "#1B1B1B",
          soft: "#2A2A28",
          muted: "#5A5751",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          warm: "#F6F4EF", // warm off-white sections (Vipp/Reform feel)
          deep: "#EFEBE3",
        },
        stone: {
          50: "#FAF9F6",
          100: "#F2EFE9",
          200: "#E5E1D8",
          300: "#D2CCBF",
          400: "#B3AC9C",
          500: "#8C857A",
          600: "#6E685E",
          700: "#524D45",
          800: "#34312C",
          900: "#1F1D1A",
        },
        // single restrained warm accent — derived from wood-neutral, used sparingly
        accent: {
          DEFAULT: "#9A8E78",
          soft: "#B9AF9B",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        // Editorial serif display + clean grotesque body (loaded via next/font)
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // editorial scale (compact)
        "display-xl": ["clamp(2.5rem, 5.5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.6rem, 2.6vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      },
      letterSpacing: {
        // the wordmark uses wide tracking — echoed in eyebrows/labels
        widest: "0.28em",
        brand: "0.42em",
      },
      borderColor: {
        DEFAULT: "#E5E1D8",
        hair: "#E5E1D8",
      },
      maxWidth: {
        prose: "68ch",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "draw-line": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "draw-line": "draw-line 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
