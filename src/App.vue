<template>
	<div class="page-background"></div>

	<div class="floating-logo dark-mode-hidden below-1176-hidden">
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

	<div class="main">
		<SiteHeader />
		<MainContent />
		<SiteFooter />
	</div>

	<DonationDialog />
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import SiteHeader from '@/components/main/SiteHeader.vue'
	import MainContent from '@/components/main/MainContent.vue'
	import SiteFooter from '@/components/main/SiteFooter.vue'
	import DonationDialog from '@/components/main/DonationDialog.vue'
	import { siteConfig } from '@/site.config'
	import { useStarfield } from '@/effects/starfield'

	const { logo } = siteConfig

	const universeRef = ref<HTMLCanvasElement | null>(null)
	useStarfield(universeRef)

	const loading = ref(true)

	onMounted(() => {
		window.setTimeout(() => {
			loading.value = false
		}, 530)
	})
</script>
