import { defineConfig } from 'astro/config';

// GitHub Pages avec le domaine perso najomsaghira.com (fichier public/CNAME) : le site est à la racine.
export default defineConfig({
  site: 'https://najomsaghira.com',
  base: '/',
  output: 'static',
});
