/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./views/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#141414',
          500: '#667eea',
          600: '#5a67d8',
        },
        secondary: {
          500: '#f093fb',
          600: '#e879f9',
        },
        accent: {
          DEFAULT: '#FF4B6E',
          500: '#4facfe',
          600: '#22d3ee',
          love: '#FF4458',
          super: '#3AB4F2',
          nope: '#EC5E6F',
          like: '#4CCC93',
        },
        background: {
          light: '#f7f7f7',
          dark: '#191919',
        },
        'accent-gray': '#f3f4f6',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 40px rgba(139, 92, 246, 0.3)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
