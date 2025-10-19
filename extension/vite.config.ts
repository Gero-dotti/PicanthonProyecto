import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // Copy manifest.json
        fs.copyFileSync('manifest.json', 'dist/manifest.json');

        // Copy icons
        if (!fs.existsSync('dist/assets')) {
          fs.mkdirSync('dist/assets', { recursive: true });
        }

        const icons = ['icon-16.png', 'icon-32.png', 'icon-48.png', 'icon-128.png'];
        icons.forEach(icon => {
          if (fs.existsSync(`assets/${icon}`)) {
            fs.copyFileSync(`assets/${icon}`, `dist/assets/${icon}`);
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup/popup.html'),
        background: path.resolve(__dirname, 'background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './popup')
    }
  }
});
