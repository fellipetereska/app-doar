/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '1px',
      },
      colors: {
        primary: '#0069A8', // Azul
      },
    }
  },
  fontFamily: {
    body: ['Open Sans']
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '7px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            'border-radius': '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            'border-radius': '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        },
      })
    }
  ],
}