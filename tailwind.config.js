import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        corporate: {
          "color-scheme": "light",
          "base-100": "oklch(100% 0 0)",
          "base-200": "oklch(93% 0 0)",
          "base-300": "oklch(86% 0 0)",
          "base-content": "oklch(22.389% 0.031 278.072)",
          primary: "oklch(58% 0.158 241.966)",
          "primary-content": "oklch(100% 0 0)",
          secondary: "oklch(55% 0.046 257.417)",
          "secondary-content": "oklch(100% 0 0)",
          accent: "oklch(60% 0.118 184.704)",
          "accent-content": "oklch(100% 0 0)",
          neutral: "oklch(0% 0 0)",
          "neutral-content": "oklch(100% 0 0)",
          info: "oklch(60% 0.126 221.723)",
          "info-content": "oklch(100% 0 0)",
          success: "oklch(62% 0.194 149.214)",
          "success-content": "oklch(100% 0 0)",
          warning: "oklch(85% 0.199 91.936)",
          "warning-content": "oklch(0% 0 0)",
          error: "oklch(70% 0.191 22.216)",
          "error-content": "oklch(0% 0 0)",

          "--radius-box": "0.5rem",
          "--radius-field": "0.5rem",
          "--radius-selector": "0.5rem",
          "--size-selector": "0.25rem",
          "--size-field": "0.25rem",
          "--border": "1px",
          "--depth": "1",
          "--noise": "1",
        },
      },
    ],
    darkTheme: false,
  },
};
