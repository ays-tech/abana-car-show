import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { serif: ["Georgia", "serif"], sans: ["var(--font-dm-sans)", "sans-serif"] },
      colors: {
        gold: "#C8A45A",
        gold2: "#E2C47A",
        dark: { DEFAULT: "#0C0C0E", 2: "#141416", 3: "#1C1C1F" },
        ivory: { DEFAULT: "#F4EFE4" },
      },
    },
  },
  plugins: [],
};
export default config;
