<template>
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
</template>

<script setup lang="ts">
	import AppIcon from '@/components/others/AppIcon.vue'
	import DarkModeToggle from '@/components/others/DarkModeToggle.vue'
	import { siteConfig } from '@/site.config'
	import { useSocialLinks } from '@/composables/useSocialLinks'

	const { social } = siteConfig
	const { links, busy } = useSocialLinks()

	/** 品牌色透传给 CSS 变量，悬浮态填充/光晕都用它 */
	const accentStyle = (accent: string): Record<string, string> => ({ '--social-accent': accent })
</script>
