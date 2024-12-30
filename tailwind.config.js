/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen-Sans',
        'Ubuntu',
        'Cantarell',
        'Helvetica Neue',
        'sans-serif',
      ],
    },
    extend: {
      colors: {
        'theme-bg': {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        'theme-text': {
          light: '#1d1d1f',
          dark: '#e0ed5e',
        }
      },
    },
  },
  plugins: [],
};
