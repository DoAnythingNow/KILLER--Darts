/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pub: {
          bg:      '#0d0d0d',
          surface: '#1a1201',
          border:  '#8B6914',
          brass:   '#b8972e',
          text:    '#f5f0e8',
          muted:   '#9e8b6e',
          killer:  '#8B0000',
          out:     '#2a2a2a',
        },
      },
      fontFamily: {
        serif: ['Georgia', "'Times New Roman'", 'serif'],
      },
    },
  },
  plugins: [],
};
