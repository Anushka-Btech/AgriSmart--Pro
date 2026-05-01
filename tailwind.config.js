/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        earth: {
          50: "#faf7f0", 100: "#f0e9d8", 200: "#dfd0ae", 300: "#c9ae7c",
          400: "#b58d52", 500: "#a07540", 600: "#875f35", 700: "#6d4a2c",
          800: "#5b3d28", 900: "#4e3425",
        },
        forest: {
          50: "#f0f9f0", 100: "#dcf0dc", 200: "#bbe2bc", 300: "#8dcc90",
          400: "#5aae5e", 500: "#389440", 600: "#2a7831", 700: "#245f29",
          800: "#1f4c23", 900: "#1a3f1d",
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

