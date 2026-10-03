<template>
	<header>
		<h1 class="hero-title">
			{{ headline.lines[0] }}<br />
			{{ headline.lines[1] }}
			<span class="gradient-text">{{ headline.name }}</span>
		</h1>

		<div class="hero-description">
			<template v-for="(segment, index) in hero.description" :key="index">
				<a
					v-if="segment.href"
					:href="segment.href"
					:target="segment.external ? '_blank' : undefined"
					:rel="segment.external ? 'noopener noreferrer' : undefined"
					>{{ segment.text }}</a
				>
				<span v-else-if="segment.accent" class="purple-text">{{ segment.text }}</span>
				<template v-else>{{ segment.text }}</template>
			</template>
		</div>

		<div class="hero-description typed-quote">
			<!-- Typed.js 的挂载点，语录来自 site.config.ts -->
			<p id="typing-text" ref="typingRef"></p>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue'
	import Typed from 'typed.js'
	import { siteConfig } from '@/site.config'

	const { hero } = siteConfig
	const headline = hero.headline

	const typingRef = ref<HTMLElement | null>(null)
	let typed: Typed | null = null

	onMounted(() => {
		if (!typingRef.value) return
		typed = new Typed(typingRef.value, {
			strings: [...hero.quotes],
			typeSpeed: 100,
			startDelay: 500,
			showCursor: true,
			loop: true,
			// 注意：typed.js v3 已没有 loopDelay 选项（旧配置里写了但不生效），
			// 循环之间的停顿由 backDelay 控制。
			backDelay: 3000,
		})
	})

	onBeforeUnmount(() => {
		typed?.destroy()
		typed = null
	})
</script>

<style scoped>
	#typing-text {
		display: inline;
		margin-right: 10px;
		font-size: 16px;
	}

	.typed-quote {
		height: 64px;
	}
</style>
