/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: true,
    content: ["./src/**/*.{html,js,css,php}"],

    theme: {
      extend: {},
    },

    plugins: [
      require("daisyui"),
    ],

    daisyui: {
      styled: true,
      themes: true,
      base: true,
      utils: true,
      logs: true,
      rtl: false,
      prefix: "",
      darkTheme: "class",
      lightTheme: "class"
    },
  }
