// @ts-check
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['astrocoffee.juliandrv.com'],
    service: passthroughImageService()
  },
});
