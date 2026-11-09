import { defineConfig } from 'vite';
import YAML from 'yaml';
import { getSiteUrl } from './site.config.js';
import { generateSeoFiles } from './scripts/generate-seo.js';

function yamlPlugin() {
    return {
        name: 'vite:yaml',
        transform(code, id) {
            if (id.endsWith('.yaml') || id.endsWith('.yml')) {
                const parsed = YAML.parse(code);
                return {
                    code: `export default ${JSON.stringify(parsed)};`,
                    map: null
                };
            }
        }
    };
}

function seoPlugin() {
    return {
        name: 'vite:seo',
        buildStart() {
            generateSeoFiles();
        },
        transformIndexHtml(html) {
            const siteUrl = getSiteUrl();
            const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
            if (canonicalMatch && canonicalMatch[1]) {
                const currentUrl = canonicalMatch[1].replace(/\/+$/, '');
                if (currentUrl !== siteUrl) {
                    return html.replaceAll(currentUrl, siteUrl);
                }
            }
            return html;
        }
    };
}

export default defineConfig({
    plugins: [
        yamlPlugin(),
        seoPlugin()
    ]
});
