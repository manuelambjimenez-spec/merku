module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Fuente predeterminada
      },
      colors: {
        brandOrange: '#f7941d',
        brandGray: '#f3f4f6',
        textGray: '#c2bfbf',
        placeholderGray: '#d3d4d7',
      },
    },
  },
  plugins: [],
};
