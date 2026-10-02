<template>
	<button
		type="button"
		class="social-link social-link--theme"
		aria-label="切换深色/浅色模式"
		:aria-pressed="isDark"
		data-tip="昼夜切换"
		@click="toggle"
	>
		<span class="social-link__icon">
			<Transition name="fade-scale" mode="out-in">
				<svg
					v-if="isDark"
					key="moon"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
				<svg
					v-else
					key="sun"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="5" />
					<line x1="12" y1="1" x2="12" y2="3" />
					<line x1="12" y1="21" x2="12" y2="23" />
					<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
					<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
					<line x1="1" y1="12" x2="3" y2="12" />
					<line x1="21" y1="12" x2="23" y2="12" />
					<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
					<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
				</svg>
			</Transition>
		</span>
		<span class="social-link__caret" aria-hidden="true"></span>
	</button>
</template>

<script setup lang="ts">
	import { useTheme } from '@/composables/useTheme'

	const { isDark, toggle } = useTheme()
</script>

<style scoped>
	.social-link--theme {
		/* 颜色 / 圆角 / 尺寸统一由 styles/social.css 控制，这里只管切换动画 */
		padding: 0;
	}

	.social-link__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
	}

	.social-link__icon svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.fade-scale-enter-active,
	.fade-scale-leave-active {
		transition: opacity 0.22s ease, transform 0.22s ease;
	}

	.fade-scale-enter-from {
		opacity: 0;
		transform: scale(0.7) rotate(-45deg);
	}

	.fade-scale-leave-to {
		opacity: 0;
		transform: scale(1.25) rotate(45deg);
	}
</style>
