import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "table-header": "hsl(var(--table-header-bg))",
        "table-border": "hsl(var(--table-border))",
        "table-row-hover": "hsl(var(--table-row-hover))",
        "table-row-selected": "hsl(var(--table-row-selected))",
        "pill-red": "hsl(var(--pill-red))",
        "pill-red-bg": "hsl(var(--pill-red-bg))",
        "pill-red-fg": "hsl(var(--pill-red-fg))",
        "pill-yellow-bg": "hsl(var(--pill-yellow-bg))",
        "pill-yellow-fg": "hsl(var(--pill-yellow-fg))",
        "pill-green-bg": "hsl(var(--pill-green-bg))",
        "pill-green-fg": "hsl(var(--pill-green-fg))",
        "pill-purple-bg": "hsl(var(--pill-purple-bg))",
        "pill-purple-fg": "hsl(var(--pill-purple-fg))",
        "pill-blue-bg": "hsl(var(--pill-blue-bg))",
        "pill-blue-fg": "hsl(var(--pill-blue-fg))",
        "bar-red": "hsl(var(--bar-red))",
        "bar-orange": "hsl(var(--bar-orange))",
        "bar-grey": "hsl(var(--bar-grey))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
