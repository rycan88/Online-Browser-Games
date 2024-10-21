/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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
        'temple': "url(../images/temple-bg.png)",
        'poker-gradient': 'radial-gradient(circle at center, #006400, #013220)',
      },
      keyframes: {
        bounceCard: {
          '0%, 20%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
          '50%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '80%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        loseHeartFrame: {
          '0%': { color: colors.red[700], transform: 'scale(1)'},
          '60%, 80%': { color: colors.slate[500], transform: 'scale(0.5)'},
          '100%': { color: colors.slate[500], transform: 'scale(1)'}, 
        },
        riseUpFrame: {
          '0%': { transform: 'translateY(80%) scale(0.5)', opacity: 0 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
        },
        zBounceFrame: {
          '0%, 100%': { transform: 'scale(1)'},
          '50%': { transform: 'scale(1.3)'},
        },
        fadeOutFrame: {
          '0%, 50%': { opacity: 1 },
          '100%': { opacity: 0 },          
        }
      },
      animation: {
        myBounce: 'bounceCard 2s infinite',
        loseHeart: 'loseHeartFrame',
        riseUp: 'riseUpFrame',
        zBounce: 'zBounceFrame',
        fadeOut: 'fadeOutFrame',
      },

    },
  },
  plugins: [],
}
