/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0a0f',
        'bg-card': '#12121a',
        'accent': '#00d4ff',
        'accent-purple': '#a855f7',
        'accent-pink': '#ec4899',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)' },
          '50%': { boxShadow: '0 0 80px rgba(0, 212, 255, 0.6)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
