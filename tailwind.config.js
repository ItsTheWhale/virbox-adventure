/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}"
  ],
  safelist: [
    "text-black",
    "flex",
    "text-center",
    "ml-auto"
  ],
  theme: {
    extend: {
      lineHeight: {
        "100vh": "100vh"
      }
    },
    fontFamily: {
      "serif": ["\"Times New Roman\"", "Georgia", "serif"],
      "mono": ["\"Courier New\"", "Courier", "monospace"]
    }
  },
  plugins: [],
}

