<template>
	<div class="page-background"></div>

	<!-- 左上角浮动 Logo：暗色下也显示（CSS 里垫了「暗玻璃 + 底部提亮」托住波浪）。
	     窄屏不渲染，见 script 里的 showLogo。 -->
	<div v-if="showLogo" class="floating-logo">
		<img class="floating-logo__image" :src="logo.src" :alt="logo.alt" :title="logo.alt" />
	</div>

	<!-- 首屏加载遮罩：530ms 后淡出 -->
	<div id="page-loading" :class="{ 'is-done': !loading }" aria-hidden="true">
		<div id="page-loading__wrapper">
			<div id="page-loading__spinner">
				<div class="loading-orbit" id="loading-orbit-4"></div>
				<div class="loading-orbit" id="loading-orbit-3"></div>
				<div class="loading-orbit" id="loading-orbit-2"></div>
				<div class="loading-orbit" id="loading-orbit-1"></div>
			</div>
		</div>
	</div>

	<!-- 暗色模式下的星空背景 -->
	<canvas id="universe" ref="universeRef" aria-hidden="true"></canvas>

	<!-- 右上角社交坞（固定定位，和大标题左上的 logo 对称） -->
	<SocialDock />

	<div class="main">
		<SiteHeader />
		<MainContent />
		<SiteFooter />
	</div>

	<DonationDialog />
</template>

<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue'
	import SiteHeader from '@/components/main/SiteHeader.vue'
	import MainContent from '@/components/main/MainContent.vue'
	import SiteFooter from '@/components/main/SiteFooter.vue'
	import DonationDialog from '@/components/main/DonationDialog.vue'
	import SocialDock from '@/components/others/SocialDock.vue'
	import { siteConfig } from '@/site.config'
	import { preloadDonationCards } from '@/composables/useDonation'
	import { useTheme } from '@/composables/useTheme'
	import { useStarfield } from '@/effects/starfield'

	const { logo } = siteConfig

	const universeRef = ref<HTMLCanvasElement | null>(null)
	useStarfield(universeRef)

	const { isDark } = useTheme()
	const loading = ref(true)

	/**
	 * 左上角 Logo 只在桌面渲染。
	 * 不用 CSS 的 display:none —— 被隐藏的 <img> 在 Chromium 里仍可能去下载
	 * （实测 390px 下照样拉了这 21KB）。这里直接不创建元素，才是真的不下。
	 */
	const LOGO_QUERY = '(min-width: 1177px)'
	const showLogo = ref(false)
	let logoQuery: MediaQueryList | undefined
	const syncLogo = (event: MediaQueryList | MediaQueryListEvent): void => {
		showLogo.value = event.matches
	}

	onMounted(() => {
		logoQuery = window.matchMedia(LOGO_QUERY)
		syncLogo(logoQuery)
		logoQuery.addEventListener('change', syncLogo)

		window.setTimeout(() => {
			loading.value = false
		}, 530)

		// 赞赏卡提前取：等首屏加载遮罩收完、别跟首屏资源抢带宽。
		// 弹窗是 v-if 挂载的，不预取的话点开那一刻才开始下载，面板会先空一下。
		window.setTimeout(() => preloadDonationCards(isDark.value), 1400)
	})

	onBeforeUnmount(() => {
		logoQuery?.removeEventListener('change', syncLogo)
	})
</script>
