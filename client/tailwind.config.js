/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1D4ED8',    // Primary Blue
          secondary: '#0F172A',  // Dark Navy
          accent: '#2563EB',     // Accent Blue
          dark: '#0F172A',       // Dark Navy Text
          bg: '#EFF6FF',         // Light Blue Background
          success: '#10B981',    // Success Green
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
