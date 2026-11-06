import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

import { siteConfig } from './src/site.config.ts'

/**
 * 静态资源后缀：地址栏直接访问这类文件时，不允许被 Service Worker
 * 的导航回退（NavigationRoute -> index.html）接管。
 * 否则访问 /favicon.ico 会返回 index.html。
 */
const STATIC_FILE_PATTERN =
	/\.(?:ico|png|jpe?g|gif|svg|webp|avif|bmp|woff2?|ttf|otf|eot|mp3|mp4|webm|xml|txt|json|webmanifest|map)$/i

/**
 * 字体资源（霞鹜文楷）：woff2 分片子集 + 一份字体 CSS，都在自建 CDN 上，和站点不同源。
 *
 * 这个正则**必须以 `^https://` 打头**，不能像 STATIC_FILE_PATTERN 那样只写后缀。
 * 原因在 Workbox 的 RegExpRoute：跨域请求只有 `result.index === 0`（从头匹配上）
 * 才会被接管，只匹配到 URL 末尾的正则会被静默丢弃。
 * 实测：用后缀正则时 30 条字体请求全都进了 SW 的 fetch 事件，Cache.put 调用 0 次。
 *
 * 域名写死在这里，换 CDN 时要和 index.html 里的样式表地址一起改
 * （那边是 `cdn.jsdmirror.com/cnb/youngdajie/fonts@main/lxgw/style.min.css`）。
 */
const FONT_ASSET_PATTERN =
	/^https:\/\/cdn\.jsdmirror\.com\/cnb\/youngdajie\/fonts@main\/.*\.(?:woff2|css)$/

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

/**
 * 把 site.config.ts 里的站点 meta 注入 index.html。
 * 这样 SEO 信息和页面内容同源，不会出现「配置改了、HTML 忘了改」的漂移。
 */
const injectSiteMeta = (): Plugin => ({
	name: 'inject-site-meta',
	transformIndexHtml: {
		order: 'pre',
		handler(html: string): string {
			const { meta } = siteConfig
			const tokens: Record<string, string> = {
				'%SITE_NAME%': escapeHtml(meta.name),
				'%SITE_TITLE%': escapeHtml(meta.title),
				'%SITE_DESCRIPTION%': escapeHtml(meta.description),
				'%SITE_OG_DESCRIPTION%': escapeHtml(meta.ogDescription),
				'%SITE_KEYWORDS%': escapeHtml(meta.keywords.join(',')),
				'%SITE_URL%': escapeHtml(meta.url),
				'%SITE_LOCALE%': escapeHtml(meta.locale),
				'%SITE_AUTHOR%': escapeHtml(meta.author),
				'%SITE_THEME_COLOR%': escapeHtml(meta.themeColor),
			}
			return Object.entries(tokens).reduce(
				(acc, [token, value]) => acc.split(token).join(value),
				html
			)
		},
	},
})

export default defineConfig({
	plugins: [
		vue(),
		injectSiteMeta(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				cleanupOutdatedCaches: true,
				// 默认 globPatterns 只预缓存 html/js/css；这里把图标也纳入预缓存，
				// 避免图标走运行时缓存时被错误响应污染。图片/字体体积大，交给运行时缓存。
				globPatterns: ['**/*.{html,js,css,ico}'],
				navigateFallback: '/index.html',
				// 关键：直接访问 /favicon.ico 这类静态文件不做导航回退
				navigateFallbackDenylist: [STATIC_FILE_PATTERN],
				runtimeCaching: [
					{
						// 字体：woff2 子集与字体 CSS 共用同一个缓存，一条路由搞定。
						// 拆成两条缓存反而会出问题——ExpirationPlugin 是按 cacheName
						// 对整个缓存做淘汰的，两个实例会互相删对方的条目。
						urlPattern: FONT_ASSET_PATTERN,
						handler: 'CacheFirst',
						options: {
							cacheName: 'font-cache-v1',
							expiration: {
								// 故意不写 maxAgeSeconds：跨域响应读不到 Date 头
								// （它不在 CORS 安全列表里），workbox 的 _isResponseDateFresh
								// 遇到 null 直接判"永远新鲜"，写多少天都不会过期，纯误导。
								// 换字体时把 cacheName 升到 v2，老缓存自然不再被使用。
								maxEntries: 60,
							},
							cacheableResponse: { statuses: [0, 200] },
						},
					},
					{
						urlPattern: /\.html$/,
						handler: 'NetworkFirst', // 优先从网络获取，如果失败则从缓存中获取
						options: {
							cacheName: 'html-cache-v2',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 30 * 24 * 60 * 60, // 缓存 30 天
							},
						},
					},
					{
						urlPattern: /\.(?:css|js)$/,
						handler: 'StaleWhileRevalidate', // 先使用缓存，并异步获取更新
						options: {
							cacheName: 'css-js-cache-v2',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60, // 缓存 30 天
							},
						},
					},
					{
						// 只缓存真正取到 200 的静态资源
						urlPattern: STATIC_FILE_PATTERN,
						handler: 'CacheFirst',
						options: {
							cacheName: 'static-cache-v2',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 30 * 24 * 60 * 60, // 缓存 30 天
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
			injectRegister: 'auto',
			manifest: false,
			devOptions: {
				enabled: true,
			},
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		target: 'es2020',
		chunkSizeWarningLimit: 900,
	},
})
