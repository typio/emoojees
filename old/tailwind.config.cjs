/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html",
    "./src/**/*.{js,ts,svelte}",],
  theme: {
    fontFamily: {
      'emoji': ["Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji",
        "Android Emoji", "EmojiSymbols"],
    },
    extend: {},
  },
  plugins: [],
}
