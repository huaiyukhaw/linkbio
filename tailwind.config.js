const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        gray: colors.zinc,
      },
    },
  },
  darkMode: 'media',
  plugins: [
    require("flowbite/plugin"),
    require('@tailwindcss/line-clamp')
  ],
}
