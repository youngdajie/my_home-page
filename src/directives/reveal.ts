import type { Directive } from 'vue'

/**
 * v-reveal —— 元素进入视口后加上 .is-visible，替代原先 public/script.js 里的 IntersectionObserver。
 * 默认提前 15% 视口高度触发，只触发一次。
 */
let observer: IntersectionObserver | null = null

const getObserver = (): IntersectionObserver => {
	if (!observer) {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue
					entry.target.classList.add('is-visible')
					observer?.unobserve(entry.target)
				}
			},
			{ rootMargin: '0px 0px 15% 0px' }
		)
	}
	return observer
}

export const vReveal: Directive<HTMLElement> = {
	mounted(el) {
		if (el.classList.contains('is-visible')) return
		getObserver().observe(el)
	},
	unmounted(el) {
		observer?.unobserve(el)
	},
}
