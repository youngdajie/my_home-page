import { ref } from 'vue'

/**
 * 捐赠弹窗的全局状态。
 * 模块级 ref 即单例，任何组件调用 useDonation() 拿到的都是同一份状态，
 * 不再依赖 querySelector + classList 手动开关 DOM。
 */
const isOpen = ref(false)
const activeIndex = ref(0)

export const useDonation = () => {
	const open = (index = 0): void => {
		activeIndex.value = index
		isOpen.value = true
	}

	const close = (): void => {
		isOpen.value = false
	}

	const toggle = (index = 0): void => {
		isOpen.value ? close() : open(index)
	}

	return { isOpen, activeIndex, open, close, toggle }
}
