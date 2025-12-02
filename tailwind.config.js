module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}", "./src/sections/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: "#00e6ff",
          500: "#00c2ff",
        },
      },
      backgroundImage: {
        'hero-noise': "radial-gradient(circle at 10% 20%, rgba(0,255,255,0.06), transparent 25%)",
      },
    },
  },
  plugins: [],
};
