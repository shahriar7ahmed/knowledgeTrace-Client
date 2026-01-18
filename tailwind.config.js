/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e8f4ed',
                    100: '#c8e3d4',
                    200: '#a0ccb8',
                    300: '#7bb597',
                    400: '#5c9a7a',
                    500: '#4a8268',
                    600: '#3a6b57', // Dark Teal/Green - Main brand color
                    700: '#2d5546',
                    800: '#234d3e',
                    900: '#1a3a2e',
                    950: '#0f231b',
                },
                royal: {
                    DEFAULT: '#3a6b57',
                    light: '#4a8268',
                    dark: '#2d5546',
                },
                secondary: {
                    50: '#fcfdf4',
                    100: '#f9fbe7',
                    200: '#f0f4c3',
                    300: '#e6ee9c',
                    400: '#dce775',
                    500: '#d4e157', // Lime Yellow - Main accent color
                    600: '#b8c90c',
                    700: '#96a605',
                    800: '#7a8700',
                    900: '#5f6c01',
                    950: '#3d4500',
                },
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                accent: {
                    green: '#4a8268', // For OPEN badges - matching primary theme
                    lime: '#d4e157', // Lime yellow accent
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            zIndex: {
                'dropdown': '1000',
                'sticky': '1010',
                'fixed': '1020',
                'modal-backdrop': '1030',
                'modal': '1040',
                'popover': '1050',
                'tooltip': '1060',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
