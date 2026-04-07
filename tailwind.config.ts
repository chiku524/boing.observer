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
          black: "#06080c",
          navy: "#0c1018",
          "navy-mid": "#121a24",
        },
        network: {
          primary: "#7c3aed",
          "primary-light": "#b894f5",
          cyan: "#4a9fe8",
          "cyan-light": "#8ec7ff",
          aurora: "#5ab0ff",
          nebula: "#9f8fff",
          gold: "#fbbf24",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(124, 58, 237, 0.22)",
        "glow-cyan": "0 0 24px rgba(74, 159, 232, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
