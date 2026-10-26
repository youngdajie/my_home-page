<template>
	<Transition name="dialog">
		<!--
			这里用 v-show 而不是 v-if，是实测后的结论，别改回去：
			  v-if 时 <img> 是「打开那一刻才被创建」，浏览器要重新走一遍
			  取图 → 解析 SVG → 光栅化。哪怕字节早就躺在 Service Worker 的
			  Cache Storage 里，也要付一次 SW 中转（实测 194ms）+ 180ms 淡入，
			  用户看到的就是「券先出来、码后到」。
			  v-show 让 <img> 在页面加载时就挂上，ImageResource 一直活着，
			  打开时只是把 display 从 none 换回 flex，没有任何取图动作。
		-->
		<div
			v-show="isOpen"
			class="donation-dialog"
			role="dialog"
			aria-modal="true"
			:aria-label="donation.tip"
			@click.self="close"
		>
			<!--
				面板本身不是「相框」，就是那张赞赏券的形状：
				底色取券纸的中间调，图片还没到之前看到的是一张空券，
				而不是一块黑底（原来这里写死 #000，首帧就是一块纯黑）。
			-->
			<div class="donation-dialog__panel" :style="panelStyle">
				<!-- 两张都常驻：切主题时只是换显示，不会触发新的取图 -->
				<img
					class="donation-dialog__qr donation-dialog__qr--light"
					:src="currentImage.src"
					:alt="currentImage.alt"
					:width="currentImage.width"
					:height="currentImage.height"
				/>
				<img
					v-if="currentImage.darkSrc"
					class="donation-dialog__qr donation-dialog__qr--dark"
					:src="currentImage.darkSrc"
					:alt="currentImage.alt"
					:width="currentImage.width"
					:height="currentImage.height"
				/>
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

	/** 券的宽高比喂给 CSS，占位块和实体保持同一个比例和圆角 */
	const panelStyle = computed(() => ({
		'--donation-ratio': (currentImage.value.width / currentImage.value.height).toFixed(4),
		'--donation-radius-x': `${((28 / currentImage.value.width) * 100).toFixed(2)}%`,
		'--donation-radius-y': `${((28 / currentImage.value.height) * 100).toFixed(2)}%`,
	}))

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
		/* 三个约束取最小：不超过 92vw、不超过 400px、也不超过「视口高度减去
		   关闭按钮和上下留白」换算出来的宽度 —— 矮窗口/横屏时整张券等比缩小，
		   不会把关闭按钮顶到屏幕外。两行 width 是给不认识 svh 的浏览器兜底。 */
		width: min(92vw, 400px, calc((100vh - var(--donation-reserve, 150px)) * var(--donation-ratio, 0.7722)));
		width: min(92vw, 400px, calc((100svh - var(--donation-reserve, 150px)) * var(--donation-ratio, 0.7722)));
		aspect-ratio: var(--donation-ratio, 0.7722);
		border-radius: var(--donation-radius-x, 7%) / var(--donation-radius-y, 5.4%);
		background-color: var(--donation-paper);
		display: flex;
		overflow: hidden;
	}

	.donation-dialog__qr {
		width: 100%;
		height: 100%;
		display: block;
		/* 投影放在 CSS 而不是画进 SVG：drop-shadow 跟着图形的 alpha 走，
		   所以两侧缺口也会在影子上留出来，而且不占画布边缘。 */
		filter: drop-shadow(0 16px 30px rgba(9, 20, 38, 0.26));
	}

	/* 亮/暗各挂一张，切主题只是换显示。刻意不给 opacity 加过渡：
	   二维码淡入看起来像「加载」，反而像卡了 —— 要么在，要么不在。
	   注意：这里必须写普通的 `html.dark .foo`，别套 :global()——
	   Vue 的 scoped 编译只给最后一个选择器加 data-v，而 `:global(A) B`
	   会被编成 `A` 一个裸选择器（踩过：编出了 `html.dark{display:none}`）。 */
	.donation-dialog__qr--dark {
		display: none;
	}

	html.dark .donation-dialog__qr--light {
		display: none;
	}

	html.dark .donation-dialog__qr--dark {
		display: block;
		filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.55));
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

	/* 矮屏（横屏手机、小窗）收一点按钮和留白，给券留高度 */
	@media (max-height: 620px) {
		.donation-dialog__panel {
			--donation-reserve: 104px;
		}

		.donation-dialog__close {
			height: 46px;
			width: 46px;
			margin-top: 16px;
		}
	}
</style>
