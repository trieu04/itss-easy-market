/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        accent: "#F59E0B",
        danger: "#EF4444",
        dark: "#1F2937",
        light: "#F9FAFB",
      },
    },
  },
  plugins: [],
}

