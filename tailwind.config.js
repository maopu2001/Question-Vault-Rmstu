/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.slate,
        secondary: colors.orange,
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-animated')],
};
