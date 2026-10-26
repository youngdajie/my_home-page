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
 * 弹窗是 v-if 挂载的：打开那一刻 <img> 才被创建、图片才开始下载，
 * 这中间的空白就是用户眼里的「黑块」。所以提前把赞赏卡拉进内存并解码完，
 * 真正打开时直接上屏。
 *
 * decode() 和 onload 的区别是关键：onload 只代表字节到齐，位图未必已解码，
 * 首帧仍可能空一下；decode() 完成才是「能立刻画出来」。
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

/** 某个地址是否已经解码完（弹窗据此决定要不要做淡入） */
export const isDonationCardReady = (src: string): boolean => decoded.has(src)

/** 把一张收款图按主题解析成实际地址 */
export const donationCardSrc = (image: DonationImage, dark: boolean): string =>
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
