module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        secondary: "var(--secondary)",
      },
    },
  },
};

// Primary (Maroon): #800020
// Gold Accent: #FFD700
// Cream Background: #F5F0E6
// Deep Charcoal: #1A1A1A
// Soft Gray: #C9C8C3