import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    integrations: [
        react(),
    ],
    // URL chapter 04 berubah (judul chapter disesuaikan dengan isinya).
    // Redirect supaya tautan lama tidak mati.
    redirects: {
        '/meetings/04-api-security-docs': '/meetings/04-validasi-error-docs',
    },
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            },
            wrap: true,
        }
    }
});
