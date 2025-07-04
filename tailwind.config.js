// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'border-rgb': {
          '0%': { borderColor: '#ff0080' },
          '25%': { borderColor: '#7928ca' },
          '50%': { borderColor: '#2afadf' },
          '75%': { borderColor: '#00f6ff' },
          '100%': { borderColor: '#ff0080' },
        },
      },
      animation: {
        'border-rgb': 'border-rgb 6s linear infinite',
      },
    },
  },
  plugins: [],
}
