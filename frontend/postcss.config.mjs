const config = {
  plugins: ["@tailwindcss/postcss"],
};

module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins'],
      },
    },
  },
  // ...
};

export default config;
