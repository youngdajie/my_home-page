/// <reference types="vite/client" />

/**
 * 让没有装 Volar 的编辑器也能识别 .vue 单文件组件。
 * vue-tsc 会优先解析真实的 .vue 文件，这里的声明只作为兜底。
 */
declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
	export default component
}
