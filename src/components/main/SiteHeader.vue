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

		<nav class="social-links" :aria-label="social.title">
			<template v-for="link in links" :key="link.tip">
				<a
					v-if="!link.isButton"
					class="social-link"
					:style="accentStyle(link.accent)"
					:data-tip="link.tip"
					:aria-label="link.tip"
					:href="link.href"
					:target="link.target"
					:rel="link.rel"
					@click="link.activate"
				>
					<AppIcon :name="link.icon" />
					<span class="social-link__caret" aria-hidden="true"></span>
				</a>
				<button
					v-else
					type="button"
					class="social-link"
					:class="{ 'is-busy': busy && link.icon === 'Refresh' }"
					:style="accentStyle(link.accent)"
					:data-tip="link.tip"
					:aria-label="link.tip"
					@click="link.activate"
				>
					<AppIcon :name="link.icon" />
					<span class="social-link__caret" aria-hidden="true"></span>
				</button>
			</template>
			<span class="social-links__divider" aria-hidden="true"></span>
			<DarkModeToggle />
		</nav>
	</header>
</template>

<script setup lang="ts">
	import { onBeforeUnmount, onMounted, ref } from 'vue'
	import Typed from 'typed.js'
	import AppIcon from '@/components/others/AppIcon.vue'
	import DarkModeToggle from '@/components/others/DarkModeToggle.vue'
	import { siteConfig } from '@/site.config'
	import { useSocialLinks } from '@/composables/useSocialLinks'

	const { hero, social } = siteConfig
	const headline = hero.headline
	const { links, busy } = useSocialLinks()

	/** 品牌色透传给 CSS 变量，悬浮态填充/光晕都用它 */
	const accentStyle = (accent: string): Record<string, string> => ({ '--social-accent': accent })

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
