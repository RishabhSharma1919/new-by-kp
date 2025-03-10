export default {
  plugins: {
    "postcss-import": {}, // Ensure postcss-import is first
    "@tailwindcss/postcss": {}, // Use the new Tailwind PostCSS plugin
    autoprefixer: {},
  },
};
