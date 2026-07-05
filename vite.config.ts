import { defineConfig } from 'vite';

export default defineConfig({
  base: '/AsteriaAcademies/', // important for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 5188,
    open: true,
  }
});
