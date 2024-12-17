// import type { Config } from "tailwindcss";
// import { withUt } from "uploadthing/tw";

// export default withUt({
//   darkMode: ["class"],
//   content: [
//     // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     // "./Components/**/*.{js,ts,jsx,tsx,mdx}",
//     // "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "custom-gradient": "linear-gradient(to right, #037d90, #feb47b)",
//       },
//       aspectRatio: { portrait: "9/15" },
//       colors: {
//         Ctext: "#030707",
//         Cbackground: "#f8fcfc",
//         Cprimary: "#037e91",
//         Csecondary: "#8cd3de",
//         Caccent: "#ff66bf",

//         text: "#030707",
//         background: "hsl(var(--background))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         foreground: "hsl(var(--foreground))",
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         chart: {
//           "1": "hsl(var(--chart-1))",
//           "2": "hsl(var(--chart-2))",
//           "3": "hsl(var(--chart-3))",
//           "4": "hsl(var(--chart-4))",
//           "5": "hsl(var(--chart-5))",
//         },
//       },
//       fontFamily: {
//         quindelia: "var(--font-quindelia), serif",
//         geistMono: "var(--font-geist-mono), monospace",
//         geistSans: "var(--font-geist-sans), sans-serif",
//       },
//       animation: {
//         glare: "glare 4s infinite",
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
//   enabled: process.env.NODE_ENV === "production",

// }) satisfies Config;

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #037d90, #feb47b)",
      },
      aspectRatio: { portrait: "9/15" },
      colors: {
        Ctext: "#030707",
        Cbackground: "#f8fcfc",
        Cprimary: "#037e91",
        Csecondary: "#8cd3de",
        Caccent: "#ff66bf",

        text: "#030707",
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
  enabled: process.env.NODE_ENV === "production",
} satisfies Config;
