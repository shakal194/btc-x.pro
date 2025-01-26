import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        primary: "18px",
      },
      fontFamily: {
        ibm: ["IBM_Plex_Sans"], // Используем CSS-переменную
      },
    },
  },
  plugins: [],
} satisfies Config;
