/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: [
        '-apple-system',
        'SF Pro Text',
        'SF Pro Icons',
        'PingFang SC',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif'
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
