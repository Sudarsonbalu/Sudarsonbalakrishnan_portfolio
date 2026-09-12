import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Syne', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        sans: ['var(--font-sans)', 'Manrope', 'sans-serif'],
      },
      colors: {
        crimson: {
          DEFAULT: 'var(--theme-color, #ff1e38)',
          glow: 'var(--theme-glow, rgba(255, 30, 56, 0.4))',
          dim: 'var(--theme-dim, rgba(255, 30, 56, 0.12))',
        },
        obsidian: {
          950: '#07080a',
          900: '#0e0f14',
          850: '#121319',
          800: '#181922',
        },
      },
    },
  },
  plugins: [],
}

export default config
