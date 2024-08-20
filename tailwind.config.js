/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xsmall: "480px",
      small: "640px",
      medium: "768px",
      large: "1024px",
      xlarge: "1280px",
      "2xlarge": "1536px",
    },

    extend: {
      fontFamily: {
        "roboto-medium": ["Roboto-Medium", "sans-serif"],
        "roboto-black": ["Roboto-Black", "sans-serif"],
        "roboto-bold": ["Roboto-Bold", "sans-serif"],
        "roboto-black-italic": ["Roboto-BlackItalic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
