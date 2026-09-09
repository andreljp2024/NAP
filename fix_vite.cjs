const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

if (!code.includes('VitePWA')) {
  code = code.replace(
    "import {defineConfig, Plugin} from 'vite';",
    "import {defineConfig, Plugin} from 'vite';\nimport { VitePWA } from 'vite-plugin-pwa';"
  );
  
  code = code.replace(
    'plugins: [react(), tailwindcss(), aistudioMediaPlugin()],',
    `plugins: [
      react(), 
      tailwindcss(), 
      aistudioMediaPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/portal',
          name: 'Portal do Cliente - NAP',
          short_name: 'Portal NAP',
          description: 'Autoatendimento, faturas e suporte para clientes.',
          theme_color: '#1d4ed8', // blue-700
          background_color: '#f8fafc', // slate-50
          display: 'standalone',
          start_url: '/portal',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\\/\\/fonts\\.googleapis\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\\/\\/fonts\\.gstatic\\.com\\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    ],`
  );
  
  fs.writeFileSync('vite.config.ts', code);
  console.log('vite.config.ts updated');
}
