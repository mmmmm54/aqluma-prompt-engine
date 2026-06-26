import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: "#C86028",
        ink: "#0E1413",
        bone: "#F0F0E8",
        charcoal: "#1B2128",
        saffron: "#E0A23C",
        stone: "#8A857C",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,20,19,0.04), 0 8px 24px rgba(14,20,19,0.06)",
        spotlight: "0 0 0 1px rgba(224,162,60,0.15), 0 18px 50px rgba(0,0,0,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
