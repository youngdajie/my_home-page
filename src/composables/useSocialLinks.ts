import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { socialLinks, type SocialIconName, type SocialLink } from '@/site.config'
import { useDonation } from './useDonation'

/** 模板可直接消费的结构：a 标签与 button 标签统一成一种描述 */
export interface ResolvedSocialLink {
	tip: string
	icon: SocialIconName
	accent: string
	/** 交互按钮（无跳转）渲染成 button，更符合语义与键盘操作 */
	isButton: boolean
	href: string | undefined
	target: '_blank' | '_self' | undefined
	rel: string | undefined
	activate: (event: MouseEvent) => void
}

const DEFAULT_ACCENT = '#1296db'

/**
 * 注销 Service Worker + 清空 Cache Storage，然后强制刷新。
 * 之前散落在 SiteHeader 里，现在抽成独立能力。
 */
export const resetServiceWorkerCache = async (
	toast: ReturnType<typeof useToast>
): Promise<void> => {
	const noticeOptions = { closeOnClick: false, draggable: false } as const

	try {
		toast.info('正在重置缓存...', { ...noticeOptions, timeout: 2000 })

		if ('serviceWorker' in navigator) {
			const registrations = await navigator.serviceWorker.getRegistrations()
			await Promise.all(registrations.map((registration) => registration.unregister()))

			if ('caches' in window) {
				const cacheNames = await caches.keys()
				await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
			}
		}

		toast.success('缓存已重置，页面将在 3 秒后刷新', { ...noticeOptions, timeout: 3000 })
		window.setTimeout(() => window.location.reload(), 3050)
	} catch (error) {
		console.error('重置缓存时出错:', error)
		toast.error('重置缓存失败，请手动刷新页面', { timeout: 3000 })
	}
}

export const useSocialLinks = (): {
	links: ComputedRef<ResolvedSocialLink[]>
	busy: Ref<boolean>
} => {
	const toast = useToast()
	const { open: openDonation } = useDonation()
	const busy = ref(false)

	const activate = async (link: SocialLink): Promise<void> => {
		if (link.action === 'donate') {
			openDonation(0)
			return
		}
		if (link.action === 'reset-cache') {
			if (busy.value) return
			busy.value = true
			try {
				await resetServiceWorkerCache(toast)
			} finally {
				busy.value = false
			}
		}
	}

	const links = computed<ResolvedSocialLink[]>(() =>
		socialLinks.map((link) => {
			const isButton = Boolean(link.action)
			const isExternal = link.external === true || link.target === '_blank'
			return {
				tip: link.tip,
				icon: link.icon,
				accent: link.accent ?? DEFAULT_ACCENT,
				isButton,
				href: isButton ? undefined : link.url,
				target: isButton ? undefined : (link.target ?? (isExternal ? '_blank' : undefined)),
				rel: isButton ? undefined : isExternal ? 'noopener noreferrer' : undefined,
				activate: (event: MouseEvent) => {
					if (isButton) {
						event.preventDefault()
						void activate(link)
					}
				},
			}
		})
	)

	return { links, busy }
}
