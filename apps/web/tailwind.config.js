const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/features/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
