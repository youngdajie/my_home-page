<script setup>
	import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
	import projectsData from '../../assets/data/set_link.json';

	// 定义响应式数据
	const isOpen = ref(false)
	const projects = projectsData.map((item, index) => ({ ...item, id: String(index) }))
	const subsiteGridRef = ref(null)
	const columnCount = ref(3)
	const columns = ref([])
	let resizeTimer = null

	const resetColumns = () => {
		columns.value = Array.from({ length: columnCount.value }, (_, column) =>
			projects.filter((_, index) => index % columnCount.value === column)
		)
	}

	// 根据卡片真实渲染高度，把项目依次放进当前最矮的一列
	const balanceByHeight = () => {
		if (!subsiteGridRef.value || !projects.length) return
		const nodes = subsiteGridRef.value.querySelectorAll('.subsite-card')
		if (nodes.length !== projects.length) return

		const heights = new Map()
		nodes.forEach((node) => heights.set(node.dataset.id, node.offsetHeight || 0))

		const result = Array.from({ length: columnCount.value }, () => [])
		const sums = Array(columnCount.value).fill(0)
		for (const item of projects) {
			let shortest = 0
			for (let i = 1; i < sums.length; i++) {
				if (sums[i] < sums[shortest]) shortest = i
			}
			result[shortest].push(item)
			sums[shortest] += heights.get(item.id) || 0
		}
		columns.value = result
	}

	const refreshLayout = () => {
		const count = window.innerWidth <= 600 ? 1 : 3
		columnCount.value = count
		if (columns.value.length !== count) {
			resetColumns()
		}
		nextTick(balanceByHeight)
	}

	const onResize = () => {
		clearTimeout(resizeTimer)
		resizeTimer = setTimeout(refreshLayout, 150)
	}

	onMounted(() => {
		refreshLayout()
		window.addEventListener('resize', onResize)
		if (document.fonts?.ready) {
			document.fonts.ready.then(() => nextTick(balanceByHeight))
		}
	})

	onBeforeUnmount(() => {
		clearTimeout(resizeTimer)
		window.removeEventListener('resize', onResize)
	})

	const toggle = () => {
		isOpen.value = !isOpen.value
	}
</script>

<template>
	<content>
		<!-- 内容开始 -->
		<div class="section-title section-title--collapsible" @click="isOpen = !isOpen">
			<svg t="1705257422086" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="1891" width="26px" height="26px">
				<path
					d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"
					p-id="1892"></path>
			</svg> 子网站 / Subsites <div class="section-title__toggle" :class="{ 'is-open': !isOpen }"></div>
		</div>
		<div v-show="!isOpen">
			<div class="subsite-grid" ref="subsiteGridRef">
				<div v-for="(column, columnIndex) in columns" :key="columnIndex" class="subsite-grid__column">
					<a v-for="item in column" :key="item.id" class="subsite-card" :data-id="item.id" target="_blank"
						:href="item.url">
						<div class="subsite-card__body">
							<h1 class="subsite-card__title">{{ item.title }}</h1>
							<p class="subsite-card__description" v-html="item.desc"></p>
						</div>
					</a>
				</div>
			</div>
		</div>
		<div class="section-title dark-mode-hidden">
			<svg t="1705257823317" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="7833" width="26px" height="26px">
				<path
					d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z"
					p-id="7834"></path>
			</svg> 技能 / Skills
		</div>
		<div class="skills-panel dark-mode-hidden">
			<!-- 技能开始 -->
			<!-- 前往https://skillicons.dev/
            生成，一个pc端，一个移动端，区别是一行的个数 -->
			<img id="skills-desktop-image" src="../../assets/images/skillPc.svg" alt="" srcset="">
			<img id="skills-mobile-image" src="../../assets/images/skillWap.svg" alt="" srcset="">
		</div>
		<div class="section-title dark-mode-hidden below-1176-hidden">
			<svg t="1749913207810" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="6167" id="mx_n_1749913207811" width="26px" height="26px"
				xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M588.8 588.8m-281.6 0a281.6 281.6 0 1 0 563.2 0 281.6 281.6 0 1 0-563.2 0Z" fill="#000000"
					p-id="6168"></path>
				<path
					d="M803.84 768l199.68 199.68c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0L768 803.84c-81.92 71.68-189.44 117.76-307.2 117.76-256 0-460.8-204.8-460.8-460.8s204.8-460.8 460.8-460.8 460.8 204.8 460.8 460.8c0 117.76-46.08 225.28-117.76 307.2zM460.8 870.4c225.28 0 409.6-184.32 409.6-409.6s-184.32-409.6-409.6-409.6-409.6 184.32-409.6 409.6 184.32 409.6 409.6 409.6z"
					fill="#000000" p-id="6169" data-spm-anchor-id="a313x.search_index.0.i10.117c3a81prSnSL" class="">
				</path>
			</svg> 小程序 / 公众号
		</div>
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 80%;"
			class="dark-mode-hidden below-1176-hidden">
			<img class="mini-program-preview" src="../../assets/images/1.png" alt="小程序">
		</div>

		<!-- 技能结束 -->
	</content>
	<!-- 内容结束 -->
</template>

<style scoped>
	.section-title--collapsible {
		cursor: pointer;
	}

	.section-title__toggle {
		margin: 0 0 0 3px;
		display: inline-block;
		width: 0;
		height: 0;
		border-left: 16px solid currentColor;
		border-top: 9px solid transparent;
		border-bottom: 9px solid transparent;
		transition: transform 0.2s;
	}

	.section-title__toggle.is-open {
		transform: rotate(90deg);
	}

	</style>
