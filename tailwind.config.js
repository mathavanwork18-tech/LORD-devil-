/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'void-black': '#050505',
        'deep-black': '#0A0909',
        'charcoal': '#151313',
        'blood-red': '#7A0C16',
        'dark-crimson': '#B31324',
        'old-gold': '#B06D35',
        'bone-white': '#E7E0D2',
        'ash-grey': '#918B86',
        'shadow-purple': '#24182E',
        void: {
          950: '#050505',
          900: '#0A0909',
          850: '#151313',
          800: '#1C161E',
          700: '#2E1A29',
          600: '#4D1426',
          500: '#7A0C16',
          400: '#B31324',
          300: '#D92338',
          200: '#E7E0D2',
          100: '#F5F0EB',
          purple: '#B31324', // Crimson accent
          crimson: '#B31324',
          muted: '#918B86',
          gold: '#B06D35',
        }
      },
      fontFamily: {
        horror: ['Creepster', 'cursive'],
        heading: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-crimson': '0 0 25px -5px rgba(179, 19, 36, 0.6)',
        'glow-blood': '0 0 30px rgba(122, 12, 22, 0.7)',
        'glow-gold': '0 0 20px -3px rgba(176, 109, 53, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(179, 19, 36, 0.5)',
        'glow-subtle': '0 0 15px -3px rgba(179, 19, 36, 0.3)',
        'gothic-panel': 'inset 0 0 20px rgba(179, 19, 36, 0.1), 0 0 25px rgba(0, 0, 0, 0.9)',
        'hud': 'inset 0 0 20px rgba(179, 19, 36, 0.08), 0 0 15px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'fog': 'fogMove 25s linear infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radarSweep 4s linear infinite',
        'flicker': 'flicker 2s ease-in-out infinite',
        'candle': 'candleFlicker 3s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'ember': 'emberRise 6s linear infinite',
      },
      keyframes: {
        fogMove: {
          '0%': { transform: 'scale(1) translate(0%, 0%)' },
          '100%': { transform: 'scale(1.15) translate(-3%, 3%)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.82' },
          '70%': { opacity: '0.94' },
          '85%': { opacity: '0.78' },
        },
        candleFlicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '25%': { opacity: '0.88', transform: 'scale(0.97)' },
          '50%': { opacity: '0.95', transform: 'scale(1.02)' },
          '75%': { opacity: '0.82', transform: 'scale(0.96)' },
        },
        emberRise: {
          '0%': { transform: 'translateY(100%) translateX(0) scale(1)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-120%) translateX(30px) scale(0.5)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
