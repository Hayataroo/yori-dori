import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: colors.violet,
      },
    },
  },
  plugins: [],
};
