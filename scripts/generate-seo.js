import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { siteConfig, getSiteUrl } from '../site.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

/**
 * 转义 XML 特殊字符
 */
function escapeXml(unsafe = '') {
    return String(unsafe).replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

/**
 * 生成 sitemap.xml 内容
 */
function buildSitemapXml(siteUrl) {
    const today = new Date().toISOString().split('T')[0];

    const urlsXml = siteConfig.sitemapRoutes.map((route) => {
        const fullUrl = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
        const parts = [
            '  <url>',
            `    <loc>${fullUrl}</loc>`
        ];

        if (route.alternates && siteConfig.locales) {
            for (const locale of siteConfig.locales) {
                const altUrl = `${siteUrl}${locale.path}`;
                parts.push(`    <xhtml:link rel="alternate" hreflang="${locale.code}" href="${altUrl}"/>`);
            }
        }

        parts.push(`    <lastmod>${route.lastmod || today}</lastmod>`);
        parts.push(`    <changefreq>${route.changefreq || 'monthly'}</changefreq>`);
        parts.push(`    <priority>${Number(route.priority || 0.8).toFixed(1)}</priority>`);

        if (route.video) {
            const v = route.video;
            parts.push('    <video:video>');
            parts.push(`      <video:thumbnail_loc>${v.thumbnailLoc}</video:thumbnail_loc>`);
            parts.push(`      <video:title>${escapeXml(v.title)}</video:title>`);
            parts.push(`      <video:description>${escapeXml(v.description)}</video:description>`);
            parts.push(`      <video:content_loc>${v.contentLoc}</video:content_loc>`);
            parts.push(`      <video:player_loc allow_embed="yes">${v.playerLoc}</video:player_loc>`);
            parts.push(`      <video:duration>${v.duration}</video:duration>`);
            parts.push(`      <video:publication_date>${v.publicationDate}</video:publication_date>`);
            parts.push(`      <video:family_friendly>${v.familyFriendly || 'yes'}</video:family_friendly>`);
            parts.push(`      <video:uploader info="${v.uploaderInfo}">${escapeXml(v.uploader)}</video:uploader>`);
            parts.push('    </video:video>');
        }

        parts.push('  </url>');
        return parts.join('\n');
    }).join('\n\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
${urlsXml}

</urlset>
`;
}

/**
 * 同步更新 robots.txt
 */
function updateRobotsTxt(siteUrl) {
    const robotsPath = path.resolve(publicDir, 'robots.txt');
    if (!fs.existsSync(robotsPath)) return;

    let content = fs.readFileSync(robotsPath, 'utf-8');
    const sitemapLine = `Sitemap: ${siteUrl}/sitemap.xml`;

    if (/^Sitemap:\s*.*$/m.test(content)) {
        content = content.replace(/^Sitemap:\s*.*$/m, sitemapLine);
    } else {
        content = `${content.trim()}\n\n# Sitemap Index\n${sitemapLine}\n`;
    }

    fs.writeFileSync(robotsPath, content, 'utf-8');
}

/**
 * 同步更新 llms.txt
 */
function updateLlmsTxt(siteUrl) {
    const llmsPath = path.resolve(publicDir, 'llms.txt');
    if (!fs.existsSync(llmsPath)) return;

    let content = fs.readFileSync(llmsPath, 'utf-8');
    content = content.replace(
        /- \*\*Primary URL\*\*:\s*https?:\/\/[^\s]+/g,
        `- **Primary URL**: ${siteUrl}/`
    );
    content = content.replace(
        /- \*\*Full Dossier\*\*:\s*https?:\/\/[^\s]+/g,
        `- **Full Dossier**: ${siteUrl}/llms-full.txt`
    );

    fs.writeFileSync(llmsPath, content, 'utf-8');
}

/**
 * 同步更新 llms-full.txt
 */
function updateLlmsFullTxt(siteUrl) {
    const llmsFullPath = path.resolve(publicDir, 'llms-full.txt');
    if (!fs.existsSync(llmsFullPath)) return;

    let content = fs.readFileSync(llmsFullPath, 'utf-8');
    content = content.replace(
        /- Web Application:\s*https?:\/\/[^\s]+/g,
        `- Web Application: ${siteUrl}/`
    );

    fs.writeFileSync(llmsFullPath, content, 'utf-8');
}

/**
 * 同步更新 index.html 中的 Canonical / Alternates / Open Graph / Twitter / JSON-LD
 */
function updateIndexHtml(siteUrl) {
    const indexPath = path.resolve(rootDir, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    let html = fs.readFileSync(indexPath, 'utf-8');

    // 检测 index.html 当前已有的域名
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const oldDomain = canonicalMatch ? canonicalMatch[1].replace(/\/+$/, '') : 'https://zimphysique.vercel.app';

    // 替换所有已知旧域名为新域名（包括旧的 vercel 域名）
    const domainsToReplace = new Set([oldDomain, 'https://zimphysique.vercel.app']);
    for (const domain of domainsToReplace) {
        if (domain && domain !== siteUrl) {
            html = html.replaceAll(domain, siteUrl);
        }
    }

    // 确保 canonical 与 alternates 准确无误
    html = html.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"/i,
        `<link rel="canonical" href="${siteUrl}/"`
    );
    html = html.replace(
        /<link\s+rel="alternate"\s+hreflang="zh-CN"\s+href="[^"]*"/i,
        `<link rel="alternate" hreflang="zh-CN" href="${siteUrl}/"`
    );
    html = html.replace(
        /<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"/i,
        `<link rel="alternate" hreflang="en" href="${siteUrl}/?lang=en"`
    );
    html = html.replace(
        /<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"/i,
        `<link rel="alternate" hreflang="x-default" href="${siteUrl}/"`
    );

    // 确保 Open Graph & Twitter URL 标签
    const ogImageUrl = `${siteUrl}${siteConfig.ogImage || '/book-assets/cover.jpg'}`;
    html = html.replace(
        /<meta\s+property="og:url"\s+content="[^"]*"/i,
        `<meta property="og:url" content="${siteUrl}/"`
    );
    html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"/i,
        `<meta property="og:image" content="${ogImageUrl}"`
    );
    html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"/i,
        `<meta name="twitter:image" content="${ogImageUrl}"`
    );

    fs.writeFileSync(indexPath, html, 'utf-8');
}

/**
 * 执行全量 SEO / Sitemap 文件生成与同步
 */
export function generateSeoFiles() {
    const siteUrl = getSiteUrl();

    // 1. 生成 public/sitemap.xml
    const sitemapXml = buildSitemapXml(siteUrl);
    fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');

    // 2. 更新 public/robots.txt
    updateRobotsTxt(siteUrl);

    // 3. 更新 public/llms.txt
    updateLlmsTxt(siteUrl);

    // 4. 更新 public/llms-full.txt
    updateLlmsFullTxt(siteUrl);

    // 5. 更新 index.html
    updateIndexHtml(siteUrl);

    console.log(`\n🌐 [SEO Generator] 站点域名配置已同步: ${siteUrl}`);
    console.log('   - ✅ public/sitemap.xml 生成完毕');
    console.log('   - ✅ public/robots.txt 同步完毕');
    console.log('   - ✅ public/llms.txt 同步完毕');
    console.log('   - ✅ public/llms-full.txt 同步完毕');
    console.log('   - ✅ index.html (Canonical / OG / JSON-LD) 同步完毕\n');
}

// 允许通过命令行直接执行: node scripts/generate-seo.js
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    generateSeoFiles();
}
