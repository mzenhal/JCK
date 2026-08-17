import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
        gallery: 'gallery.html',
        process: 'process.html',
        projects: 'projects.html',
        services: 'services.html',
        testimonials: 'testimonials.html',
      },
    },
  },
});
