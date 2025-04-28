/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light Mode
        'light-bg': '#f9fafb',
        'light-foreground': '#111827',
        'light-primary': '#3b82f6',       // blue-500
        'light-secondary': '#e5e7eb',     // gray-200
        'light-accent': '#6366f1',         // indigo-500

        // Dark Mode
        'dark-bg': '#111827',             // gray-900
        'dark-foreground': '#f3f4f6',     // gray-100
        'dark-primary': '#2563eb',        // blue-600
        'dark-secondary': '#1f2937',      // gray-800
        'dark-accent': '#818cf8',         // indigo-400
      },
    },
  },
  plugins: [],
};