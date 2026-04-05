import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))"
        }
      },
      boxShadow: {
        soft: "0 20px 60px -24px rgba(10, 37, 64, 0.25)",
        glow: "0 20px 80px -30px rgba(22, 101, 52, 0.4)"
      },
      borderRadius: {
        xl2: "1.5rem"
      },
      fontFamily: {
        sans: ['"Sora"', '"Manrope"', '"Segoe UI"', "sans-serif"],
        display: ['"Clash Display"', '"Sora"', '"Segoe UI"', "sans-serif"]
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(22, 101, 52, 0.18), transparent 40%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.16), transparent 35%), linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(240, 253, 244, 0.8))"
      }
    }
  },
  plugins: []
};

export default config;
