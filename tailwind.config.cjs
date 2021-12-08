const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [
  require('@tailwindcss/forms')
  ]
};

module.exports = config;
