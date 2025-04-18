import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        tablet: '820px', // кастомный брейкпоинт для iPad Air
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite', // медленное вращение за 5 секунд
      },
      colors: {
        'heroui-background': '#000000',
        background: '#000000',
        foreground: '#ffffff',
        danger: '#f31212',
        secondary: '#FE9900',
        primary: '#71717a',
        autofillTextColor: 'rgb(234, 236, 239)',
      },
      fontSize: {
        font18: '18px',
        font50Leading110: [
          '50px',
          { lineHeight: '110%', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        font30Leading110: [
          '30px',
          { lineHeight: '110%', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        font70Leading110: [
          '70px',
          { lineHeight: '110%', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        font30Leading130: ['30px', { lineHeight: '130%', fontWeight: '700' }],
        font18Leading130: ['18px', { lineHeight: '130%', fontWeight: '700' }],
        font22Leading120: ['22px', { lineHeight: '120%', fontWeight: '600' }],
        font16Leading120: ['16px', { lineHeight: '120%', fontWeight: '600' }],
        font16Leading130: ['16px', { lineHeight: '130%', fontWeight: '600' }],
        font16Leading110: ['16px', { lineHeight: '110%', fontWeight: '600' }],
        ibm16Leading130: [
          '16px',
          { lineHeight: '130%', letterSpacing: '-0.02em' },
        ],
        ibm13Leading130: [
          '13px',
          { lineHeight: '130%', letterSpacing: '-0.02em' },
        ],
      },
      fontFamily: {
        ibm: ['IBM_Plex_Mono', 'monospace'], // Используем CSS-переменную
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
