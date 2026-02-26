import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        boing: {
          black: "#020408",
          navy: "#0c1428",
          "navy-mid": "#0d1f3c",
        },
        network: {
          primary: "#7c3aed",
          "primary-light": "#a78bfa",
          cyan: "#06b6d4",
          "cyan-light": "#22d3ee",
          gold: "#fbbf24",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.25)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
