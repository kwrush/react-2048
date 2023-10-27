/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import type { VitePWAOptions } from 'vite-plugin-pwa';
/* eslint-enable import/no-extraneous-dependencies */

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: {
    id: '/react-2048/',
    name: 'React 2048',
    short_name: 'React 2048',
    description: 'A React clone of 2048 game',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/react-2048/assets/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/react-2048/assets/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const plugins: PluginOption[] = [react()];

  if (isProd) {
    plugins.push(VitePWA(pwaOptions));
  }

  return {
    base: './',
    server: {
      port: 3000,
    },
    plugins,
    build: {
      emptyOutDir: true,
    },
  };
});
