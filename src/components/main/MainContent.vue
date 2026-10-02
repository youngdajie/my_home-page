<script setup lang="ts">
	import { useTemplateRef } from 'vue'
	import { siteConfig } from '@/site.config'
	import { useSubsiteLayout } from '@/composables/useSubsiteLayout'
	import { vReveal } from '@/directives/reveal'

	const { subsites, skills, miniProgram } = siteConfig

	const gridRef = useTemplateRef<HTMLElement>('subsiteGrid')
	const collapseRef = useTemplateRef<HTMLElement>('subsiteCollapse')

	const { columns, isOpen, toggle } = useSubsiteLayout(subsites.items, { gridRef, collapseRef })

	/** 卡片强调色透传给 CSS 变量 */
	const accentStyle = (accent?: string): Record<string, string> =>
		accent ? { '--card-accent': accent } : {}

	/**
	 * 把光标位置写进卡片局部坐标，驱动 ::after 的品牌色光斑。
	 * 只在有指针的悬浮设备上跑；触摸设备通常不会触发 pointermove。
	 */
	const trackPointer = (event: PointerEvent): void => {
		if (event.pointerType === 'touch') return
		const el = event.currentTarget as HTMLElement | null
		if (!el) return
		const rect = el.getBoundingClientRect()
		el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
		el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
	}
</script>

<template>
	<div class="content">
		<!-- 子网站 -->
		<h2
			class="section-title section-title--collapsible"
			role="button"
			tabindex="0"
			:aria-expanded="isOpen"
			@click="toggle"
			@keydown.enter.prevent="toggle"
			@keydown.space.prevent="toggle"
		>
			<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
				<path
					d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"
				/>
			</svg>
			{{ subsites.title }}
			<span class="section-title__toggle" :class="{ 'is-open': isOpen }"></span>
		</h2>

		<div ref="subsiteCollapse" class="subsite-collapse">
			<div ref="subsiteGrid" class="subsite-grid">
				<div v-for="(column, columnIndex) in columns" :key="columnIndex" class="subsite-grid__column">
					<a
						v-for="item in column"
						:key="item.id"
						v-reveal
						class="subsite-card"
						:data-id="item.id"
						:style="accentStyle(item.accent)"
						:href="item.url"
						target="_blank"
						rel="noopener noreferrer"
						@pointerenter="trackPointer"
						@pointermove="trackPointer"
					>
						<span class="subsite-card__arrow" aria-hidden="true">
							<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
								<path d="M3.6 10.4 10.4 3.6M10.4 3.6H5.1M10.4 3.6v5.3" />
							</svg>
						</span>
						<div class="subsite-card__body">
							<h3 class="subsite-card__title">{{ item.title }}</h3>
							<!-- 文案来自 site.config.ts，属于自维护内容 -->
							<p class="subsite-card__description" v-html="item.desc"></p>
						</div>
					</a>
				</div>
			</div>
		</div>

		<!-- 技能 -->
		<h2 class="section-title dark-mode-hidden">
			<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
				<path
					d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z"
				/>
			</svg>
			{{ skills.title }}
		</h2>
		<div class="skills-panel dark-mode-hidden">
			<!-- 前往 https://skillicons.dev/ 生成，一个 PC 端一个移动端，区别是一行的个数 -->
			<img id="skills-desktop-image" :src="skills.desktopSrc" alt="技术栈" />
			<img id="skills-mobile-image" :src="skills.mobileSrc" alt="技术栈" />
		</div>

		<!-- 小程序 / 公众号 -->
		<h2 class="section-title dark-mode-hidden below-1176-hidden">
			<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
				<path d="M588.8 588.8m-281.6 0a281.6 281.6 0 1 0 563.2 0 281.6 281.6 0 1 0-563.2 0Z" />
				<path
					d="M803.84 768l199.68 199.68c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0L768 803.84c-81.92 71.68-189.44 117.76-307.2 117.76-256 0-460.8-204.8-460.8-460.8s204.8-460.8 460.8-460.8 460.8 204.8 460.8 460.8c0 117.76-46.08 225.28-117.76 307.2zM460.8 870.4c225.28 0 409.6-184.32 409.6-409.6s-184.32-409.6-409.6-409.6-409.6 184.32-409.6 409.6 184.32 409.6 409.6 409.6z"
				/>
			</svg>
			{{ miniProgram.title }}
		</h2>
		<div class="mini-program-panel dark-mode-hidden below-1176-hidden">
			<img class="mini-program-preview" :src="miniProgram.image" :alt="miniProgram.alt" />
		</div>
	</div>
</template>

<style scoped>
	.section-title--collapsible {
		cursor: pointer;
		user-select: none;
	}

	.section-title--collapsible:focus-visible {
		outline: 2px solid var(--accent-blue);
		outline-offset: 4px;
		border-radius: 8px;
	}

	.section-title__toggle {
		margin: 0 0 0 3px;
		display: inline-block;
		width: 0;
		height: 0;
		border-left: 16px solid currentColor;
		border-top: 9px solid transparent;
		border-bottom: 9px solid transparent;
		transition: transform 0.2s;
	}

	.section-title__toggle.is-open {
		transform: rotate(90deg);
	}

	.subsite-collapse {
		overflow: hidden;
		transition: height 0.45s ease;
	}

	.mini-program-panel {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 80%;
	}
</style>
