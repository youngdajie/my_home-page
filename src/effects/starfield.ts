import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

/**
 * 极简星空背景，由原 src/assets/dark.js 迁移并重写为 TS。
 *
 * 相比原版的改动：
 *  - 支持 devicePixelRatio，高分屏不再糊
 *  - 只在暗色模式下跑 requestAnimationFrame，浅色模式彻底停机（原版会空转）
 *  - 组件卸载时注销监听、取消动画帧
 */

const SPEED = 0.05
const DENSITY = 0.216
const GIANT_COLOR = '180,184,240'
const STAR_COLOR = '226,225,142'
const COMET_COLOR = '226,225,224'

/** 彗星（长尾）延迟 50ms 后才可能出现，避免首屏闪出长尾 */
const COMET_DELAY = 50

const rand = (min: number, max: number): number => Math.random() * (max - min) + min
const hit = (percent: number): boolean => Math.floor(1000 * Math.random()) + 1 < 10 * percent

class Star {
	x = 0
	y = 0
	radius = 0
	dx = 0
	dy = 0
	opacity = 0
	opacityThreshold = 0
	fadeStep = 0
	fadingIn = true
	fadingOut: boolean | null = null
	giant = false
	comet = false

	constructor(private readonly allowComet: () => boolean) {
		this.reset()
	}

	reset(): void {
		const width = window.innerWidth
		const height = window.innerHeight

		this.giant = hit(3)
		this.comet = !this.giant && this.allowComet() && hit(10)
		const boost = this.comet ? 1 : 0

		this.x = rand(0, width - 10)
		this.y = rand(0, height)
		this.radius = rand(1.1, 2.6)
		this.dx = rand(SPEED, 6 * SPEED) + boost * SPEED * rand(50, 120) + 2 * SPEED
		this.dy = -rand(SPEED, 6 * SPEED) - boost * SPEED * rand(50, 120)
		this.fadingOut = null
		this.fadingIn = true
		this.opacity = 0
		this.opacityThreshold = rand(0.2, 1 - 0.4 * boost)
		this.fadeStep = rand(0.0005, 0.002) + 0.001 * boost
	}

	fadeIn(): void {
		if (!this.fadingIn) return
		this.fadingIn = this.opacity <= this.opacityThreshold
		this.opacity += this.fadeStep
	}

	fadeOut(): void {
		if (!this.fadingOut) return
		this.opacity -= this.fadeStep / 2
		this.fadingOut = this.opacity >= 0
		if (this.x > window.innerWidth || this.y < 0) {
			this.fadingOut = false
			this.reset()
		}
	}

	move(): void {
		this.x += this.dx
		this.y += this.dy
		if (this.fadingOut === false) this.reset()
		if (this.x > window.innerWidth - window.innerWidth / 4 || this.y < 0) {
			this.fadingOut = true
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath()

		if (this.giant) {
			ctx.fillStyle = `rgba(${GIANT_COLOR},${this.opacity})`
			ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false)
		} else if (this.comet) {
			ctx.fillStyle = `rgba(${COMET_COLOR},${this.opacity})`
			ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false)
			for (let tail = 0; tail < 30; tail++) {
				ctx.fillStyle = `rgba(${COMET_COLOR},${this.opacity - (this.opacity / 20) * tail})`
				ctx.rect(this.x - (this.dx / 4) * tail, this.y - (this.dy / 4) * tail - 2, 2, 2)
				ctx.fill()
			}
		} else {
			ctx.fillStyle = `rgba(${STAR_COLOR},${this.opacity})`
			ctx.rect(this.x, this.y, this.radius, this.radius)
		}

		ctx.closePath()
		ctx.fill()
	}
}

export const useStarfield = (canvasRef: Ref<HTMLCanvasElement | null>): void => {
	const { isDark } = useTheme()

	let ctx: CanvasRenderingContext2D | null = null
	let stars: Star[] = []
	let frameId = 0
	let running = false
	let cometsReady = false
	let cometTimer = 0
	let viewWidth = 0
	let viewHeight = 0

	const allowComet = (): boolean => cometsReady

	const resize = (): void => {
		const canvas = canvasRef.value
		if (!canvas) return

		viewWidth = window.innerWidth
		viewHeight = window.innerHeight
		const dpr = Math.min(window.devicePixelRatio || 1, 2)

		canvas.width = Math.floor(viewWidth * dpr)
		canvas.height = Math.floor(viewHeight * dpr)
		ctx = canvas.getContext('2d')
		ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

		// 粒子数只跟初始宽度挂钩，跟原版一致，避免 resize 时画面突变
		if (!stars.length) {
			const count = Math.floor(DENSITY * viewWidth)
			stars = Array.from({ length: count }, () => new Star(allowComet))
		}
	}

	const draw = (): void => {
		if (!ctx) return
		ctx.clearRect(0, 0, viewWidth, viewHeight)
		for (const star of stars) {
			star.move()
			star.fadeIn()
			star.fadeOut()
			star.draw(ctx)
		}
	}

	const loop = (): void => {
		if (!running) return
		draw()
		frameId = window.requestAnimationFrame(loop)
	}

	const start = (): void => {
		if (running || !stars.length) return
		running = true
		frameId = window.requestAnimationFrame(loop)
	}

	const stop = (): void => {
		running = false
		if (frameId) window.cancelAnimationFrame(frameId)
		frameId = 0
	}

	const syncWithTheme = (dark: boolean): void => {
		if (dark) {
			resize()
			start()
		} else {
			stop()
		}
	}

	onMounted(() => {
		cometTimer = window.setTimeout(() => {
			cometsReady = true
		}, COMET_DELAY)

		resize()
		window.addEventListener('resize', resize, false)
		syncWithTheme(isDark.value)
	})

	watch(isDark, (dark) => syncWithTheme(dark))

	onBeforeUnmount(() => {
		stop()
		window.clearTimeout(cometTimer)
		window.removeEventListener('resize', resize, false)
	})
}
