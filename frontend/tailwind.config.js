/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2868ad',
        'primary-highlight': '#4d91db',
        'primary-dark': '#19497d',
        'primary-darker': '#0d3764',
        'primary-red': '#ef4444',
        'primary-red-dark': '#cf2a2a',
        'primary-red-darker': '#a61616',
        'primary-green': '#22c55e',
        'primary-green-dark': '#13b44e',
        'primary-green-darker': '#0a943d',
        'primary-purple': '#674af7',
        'primary-purple-dark': '#5a3fdf',
        'primary-pruple-darker': '#4832b6',
      },
      fontSize: {
        'massive': [
          '80px',
          {
            fontWeight: '700',
          },
        ],
        'heading': [
          '48px',
          {
            fontWeight: '700',
          },
        ],
        'sub-heading': [
          '32px',
          {
            fontWeight: '600',
          },
        ],
        'body': [
          '24px',
          {
            fontWeight: '500',
          },
        ],
        'body-small': [
          '18px',
          {
            fontWeight: '500',
          },
        ],
        'body-tiny':[
          '12px',
          {
            fontWeight: '500',
          },
        ]
        ,
        'button': [
          '24px',
          {
            fontWeight: '700',
          },
        ],
        'button-small': [
          '18px',
          {
            fontWeight: '700',
          },
        ],
      },
      fontFamily: {
        'OpenSans': ['Open Sans', 'sans-serif'],
        'DmSans': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
