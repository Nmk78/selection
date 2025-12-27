import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],  
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #037d90, #feb47b)",
      },
      aspectRatio: { portrait: "9/15" },
      colors: {
        // Brand Colors (uses CSS variables for easy theme swapping)
        Ctext: "hsl(var(--brand-text))",
        Cbackground: "hsl(var(--brand-background))",
        Cprimary: "hsl(var(--brand-primary))",
        Csecondary: "hsl(var(--brand-secondary))",
        Caccent: "hsl(var(--brand-accent))",

        // Candidate Colors (uses CSS variables for easy theme swapping)
        candidate: {
          male: {
            50: "hsl(var(--candidate-male-50))",
            100: "hsl(var(--candidate-male-100))",
            200: "hsl(var(--candidate-male-200))",
            300: "hsl(var(--candidate-male-300))",
            400: "hsl(var(--candidate-male-400))",
            500: "hsl(var(--candidate-male-500))",
            600: "hsl(var(--candidate-male-600))",
            700: "hsl(var(--candidate-male-700))",
            800: "hsl(var(--candidate-male-800))",
            900: "hsl(var(--candidate-male-900))",
          },
          female: {
            50: "hsl(var(--candidate-female-50))",
            100: "hsl(var(--candidate-female-100))",
            200: "hsl(var(--candidate-female-200))",
            300: "hsl(var(--candidate-female-300))",
            400: "hsl(var(--candidate-female-400))",
            500: "hsl(var(--candidate-female-500))",
            600: "hsl(var(--candidate-female-600))",
            700: "hsl(var(--candidate-female-700))",
            800: "hsl(var(--candidate-female-800))",
            900: "hsl(var(--candidate-female-900))",
          },
        },

        // Success Colors
        success: {
          50: "hsl(var(--success-50))",
          100: "hsl(var(--success-100))",
          200: "hsl(var(--success-200))",
          300: "hsl(var(--success-300))",
          400: "hsl(var(--success-400))",
          500: "hsl(var(--success-500))",
          600: "hsl(var(--success-600))",
          700: "hsl(var(--success-700))",
          800: "hsl(var(--success-800))",
          900: "hsl(var(--success-900))",
        },

        // Warning Colors
        warning: {
          50: "hsl(var(--warning-50))",
          100: "hsl(var(--warning-100))",
          200: "hsl(var(--warning-200))",
          300: "hsl(var(--warning-300))",
          400: "hsl(var(--warning-400))",
          500: "hsl(var(--warning-500))",
          600: "hsl(var(--warning-600))",
          700: "hsl(var(--warning-700))",
          800: "hsl(var(--warning-800))",
          900: "hsl(var(--warning-900))",
        },

        // Error Colors
        error: {
          50: "hsl(var(--error-50))",
          100: "hsl(var(--error-100))",
          200: "hsl(var(--error-200))",
          300: "hsl(var(--error-300))",
          400: "hsl(var(--error-400))",
          500: "hsl(var(--error-500))",
          600: "hsl(var(--error-600))",
          700: "hsl(var(--error-700))",
          800: "hsl(var(--error-800))",
          900: "hsl(var(--error-900))",
        },

        // Gray Scale
        gray: {
          50: "hsl(var(--gray-50))",
          100: "hsl(var(--gray-100))",
          200: "hsl(var(--gray-200))",
          300: "hsl(var(--gray-300))",
          400: "hsl(var(--gray-400))",
          500: "hsl(var(--gray-500))",
          600: "hsl(var(--gray-600))",
          700: "hsl(var(--gray-700))",
          800: "hsl(var(--gray-800))",
          900: "hsl(var(--gray-900))",
        },

        // Purple Scale
        purple: {
          50: "hsl(var(--purple-50))",
          100: "hsl(var(--purple-100))",
          200: "hsl(var(--purple-200))",
          300: "hsl(var(--purple-300))",
          400: "hsl(var(--purple-400))",
          500: "hsl(var(--purple-500))",
          600: "hsl(var(--purple-600))",
          700: "hsl(var(--purple-700))",
          800: "hsl(var(--purple-800))",
          900: "hsl(var(--purple-900))",
        },

        // Amber Scale
        amber: {
          50: "hsl(var(--amber-50))",
          100: "hsl(var(--amber-100))",
          200: "hsl(var(--amber-200))",
          300: "hsl(var(--amber-300))",
          400: "hsl(var(--amber-400))",
          500: "hsl(var(--amber-500))",
          600: "hsl(var(--amber-600))",
          700: "hsl(var(--amber-700))",
          800: "hsl(var(--amber-800))",
          900: "hsl(var(--amber-900))",
        },

        // Gold Scale
        gold: {
          50: "hsl(var(--gold-50))",
          100: "hsl(var(--gold-100))",
          200: "hsl(var(--gold-200))",
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
          800: "hsl(var(--gold-800))",
          900: "hsl(var(--gold-900))",
        },

        // Yellow Scale
        yellow: {
          50: "hsl(var(--yellow-50))",
          100: "hsl(var(--yellow-100))",
          200: "hsl(var(--yellow-200))",
          300: "hsl(var(--yellow-300))",
          400: "hsl(var(--yellow-400))",
          500: "hsl(var(--yellow-500))",
          600: "hsl(var(--yellow-600))",
          700: "hsl(var(--yellow-700))",
          800: "hsl(var(--yellow-800))",
          900: "hsl(var(--yellow-900))",
        },

        // Green Scale
        green: {
          50: "hsl(var(--green-50))",
          100: "hsl(var(--green-100))",
          200: "hsl(var(--green-200))",
          300: "hsl(var(--green-300))",
          400: "hsl(var(--green-400))",
          500: "hsl(var(--green-500))",
          600: "hsl(var(--green-600))",
          700: "hsl(var(--green-700))",
          800: "hsl(var(--green-800))",
          900: "hsl(var(--green-900))",
        },

        // Red Scale
        red: {
          50: "hsl(var(--red-50))",
          100: "hsl(var(--red-100))",
          200: "hsl(var(--red-200))",
          300: "hsl(var(--red-300))",
          400: "hsl(var(--red-400))",
          500: "hsl(var(--red-500))",
          600: "hsl(var(--red-600))",
          700: "hsl(var(--red-700))",
          800: "hsl(var(--red-800))",
          900: "hsl(var(--red-900))",
        },

        // Blue Scale
        blue: {
          50: "hsl(var(--blue-50))",
          100: "hsl(var(--blue-100))",
          200: "hsl(var(--blue-200))",
          300: "hsl(var(--blue-300))",
          400: "hsl(var(--blue-400))",
          500: "hsl(var(--blue-500))",
          600: "hsl(var(--blue-600))",
          700: "hsl(var(--blue-700))",
          800: "hsl(var(--blue-800))",
          900: "hsl(var(--blue-900))",
        },

        // White (themeable)
        white: "hsl(var(--white))",

        // Base/UI Colors
        text: "hsl(var(--brand-text))",
        background: "hsl(var(--background))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        quindelia: "var(--font-quindelia), serif",
        geistMono: "var(--font-geist-mono), monospace",
        geistSans: "var(--font-geist-sans), sans-serif",
      },
      animation: {
        glare: "glare 4s infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
