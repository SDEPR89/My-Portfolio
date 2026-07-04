/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        glass: {
          50: "rgba(231, 240, 250, 0.05)",
          100: "rgba(231, 240, 250, 0.1)",
          200: "rgba(231, 240, 250, 0.2)",
          300: "rgba(231, 240, 250, 0.3)",
        },
        brand: {
          50: "#E7F0FA",
          300: "#7BA4D0",
          600: "#2E5E99",
          900: "#0D2440",
        },
      },
      animation: {
        blob: "blob 20s infinite alternate ease-in-out",
        "blob-reverse": "blob-reverse 25s infinite alternate ease-in-out",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(20px, -30px) scale(1.05)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-reverse": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
