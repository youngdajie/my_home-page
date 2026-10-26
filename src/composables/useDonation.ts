import { ref } from 'vue'
import { siteConfig, type DonationImage } from '@/site.config'

/**
 * 捐赠弹窗的全局状态。
 * 模块级 ref 即单例，任何组件调用 useDonation() 拿到的都是同一份状态，
 * 不再依赖 querySelector + classList 手动开关 DOM。
 */
const isOpen = ref(false)
const activeIndex = ref(0)

/* ------------------------------ 图片预取 ------------------------------
 * 作用：把赞赏卡的字节尽早拉进缓存，别等到用户点开弹窗才发请求。
 *
 * 但要清楚它的边界（2026-10-26 实测，别再指望它「打开即显示」）：
 *   ① decode() 对 SVG 几乎是空操作 —— SVG 不是位图，浏览器在真正上屏时
 *      才按当前尺寸光栅化，所以 decode() 完成 ≠ 首帧就有内容；
 *   ② 命中 Service Worker 的 CacheFirst 也要走一次 SW 中转，
 *      实测首个 <img> 从 Cache Storage 取回耗时 ~194ms。
 * 真正让弹窗「打开即显示」的是 DonationDialog 里那个常驻的 <img>
 * （v-show，页面加载时就挂上，ImageResource 一直活着）。
 * 这里的预取是补充手段：负责喂另一套主题、以及别在点击那一下才开始下载。
 */
const decoded = new Set<string>()
const inflight = new Map<string, Promise<void>>()

const preload = (src: string): Promise<void> => {
	if (decoded.has(src)) return Promise.resolve()
	const running = inflight.get(src)
	if (running) return running

	const task = new Promise<void>((resolve) => {
		const image = new Image()
		image.decoding = 'async'
		const settle = (): void => {
			decoded.add(src)
			resolve()
		}
		image.onload = () => {
			// decode() 失败也无妨：最坏退化成打开时再解一次
			if (typeof image.decode === 'function') image.decode().then(settle, settle)
			else settle()
		}
		image.onerror = () => resolve()
		image.src = src
	})

	inflight.set(src, task)
	return task
}

/** 把一张收款图按主题解析成实际地址 */
const donationCardSrc = (image: DonationImage, dark: boolean): string =>
	(dark && image.darkSrc) || image.src

type IdleWindow = Window & { requestIdleCallback?: (callback: () => void) => number }

/**
 * 预取赞赏卡。当前主题那张优先，另一张等主线程空闲再补 ——
 * 主题随时可能切，两张都备好才不会在切换后那一眼看到空卡。
 */
export const preloadDonationCards = (dark = false): void => {
	const { images } = siteConfig.donation
	if (!images.length) return

	const primary = images.map((image) => donationCardSrc(image, dark))
	const secondary = images
		.map((image) => donationCardSrc(image, !dark))
		.filter((src) => !primary.includes(src))

	void Promise.all(primary.map(preload)).then(() => {
		if (!secondary.length) return
		const idle = (window as IdleWindow).requestIdleCallback
		if (typeof idle === 'function') idle(() => secondary.forEach((src) => void preload(src)))
		else secondary.forEach((src) => void preload(src))
	})
}

export const useDonation = () => {
	const open = (index = 0): void => {
		activeIndex.value = index
		isOpen.value = true
		// 兜底：冷启动直接点进来（还没预取过）时，至少让下载和打开动画同时开始
		const image = siteConfig.donation.images[index] ?? siteConfig.donation.images[0]
		if (image) {
			void preload(image.src)
			if (image.darkSrc) void preload(image.darkSrc)
		}
	}

	const close = (): void => {
		isOpen.value = false
	}

	const toggle = (index = 0): void => {
		isOpen.value ? close() : open(index)
	}

	return { isOpen, activeIndex, open, close, toggle }
}
