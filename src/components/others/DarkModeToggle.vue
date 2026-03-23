<!-- components/DarkModeToggle.vue -->
<template>
	<button class="dark-mode-toggle" @click="toggleDarkMode" aria-label="切换深色/浅色模式" data-tip="昼夜切换">
		<Transition name="fade-scale" mode="out-in">
			<svg v-if="isDark" key="moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
				fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
			<svg v-else key="sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
				fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
	</button>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';

	const isDark = ref(false);

	function toggleDarkMode() {
		const html = document.documentElement;
		isDark.value = !isDark.value;

		if (isDark.value) {
			html.classList.add('dark');
			localStorage.setItem('color-scheme', 'dark');
		} else {
			html.classList.remove('dark');
			localStorage.setItem('color-scheme', 'light');
		}
	}

	onMounted(() => {
		const saved = localStorage.getItem('color-scheme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const shouldUseDark = saved === 'dark' || (!saved && prefersDark);
		isDark.value = shouldUseDark;
		if (shouldUseDark) {
			document.documentElement.classList.add('dark');
		}
	});
</script>

<style scoped>
	.dark-mode-toggle {
		background: var(--project-item-bg-color);
		border: none;
		width: 48px;
		height: 32px;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--project-item-left-title-color);
		transition: background-color 0.2s;
	}

	.dark-mode-toggle:hover {
		background: transparent;
	}

	/* 动画：淡入 + 缩放 */
	.fade-scale-enter-active,
	.fade-scale-leave-active {
		transition: all 0.25s ease;
	}

	.fade-scale-enter-from {
		opacity: 0;
		transform: scale(0.8);
	}

	.fade-scale-leave-to {
		opacity: 0;
		transform: scale(1.2);
	}
</style>