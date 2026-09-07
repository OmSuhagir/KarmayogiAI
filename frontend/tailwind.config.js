/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F1E9",
        surface: {
          DEFAULT: "#FFFDF8",
          subtle: "#F8F6F0",
          warm: "#F1EDE3",
        },
        border: {
          warm: "#DDD9CF",
          strong: "#C9C4B8",
          subtle: "#EAE6DC",
        },
        govText: {
          primary: "#171717",
          secondary: "#62615D",
          muted: "#8A8882",
        },
        primaryBlack: "#111111",
        accent: {
          blue: "#3348A8",
          light: "#E9EDFF",
          dark: "#253685",
        },
        semantic: {
          success: "#52745D",
          successLight: "#EAF2EC",
          warning: "#A8752E",
          warningLight: "#F7EEDC",
          danger: "#A54C45",
          dangerLight: "#F8E9E7",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        warm: "0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.02)",
        "warm-md": "0 4px 12px -2px rgba(28, 25, 23, 0.06), 0 2px 4px -1px rgba(28, 25, 23, 0.03)",
        "warm-lg": "0 12px 24px -4px rgba(28, 25, 23, 0.08), 0 4px 6px -2px rgba(28, 25, 23, 0.04)",
      },
    },
  },
  plugins: [],
};
