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
				// 预缓存管：index.html、registerSW.js、以及构建产物 assets/*.js 和 *.css。
				//
				// 为什么这几类必须走预缓存而不是运行时 CacheFirst：预缓存每个条目都带
				// `?__WB_REVISION__=<内容hash>` 作为缓存 key，内容一变 key 就变，
				// SW 安装时必然重新下载，激活时 cleanupOutdatedCaches() 再把旧的删掉。
				// 运行时 CacheFirst 用裸 URL 做 key，内容变了 URL 没变 -> 永远拿旧的。
				// （registerSW.js 尤其危险：它决定 SW 怎么注册，锁旧了连更新都推不下去。）
				//
				// ico 不在这里：它归 static@jie，靠运行时缓存。
				globPatterns: ['**/*.{html,js,css}'],
				navigateFallback: '/index.html',
				// 关键：直接访问 /favicon.ico 这类静态文件不做导航回退
				navigateFallbackDenylist: [STATIC_FILE_PATTERN],
				// 缓存命名约定：能自己控的一律 `<用途>@jie[-版本]`。
				// 只有预缓存那个 `workbox-precache-v2-<origin>` 改不了——它是 workbox
				// 用 [prefix, 'precache-v2', scope].join('-') 拼出来的，cacheId 只能替换
				// 第一段（会变成 precache@jie-precache-v2-<origin>，反而更长）。
				// 它现在只装 index.html，实际就扮演着 html@jie 的角色。
				runtimeCaching: [
					{
						// 字体：woff2 子集与字体 CSS 共用同一个缓存，一条路由搞定。
						// 拆成两条缓存反而会出问题——ExpirationPlugin 是按 cacheName
						// 对整个缓存做淘汰的，两个实例会互相删对方的条目。
						urlPattern: FONT_ASSET_PATTERN,
						handler: 'CacheFirst',
						options: {
							cacheName: 'font@jie-v1',
							expiration: {
								// 故意不写 maxAgeSeconds：跨域响应读不到 Date 头
								// （它不在 CORS 安全列表里），workbox 的 _isResponseDateFresh
								// 遇到 null 直接判"永远新鲜"，写多少天都不会过期，纯误导。
								// 换字体时把 cacheName 改成 font@jie-v2，老缓存自然不再被使用。
								maxEntries: 60,
							},
							cacheableResponse: { statuses: [0, 200] },
						},
					},
					{
						// 站点自己的静态依赖：ico / 图片 / 音视频 / manifest 等。
						// css 和 js 不在这条里，它们在预缓存（见上面的 globPatterns）。
						urlPattern: STATIC_FILE_PATTERN,
						handler: 'CacheFirst',
						options: {
							cacheName: 'static@jie',
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
