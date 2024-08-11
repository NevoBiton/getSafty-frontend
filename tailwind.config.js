/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        orbit: {
          "0%": {
            transform:
              "translateX(-50%) rotate(0deg) translateY(-150%) rotate(0deg)",
          },
          "100%": {
            transform:
              "translateX(-50%) rotate(360deg) translateY(-150%) rotate(-360deg)",
          },
        },
        flame: {
          "0%, 100%": { height: "1rem" },
          "50%": { height: "1.25rem" },
        },
        rocketFall: {
          "0%": { transform: "translateY(-100%) rotate(45deg)", opacity: "1" },
          "80%": { opacity: "1" },
          "100%": {
            transform: "translateY(100vh) rotate(45deg)",
            opacity: "0",
          },
        },
        shieldAppear: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress 2s ease-in-out infinite",
        rocketFall: "rocketFall 2s linear infinite",
        shieldAppear: "shieldAppear 1s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
