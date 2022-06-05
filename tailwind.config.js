const colors = require('tailwindcss/colors')
console.log(colors.violet)
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
  plugins: [require("flowbite/plugin")],
}
