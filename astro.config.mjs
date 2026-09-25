import { defineConfig } from 'astro/config';

// GitHub Pages avec le domaine perso pettitesetoiles.com (fichier public/CNAME) : le site est à la racine.
export default defineConfig({
  site: 'https://pettitesetoiles.com',
  base: '/',
  output: 'static',
});
