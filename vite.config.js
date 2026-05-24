import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.png', 'pwa-icon-512.png'],
            manifest: {
                name: 'Steve Zim Physique',
                short_name: 'Steve Zim Physique',
                description: 'Steve Zim Physique Training App',
                theme_color: '#1a1a1a',
                background_color: '#fbf9f6',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'favicon.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                // Cache external APIs or other runtime routes if needed
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => url.pathname.startsWith('/data/'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'api-data',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                            }
                        }
                    }
                ]
            }
        })
    ]
});
