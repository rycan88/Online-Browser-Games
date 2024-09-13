/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    spacing: {
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
    },
    extend: {
      colors: {
        'primary': colors.sky['900'], 
      },
      height: {
        'navbar': "60px",
      },
      backgroundImage: {
        'wooden-table': "url(../images/wooden-table-bg.jpg)",
        'galaxy': "url(../images/galaxy-bg.jpg)",
        'timer': "url(../images/timer.svg)",
        'cog': "url(../images/cog-8-tooth.svg)",
        'info': "url(../images/info.svg)",
        'hamburger': "url(../images/hamburger-icon.svg)",
        'cards': "url(../images/cards-bg.jpg)",
      }

    },
  },
  plugins: [],
}
