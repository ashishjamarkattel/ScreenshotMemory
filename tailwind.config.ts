import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'dark-gradient':  'linear-gradient(180deg, rgba(0, 0, 0, 0.9), hsl(0, 0%, 17%))', // Dark gradient
      },

      colors: {
        background: 'hsl(0, 0%, 17%)',
        foreground: 'hsl(60, 9.1%, 97.8%)',
        card: 'hsl(0, 0%, 20%)',
        cardForeground: 'hsl(60, 9.1%, 97.8%)',
        popover: 'hsl(0, 0%, 25%)',
        popoverForeground: 'hsl(60, 9.1%, 98.5%)',
        primary: 'hsl(60, 9.1%, 97.8%)',
        primaryForeground: 'hsl(24, 9.8%, 10%)',
        secondary: 'hsl(12, 6.5%, 15.1%)',
        secondaryForeground: 'hsl(60, 9.1%, 97.8%)',
        muted: 'hsl(12, 6.5%, 15.1%)',
        mutedForeground: 'hsl(24, 5.4%, 63.9%)',
        accent: 'hsl(12, 6.5%, 15.1%)',
        accentForeground: 'hsl(60, 9.1%, 97.8%)',
        destructive: 'hsl(0, 62.8%, 30.6%)',
        destructiveForeground: 'hsl(60, 9.1%, 97.8%)',
        border: 'hsl(20, 5.9%, 25%)',
        input: 'hsl(12, 6.5%, 15.1%)',
        ring: 'hsl(24, 5.7%, 82.9%)',
        chart1: 'hsl(220, 70%, 50%)',
        chart2: 'hsl(160, 60%, 45%)',
        chart3: 'hsl(30, 80%, 55%)',
        chart4: 'hsl(280, 65%, 60%)',
        chart5: 'hsl(340, 75%, 55%)',

      },  
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
