const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fontFamily: {
         'sans': ['Montserrat', 'ui-sans-serif', 'system-ui']
        },
    extend: {}
  },

  plugins: [
  require('@tailwindcss/forms')
  ]
};

module.exports = config;
