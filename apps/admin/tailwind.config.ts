import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00FF00',
          dark: '#00cc00',
        },
      },
    },
  },
  plugins: [],
};

export default config;
