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

	/**
	 * Fisher-Yates 洗牌：每进一次页面，语录顺序都不一样。
	 *
	 * 为什么要打乱：现在有 38 条，typeSpeed 100ms + backDelay 3000ms 跑完一轮要
	 * 三分半，而访客往往只待几十秒 —— 不打乱的话，所有人每次都只看到开头那几条，
	 * 后面的等于不存在。
	 *
	 * 只在挂载时洗一次（不是每轮洗）：Typed 循环的是同一个数组实例，
	 * 中途换顺序反而会让正在打字的那条被顶掉。
	 */
	const shuffle = <T>(list: readonly T[]): T[] => {
		const out = [...list]
		for (let i = out.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			const tmp = out[i]
			out[i] = out[j]
			out[j] = tmp
		}
		return out
	}

	onMounted(() => {
		if (!typingRef.value) return
		typed = new Typed(typingRef.value, {
			strings: shuffle(hero.quotes),
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
