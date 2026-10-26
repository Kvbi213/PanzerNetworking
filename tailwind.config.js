/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./core.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panzer: {
          darkest: '#05070a',
          dark: '#0a0d14',
          surface: '#101522',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-highlight': 'rgba(255, 255, 255, 0.16)',
          cyan: '#00f0ff',
          emerald: '#10b981',
          purple: '#a855f7',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        display: '-0.02em',
      },
      backdropBlur: {
        '2xl': '24px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
};
