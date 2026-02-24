/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-color)",
                primary: "var(--text-primary)",
                secondary: "var(--text-secondary)",
                accent: "var(--accent-color)",
            },
            fontFamily: {
                primary: ["var(--font-primary)", "sans-serif"],
                display: ["var(--font-display)", "sans-serif"],
            },
        },
    },
    plugins: [],
}
