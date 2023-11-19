/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      monster: ["Monster World", "cursive"],
      bat: ["Batboo", "cursive"],
      escape: ["Escape", "cursive"],
      mouse: ["Mouse Memoirs", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#6495ED",
        secondary: "#FFD700",
        tertiary: "#98FB98",
        pink: "#FF69B4",
      },
    },
  },
  plugins: [],
};
