import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { siteConfig, type Subsite } from '@/site.config'

/** 卡片需要稳定的 id 才能在高度平衡时做映射 */
export interface SubsiteCard extends Subsite {
	id: string
}

/** 兼容 ref / useTemplateRef（只读浅引用），只要求能读到 value */
export interface ElementRef {
	readonly value: HTMLElement | null
}

export interface SubsiteLayoutRefs {
	gridRef: ElementRef
	collapseRef: ElementRef
}

const COLLAPSE_DURATION = 450

const waitForHeightTransition = (element: HTMLElement): Promise<void> =>
	new Promise((resolve) => {
		let settled = false
		const onTransitionEnd = (event: TransitionEvent): void => {
			if (event.target === element && event.propertyName === 'height') finish()
		}
		const timeout = window.setTimeout(finish, COLLAPSE_DURATION + 200)
		function finish(): void {
			if (settled) return
			settled = true
			window.clearTimeout(timeout)
			element.removeEventListener('transitionend', onTransitionEnd)
			resolve()
		}
		element.addEventListener('transitionend', onTransitionEnd)
	})

/**
 * 子网站瀑布流布局：
 * - 按断点决定列数
 * - 按卡片真实渲染高度，依次塞进当前最矮的一列
 * - 折叠 / 展开高度过渡
 *
 * DOM 引用由调用方通过 useTemplateRef 提供，避免在这里散落 querySelector。
 */
export const useSubsiteLayout = (
	items: readonly Subsite[] = siteConfig.subsites.items,
	refs?: SubsiteLayoutRefs
) => {
	const cards: SubsiteCard[] = items.map((item, index) => ({ ...item, id: String(index) }))

	const isOpen = ref(true)
	const columnCount = ref(siteConfig.subsites.columns)
	const columns: Ref<SubsiteCard[][]> = ref([])

	// 没有外部引用时（例如单测）退化成内部 ref
	const gridRef = refs?.gridRef ?? ref<HTMLElement | null>(null)
	const collapseRef = refs?.collapseRef ?? ref<HTMLElement | null>(null)

	let resizeTimer: number | undefined
	let animating = false

	const resolveColumnCount = (): number =>
		window.innerWidth <= siteConfig.subsites.breakpoint ? 1 : siteConfig.subsites.columns

	/** 按顺序均分，作为平衡前的初始布局 */
	const resetColumns = (): void => {
		columns.value = Array.from({ length: columnCount.value }, (_, column) =>
			cards.filter((_, index) => index % columnCount.value === column)
		)
	}

	/** 依据 DOM 实测高度，把卡片依次放进当前最矮的一列 */
	const balanceByHeight = (): void => {
		const grid = gridRef.value
		if (!grid || !cards.length) return

		const nodes = grid.querySelectorAll<HTMLElement>('.subsite-card')
		if (nodes.length !== cards.length) return

		const heights = new Map<string, number>()
		nodes.forEach((node) => heights.set(node.dataset.id ?? '', node.offsetHeight || 0))

		const result: SubsiteCard[][] = Array.from({ length: columnCount.value }, () => [])
		const sums = new Array<number>(columnCount.value).fill(0)

		for (const card of cards) {
			let shortest = 0
			for (let i = 1; i < sums.length; i++) {
				if (sums[i] < sums[shortest]) shortest = i
			}
			result[shortest].push(card)
			sums[shortest] += heights.get(card.id) ?? 0
		}
		columns.value = result
	}

	const refreshLayout = (): void => {
		const count = resolveColumnCount()
		columnCount.value = count
		if (columns.value.length !== count) resetColumns()
		if (isOpen.value) nextTick(balanceByHeight)
	}

	const onResize = (): void => {
		window.clearTimeout(resizeTimer)
		resizeTimer = window.setTimeout(refreshLayout, 150)
	}

	const collapse = async (): Promise<void> => {
		const element = collapseRef.value
		if (!element || !isOpen.value) return

		isOpen.value = false
		element.style.height = `${element.offsetHeight}px`
		element.style.overflow = 'hidden'
		void element.offsetHeight // 强制回流，让 height 变化可过渡
		requestAnimationFrame(() => {
			element.style.height = '0px'
		})
		await waitForHeightTransition(element)
		element.style.height = '0px'
		element.style.visibility = 'hidden'
	}

	const expand = async (): Promise<void> => {
		const element = collapseRef.value
		if (!element || isOpen.value) return

		isOpen.value = true
		element.style.visibility = 'visible'
		element.style.height = '0px'
		element.style.overflow = 'hidden'
		void element.offsetHeight
		requestAnimationFrame(() => {
			element.style.height = `${element.scrollHeight}px`
		})
		await waitForHeightTransition(element)
		element.style.height = ''
		nextTick(balanceByHeight)
	}

	const toggle = async (): Promise<void> => {
		if (animating || !siteConfig.subsites.collapsible) return
		animating = true
		try {
			await (isOpen.value ? collapse() : expand())
		} finally {
			animating = false
		}
	}

	onMounted(() => {
		refreshLayout()
		window.addEventListener('resize', onResize)
		// 字体加载完高度会变，需要重新平衡一次
		document.fonts?.ready.then(() => nextTick(balanceByHeight))
	})

	onBeforeUnmount(() => {
		window.clearTimeout(resizeTimer)
		window.removeEventListener('resize', onResize)
	})

	return { columns, isOpen, gridRef, collapseRef, toggle, refreshLayout }
}
