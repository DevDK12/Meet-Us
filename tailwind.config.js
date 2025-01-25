/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                background: '#fff',
                text: '#131313',
                theme: '#CF551F',
                secondary: '#E5EBF5',
                tertiary: '#3C75BE',
                secondary_light: '#F6F7F9',
            }
        },
    },
    plugins: [],
}