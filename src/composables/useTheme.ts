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
			isDark.value = event.matches
			applyTheme(event.matches)
		})
	}
}

export const useTheme = () => {
	const toggle = (): void => {
		const next = !isDark.value
		isDark.value = next
		applyTheme(next)
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
