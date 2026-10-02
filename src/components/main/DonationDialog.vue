<template>
	<Transition name="dialog">
		<div
			v-if="isOpen"
			class="donation-dialog"
			role="dialog"
			aria-modal="true"
			:aria-label="donation.tip"
			@click.self="close"
		>
			<div class="donation-dialog__panel">
				<img class="donation-dialog__qr" :src="currentImage.src" :alt="currentImage.alt" />
			</div>
			<button type="button" class="donation-dialog__close" aria-label="关闭" @click="close">
				<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="22" height="22" aria-hidden="true">
					<path
						d="M617.92 516.096l272 272-101.824 101.824-272-272-272 272-101.856-101.824 272-272-275.008-275.04L241.056 139.2l275.04 275.04 275.04-275.04 101.824 101.824-275.04 275.04z"
						fill="#ffffff"
					/>
				</svg>
			</button>
		</div>
	</Transition>
</template>

<script setup lang="ts">
	import { computed, onBeforeUnmount, watch } from 'vue'
	import { siteConfig } from '@/site.config'
	import { useDonation } from '@/composables/useDonation'

	const donation = siteConfig.donation
	const { isOpen, activeIndex, close } = useDonation()

	const currentImage = computed(() => donation.images[activeIndex.value] ?? donation.images[0])

	const onKeydown = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') close()
	}

	watch(isOpen, (open) => {
		// 打开时锁滚动，关闭时恢复
		document.documentElement.style.overflow = open ? 'hidden' : ''
		if (open) {
			window.addEventListener('keydown', onKeydown)
		} else {
			window.removeEventListener('keydown', onKeydown)
		}
	})

	onBeforeUnmount(() => {
		document.documentElement.style.overflow = ''
		window.removeEventListener('keydown', onKeydown)
	})
</script>

<style scoped>
	.donation-dialog {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100000;
		background: #0000005c;
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.donation-dialog__panel {
		width: 80%;
		max-width: 400px;
		min-height: 300px;
		background-color: #000;
		border-radius: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.donation-dialog__qr {
		width: 100%;
		height: 100%;
		display: block;
	}

	.donation-dialog__close {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
		width: 60px;
		background: var(--accent-blue);
		border: none;
		cursor: pointer;
		margin-top: 30px;
		border-radius: 50%;
		transition: transform 0.25s ease, filter 0.25s ease;
	}

	.donation-dialog__close:hover {
		transform: rotate(90deg) scale(1.06);
		filter: brightness(1.1);
	}

	.donation-dialog__close:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}

	/* 弹窗进出场 */
	.dialog-enter-active,
	.dialog-leave-active {
		transition: opacity 0.3s linear;
	}

	.dialog-enter-active .donation-dialog__panel,
	.dialog-leave-active .donation-dialog__panel {
		transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.dialog-enter-from,
	.dialog-leave-to {
		opacity: 0;
	}

	.dialog-enter-from .donation-dialog__panel,
	.dialog-leave-to .donation-dialog__panel {
		opacity: 0;
		transform: translateY(50px) scale(0.9);
	}
</style>
