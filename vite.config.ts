/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import type { VitePWAOptions } from 'vite-plugin-pwa';
/* eslint-enable import/no-extraneous-dependencies */

const pwaOptions: Partial<VitePWAOptions> = {
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  registerType: 'autoUpdate',
  manifest: {
    name: 'React 2048',
    short_name: 'React 2048',
    description: 'A React clone of 2048 game',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/assets/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react()];

  if (mode === 'production') {
    plugins.push(VitePWA(pwaOptions));
  }

  return {
    server: {
      port: 3000,
    },
    plugins,
  };
});
