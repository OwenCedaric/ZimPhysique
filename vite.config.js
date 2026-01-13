import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg'],
            manifest: {
                name: 'ZimPhysique Training',
                short_name: 'ZimPhysique',
                description: 'ZimPhysique Training App',
                theme_color: '#f59e0b',
                background_color: '#f8fafc',
                display: 'standalone',
                icons: [
                    {
                        src: 'favicon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
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
