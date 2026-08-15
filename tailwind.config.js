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
        term: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          hover: '#21262d',
          green: '#3fb950',
          blue: '#58a6ff',
          cyan: '#39c5cf',
          purple: '#bc8cff',
          orange: '#d29922',
          red: '#f85149',
          pink: '#f778ba',
          text: '#c9d1d9',
          muted: '#8b949e',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
