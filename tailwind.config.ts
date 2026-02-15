import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        abyss: '#020617',
        accent: '#94b8d4',
        navy: {
          950: '#020617',
          900: '#0a1628',
          800: '#0f2744',
          700: '#15355c',
          600: '#1e4976',
          500: '#2d6a9e',
          400: '#5b9bc7',
          300: '#8fc4e8',
          200: '#b8daf5',
          100: '#d6ebfb',
          50: '#e8f4fc',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
