import { defineConfig } from 'astro/config';

// Pour GitHub Pages — remplace YOUR-USERNAME par ton pseudo GitHub
// Si le repo s'appelle petites-etoiles : base = '/petites-etoiles'
// Si le repo s'appelle USERNAME.github.io : base = '/'
export default defineConfig({
  site: 'https://aymenT75.github.io',
  base: '/petites-etoiles',
  output: 'static',
});
