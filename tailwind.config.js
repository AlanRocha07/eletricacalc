/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background:  '#0f1117',
        card:        '#14213d',
        border:      '#1e2d4a',
        input:       '#1a2740',
        foreground:  '#e5e5e5',
        'muted-foreground': '#7a8fa8',
        primary:     '#fca311',
        'primary-foreground': '#0f1117',
        muted:       '#14213d',
        ring:        '#fca311',
        success:     '#22c55e',
        destructive: '#ef4444',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
