import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002E5C',
        secondary: '#BF759E',
        'light-gray': '#f2f2f2',
        'light-blue': '#93C4F5',
      },
    },
  },
  plugins: [],
};

export default config;
