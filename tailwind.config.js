/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./casos-clinicos/index.html",
    "./contacto/index.html",
    "./deep-plane-facelift-buenos-aires/index.html",
    "./dr-leandro-vila/index.html",
    "./lifting-endoscopico/index.html",
    "./lifting-facial/index.html",
    "./preguntas-frecuentes/index.html",
    "./politica-de-privacidad/index.html",
    "./app.js"
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px"
      },
      colors: {
        surface: "#1c1b1b",
        "surface-container-low": "#131313",
        "surface-container-high": "#282828",
        primary: "#2EC4B6",
        "on-primary": "#003531",
        secondary: "#c8c6c6",
        outline: "#3c4947",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c4c6cf",
        "accent-teal": "#2EC4B6"
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
};
