// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          border: "hsl(var(--border))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        animation: {
          "spin-slow": "spin 2s linear infinite",
          "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }
      },
    },
    plugins: [],
  }
  