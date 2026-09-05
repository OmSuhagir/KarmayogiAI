/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F7FB",
        gov: {
          50: "#F0F5FF",
          100: "#E0ECFF",
          200: "#B9D5FF",
          300: "#7CAFFF",
          400: "#3882FF",
          500: "#0055D6",
          600: "#0043B0",
          700: "#00348C",
          800: "#00286E",
          900: "#001D52",
        },
        karmayogi: {
          blue: "#1E40AF",
          navy: "#0F172A",
          slate: "#334155",
          accent: "#0284C7",
          cyan: "#06B6D4",
          violet: "#6366F1",
          lavender: "#8B5CF6",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#E11D48",
        },
        glass: {
          base: "rgba(255, 255, 255, 0.65)",
          surface: "rgba(255, 255, 255, 0.75)",
          solid: "rgba(255, 255, 255, 0.90)",
          border: "rgba(255, 255, 255, 0.65)",
          borderSubtle: "rgba(226, 232, 240, 0.70)",
          highlight: "rgba(255, 255, 255, 0.85)",
        }
      },
      boxShadow: {
        glass: "0 8px 30px -4px rgba(31, 38, 135, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        "glass-sm": "0 4px 16px -2px rgba(31, 38, 135, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        "glass-lg": "0 16px 40px -6px rgba(31, 38, 135, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "glass-inset": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
        glass: "14px",
      }
    },
  },
  plugins: [],
};
