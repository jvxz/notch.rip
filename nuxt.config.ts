import tailwindcss from '@tailwindcss/vite'
import { name as pkgName } from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        style: 'background-color: var(--color-background);',
      },
      titleTemplate: '%siteName',
    },
  },

  colorMode: {
    storage: 'cookie',
  },

  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/globals.css'],

  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  fonts: {
    defaults: {
      preload: true,
      weights: [400, 500, 700],
    },
  },

  imports: {
    dirs: ['~/utils/*/*.{ts,js,mjs,mts}'],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-security',
    '@vueuse/nuxt',
    'reka-ui/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    'nuxt-vitalizer',
  ],

  nitro: {
    imports: {
      dirs: [
        './server/schema/*',
        './server/utils/*',
      ],
      presets: [
        {
          from: 'zod',
          imports: ['z'],
        },
      ],
    },
    preset: 'bun',
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          'data:',
          'blob:',
          'https://avatars.githubusercontent.com',
          'https://github.com',
          'http://localhost:3000',
          'http://notch.rip',
        ],
      },
    },
    rateLimiter: process.env.NODE_ENV === 'production' ? undefined : false,
  },

  site: {
    description: 'Simple tool to generate wallpapers that reserve the space of the menu bar on macOS. Perfect for hiding the notch on your MacBook, or changing the color of your menu bar.',
    name: pkgName,
    url: 'https://notch.rip',
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
