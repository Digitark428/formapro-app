/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1116",
          soft: "#1A1F26",
          muted: "#5A636E",
        },
        cream: {
          DEFAULT: "#FAFAF7",
          deep: "#F2F1EB",
        },
        teal: {
          50: "#EAFBF5",
          100: "#CFF6E8",
          200: "#9DEBD2",
          300: "#5FD9B5",
          400: "#22C49A",
          500: "#0FA980",
          600: "#0A8568",
          700: "#0B6A55",
          800: "#0C5444",
          900: "#0B463A",
        },
        amber: {
          400: "#F4B740",
          500: "#E89B1E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,17,22,0.04), 0 8px 24px -12px rgba(14,17,22,0.12)",
        card: "0 1px 0 rgba(14,17,22,0.03), 0 12px 32px -16px rgba(14,17,22,0.18)",
        float: "0 24px 60px -24px rgba(11,70,58,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.8s ease both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
