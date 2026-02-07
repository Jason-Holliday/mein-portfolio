// tailwind.config.js
module.exports = {
  darkMode: "class", // wichtig
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60 % — Hintergrund
        primary: "#121212",   // deep dark grey / near-black

        // 30 % — UI / Text / Panels
        secondary: "#1E1E1E", // weniger dunkel, Panels & Cards

        // 10 % — Akzent
        accent: "#2563EB",    // Blau

        // unterstützende Textfarben
        textPrimary: "#ffffff",
        textSecondary: "#9e9e9e",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
