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
