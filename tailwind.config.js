/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#141720',
          card: '#1B1F2E',
          elevated: '#232838',
          nav: '#171B28',
        },
        bpc: '#4F8CF7',
        kpv: '#A78BFA',
        ghk: '#34D399',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
