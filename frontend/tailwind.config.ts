import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f172a',
          panel: '#111827',
          border: '#1f2937',
          accent: '#06b6d4'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(6,182,212,0.2), 0 10px 30px rgba(6,182,212,0.1)'
      }
    }
  },
  plugins: []
};

export default config;
