// @ts-check
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://astrocoffee.vercel.app',
  output: 'static',
  adapter: vercel({
    imageService: true,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  security: {
    checkOrigin: false
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover', // Carga la data cuando el usuario pone el cursor sobre el link
  },
  image: {
    domains: ['astrocoffee.juliandrv.com'],
    // service: passthroughImageService()
  },
});
