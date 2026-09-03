<template>
	<div class="donation-dialog">
		<div class="donation-dialog__panel">
			<img class="donation-dialog__qr" src="../../assets/public/wxpay.png" alt="求打赏">
		</div>
		<div @click="closeDialog" class="donation-dialog__close">
			<svg t="1705548649866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="4359" width="22px" height="22px">
				<path
					d="M617.92 516.096l272 272-101.824 101.824-272-272-272 272-101.856-101.824 272-272-275.008-275.04L241.056 139.2l275.04 275.04 275.04-275.04 101.824 101.824-275.04 275.04z"
					fill="#ffffff" p-id="4360" data-spm-anchor-id="a313x.search_index.0.i0.b8803a81utmG85">
				</path>
			</svg>
		</div>
	</div>
</template>

<script setup>
	// 辅助函数：移除类名
	const removeClass = (selector, className) => {
		const elements = document.querySelectorAll(selector);
		elements.forEach(element => {
			element.classList.remove(className);
		});
	}

	// 关闭弹窗函数
	const closeDialog = () => {
		// 移除 is-open 类来关闭弹窗
		removeClass(".donation-dialog", "is-open");
		removeClass(".donation-dialog__panel", "is-open");
	}
</script>
