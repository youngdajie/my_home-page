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

/** 把主题落到 <html> / theme-color meta / color-scheme 上 */
const applyTheme = (dark: boolean): void => {
	const root = document.documentElement
	root.classList.toggle('dark', dark)
	root.style.colorScheme = dark ? 'dark' : 'light'

	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
	if (meta) {
		meta.content = dark ? '#242938' : siteConfig.meta.themeColor
	}
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
