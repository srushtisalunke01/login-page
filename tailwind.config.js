/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        nexus: {
          cyan: 'var(--accent-primary)',
          magenta: 'var(--accent-secondary)',
          bg: 'var(--bg-color)',
          text: 'var(--text-primary)',
          textSec: 'var(--text-secondary)',
          card: 'var(--card-bg)',
          border: 'var(--border-color)',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.5)',
        'neon-magenta': '0 0 15px rgba(255, 0, 127, 0.5)',
        'neon-white': '0 0 15px rgba(255, 255, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'nexus': '16px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
