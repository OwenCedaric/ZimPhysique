import process from 'node:process';

// 尝试加载本地 .env 文件（Node.js >= 20.6.0 原生支持）
try {
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile();
    }
} catch {
    // 忽略 .env 文件不存在的情况
}

/**
 * 站点全局配置文件 (Site Configuration)
 * 统一管理站点基础信息、生产环境域名以及 SEO / GEO 元数据。
 *
 * 【域名配置指引】：
 * 1. 直接修改下方的 siteUrl 属性，填入你实际绑定的完整域名（如 'https://zimphysique.com'）。
 * 2. 或者在部署平台（如 Vercel / Cloudflare / Netlify）的环境变量中设置：
 *    SITE_URL=https://your-custom-domain.com
 *    或 VITE_SITE_URL=https://your-custom-domain.com
 *
 * 修改后运行 `pnpm build` 或 `pnpm generate:seo`，系统将自动同步更新：
 * - public/sitemap.xml
 * - public/robots.txt
 * - public/llms.txt
 * - public/llms-full.txt
 * - index.html (Canonical, Open Graph, Twitter Card, JSON-LD)
 */
export const siteConfig = {
    // 站点绑定的生产环境自定义域名（末尾不带斜杠）
    siteUrl: process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://zim.ceda.is',

    // 站点基础信息
    siteName: 'Zim Physique · 极简形体雕刻',
    shortName: 'Zim Physique',
    title: 'Zim Physique · 极简形体雕刻 | Steve Zim《6周打造好莱坞体态》训练与科学理论体系',
    description: 'Steve Zim《6周打造好莱坞体态》(6 Weeks to a Hollywood Body) 全套数字化训练与科学理论体系：零惯性生物力学、4-2-2-1受张时间(TUT)、好莱坞V-Taper倒三角雕刻、2:1视觉餐盘、外胚/中胚/内胚体型定制方案与瘦体重(LBM)测算器。内置 Steve Zim 谷歌圣莫尼卡研发中心演讲(Talks at Google)实录。',
    keywords: 'Steve Zim, 6 Weeks to a Hollywood Body, 6周打造好莱坞体态, Talks at Google, 谷歌演讲, 好莱坞体态, 极简形体雕刻, V-Taper, 倒三角, 4-2-2-1受张时间, 生物力学孤立, 瘦体重计算器, 骨盆前倾矫正, 外胚型, 中胚型, 内胚型, 健身计划, 明星私教, A Tighter U',

    // 实体与创作者信息
    author: 'Steve Zim & Mark Laska',
    publisher: 'Zim Physique',
    twitterCreator: '@SteveZim',

    // 默认封面与分享图
    ogImage: '/book-assets/cover.jpg',

    // 多语言映射
    defaultLocale: 'zh-CN',
    locales: [
        { code: 'zh-CN', path: '/' },
        { code: 'en', path: '/?lang=en' },
        { code: 'x-default', path: '/' }
    ],

    // Sitemap 包含的页面与锚点板块路由
    sitemapRoutes: [
        {
            path: '/',
            changefreq: 'weekly',
            priority: 1.0,
            alternates: true,
            video: {
                thumbnailLoc: 'https://i.ytimg.com/vi/aJRzBLTsNMQ/hqdefault.jpg',
                title: '6 Weeks to a Hollywood Body | Steve Zim | Talks at Google',
                description: 'Celebrity fitness trainer Steve Zim visits Google Santa Monica to present his 6 Weeks to a Hollywood Body system: Hollywood Nutrition, Hollywood Heart, and Hollywood Sculpt biomechanics.',
                contentLoc: 'https://www.youtube.com/watch?v=aJRzBLTsNMQ',
                playerLoc: 'https://www.youtube.com/embed/aJRzBLTsNMQ',
                duration: 2720,
                publicationDate: '2007-08-29',
                familyFriendly: 'yes',
                uploader: 'Talks at Google',
                uploaderInfo: 'https://talksatgoogle.com'
            }
        },
        { path: '/#theory', changefreq: 'monthly', priority: 0.9 },
        { path: '/#domain-biomechanics', changefreq: 'monthly', priority: 0.8 },
        { path: '/#domain-metabolism', changefreq: 'monthly', priority: 0.8 },
        { path: '/#domain-somatotypes', changefreq: 'monthly', priority: 0.8 },
        { path: '/#domain-exercises', changefreq: 'monthly', priority: 0.8 },
        { path: '/#domain-longevity', changefreq: 'monthly', priority: 0.8 }
    ]
};

/**
 * 获取规范化后的站点 URL（自动补充协议，移除末尾斜杠）
 */
export function getSiteUrl(rawUrl = siteConfig.siteUrl) {
    let url = (process.env.SITE_URL || process.env.VITE_SITE_URL || rawUrl || '').trim();
    if (!url) {
        url = 'https://zimphysique.com';
    }
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }
    return url.replace(/\/+$/, '');
}

export default siteConfig;
