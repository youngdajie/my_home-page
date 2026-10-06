import { ref, onMounted } from 'vue'
import { siteConfig, type ThemePreference } from '@/site.config'

const STORAGE_KEY = 'color-scheme'

export type ThemeMode = 'light' | 'dark'

/** 全局单例：所有组件共享同一份主题状态 */
const isDark = ref(false)

const mediaQuery = (): MediaQueryList | null =>
	typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const readSavedPreference = (): ThemeMode | null => {
	try {
		const saved = localStorage.getItem(STORAGE_KEY)
		return saved === 'dark' || saved === 'light' ? saved : null
	} catch {
		// 隐私模式 / 禁用存储时静默降级
		return null
	}
}

const writeSavedPreference = (mode: ThemeMode): void => {
	try {
		localStorage.setItem(STORAGE_KEY, mode)
	} catch {
		/* 忽略写入失败 */
	}
}

/** 切换的那一两帧挂在 <html> 上，用来全局禁用过渡 */
const SWITCHING_CLASS = 'is-theme-switching'

/**
 * 把主题落到 <html> / theme-color meta / color-scheme 上。
 *
 * 关键：切换前后会给 <html> 挂上 SWITCHING_CLASS 临时关掉所有过渡。
 * 原因是组件自己声明的 `transition: color` 会在切换时把文字颜色逐帧重算，
 * 浏览器每帧都要重新栅格化字形（实测一次切换经过上百个中间灰度），
 * 亚像素抗锯齿位置随之漂移，看起来就是文字在抖。
 * 关掉过渡后颜色直接黑↔白一次到位，完全没有中间态。
 */
const applyTheme = (dark: boolean): void => {
	const root = document.documentElement

	root.classList.add(SWITCHING_CLASS)
	root.classList.toggle('dark', dark)
	root.style.colorScheme = dark ? 'dark' : 'light'

	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
	if (meta) {
		meta.content = dark ? '#242938' : siteConfig.meta.themeColor
	}

	// 读一次布局属性，强制浏览器带着「无过渡」的样式完成这次重绘
	void root.offsetHeight
	// 等两帧再摘掉，确保切换那一帧已经落地
	requestAnimationFrame(() => {
		requestAnimationFrame(() => root.classList.remove(SWITCHING_CLASS))
	})
}

const resolveByPreference = (preference: ThemePreference): boolean => {
	const saved = readSavedPreference()
	if (saved) return saved === 'dark'
	if (preference === 'light') return false
	if (preference === 'dark') return true
	return mediaQuery()?.matches ?? false
}

/* ---------------------- 昼夜切换的圆形揭幕动效 ---------------------- */

interface RevealOrigin {
	x: number
	y: number
}

const REVEAL_DURATION = 520

const prefersReducedMotion = (): boolean =>
	mediaQuery() !== null && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const supportsViewTransition = (): boolean =>
	typeof document.startViewTransition === 'function'

/** 同一时刻只允许一个揭幕动画；连点时直接瞬时切换 */
let revealing = false

/**
 * 切换主题，并（在支持 View Transition 的浏览器里）从 origin 处圆形扩散揭幕。
 *
 * 手法和 BewlyCat / BewlyBewly 的深色切换一致：View Transition API 会保留
 * 新旧两帧快照，把 `::view-transition-new(root)` 抬到上层后，用 clip-path
 * 的 circle() 从 0 放大到「能盖住最远那个角」的半径，视觉上就是新主题从
 * 点击处扩散、把旧主题揭掉。
 *
 * 不支持 / 用户关闭动效 / 正在动画中 → 直接落地，功能不受影响。
 */
const switchTheme = (dark: boolean, origin: RevealOrigin): void => {
	if (isDark.value === dark) return

	const commit = (): void => {
		isDark.value = dark
		applyTheme(dark)
	}

	if (!supportsViewTransition() || prefersReducedMotion() || revealing) {
		commit()
		return
	}

	const radius = Math.hypot(
		Math.max(origin.x, window.innerWidth - origin.x),
		Math.max(origin.y, window.innerHeight - origin.y)
	)

	revealing = true
	try {
		const transition = document.startViewTransition(commit)

		transition.ready
			.then(() => {
				document.documentElement.animate(
					{
						clipPath: [
							`circle(0px at ${origin.x}px ${origin.y}px)`,
							`circle(${radius}px at ${origin.x}px ${origin.y}px)`,
						],
					},
					{
						duration: REVEAL_DURATION,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
						pseudoElement: '::view-transition-new(root)',
					}
				)
			})
			.catch(() => {
				/* 过渡被跳过 / 中断，快照已经是新主题，忽略即可 */
			})

		transition.finished.finally(() => {
			revealing = false
		})
	} catch {
		// startViewTransition 同步抛错时 commit 还没跑过，补一次
		revealing = false
		commit()
	}
}

/**
 * 揭幕起点。
 *
 * 刻意**不用** click 事件的 clientX/clientY：
 *  1. 触摸设备上合成 click 的坐标可能为 0 或不可靠（真实设备上会跑成左上角 (0,0)）；
 *  2. 语义上就是「从这枚图标揭幕」，跟点中按钮的哪个位置无关。
 * 所以统一取按钮自身的中心矩形，并做一次在视口内的合理性校验兜底。
 */
const resolveOrigin = (event?: Event): RevealOrigin => {
	const fallback: RevealOrigin = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	}

	const el = (event?.currentTarget ?? event?.target) as Element | null
	if (!el || typeof el.getBoundingClientRect !== 'function') return fallback

	const rect = el.getBoundingClientRect()
	if (rect.width <= 0 || rect.height <= 0) return fallback

	const origin: RevealOrigin = {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	}

	// 兜底：必须落在视口内且不是原点，否则退回视口中心
	const inViewport =
		origin.x > 0 &&
		origin.y > 0 &&
		origin.x <= window.innerWidth &&
		origin.y <= window.innerHeight
	return inViewport ? origin : fallback
}

/**
 * 尽早应用主题，避免首屏闪烁。
 * 在 main.ts 里 mount 之前同步调用。
 */
export const initTheme = (preference: ThemePreference = siteConfig.hero.theme): void => {
	const dark = resolveByPreference(preference)
	isDark.value = dark
	applyTheme(dark)

	// 用户没有显式选择时，跟随系统切换
	const mq = mediaQuery()
	if (mq && !readSavedPreference() && preference === 'auto') {
		mq.addEventListener('change', (event) => {
			if (readSavedPreference()) return
			switchTheme(event.matches, {
				x: window.innerWidth / 2,
				y: window.innerHeight / 2,
			})
		})
	}
}

export const useTheme = () => {
	/** 传进来点击事件就能从那枚按钮中心揭幕 */
	const toggle = (event?: Event): void => {
		const next = !isDark.value
		switchTheme(next, resolveOrigin(event))
		writeSavedPreference(next ? 'dark' : 'light')
	}

	onMounted(() => {
		// 兜底：如果 initTheme 没跑到（例如组件被单独复用），这里补一次
		if (!document.documentElement.classList.contains('dark') && isDark.value) {
			applyTheme(true)
		}
	})

	return { isDark, toggle }
}
