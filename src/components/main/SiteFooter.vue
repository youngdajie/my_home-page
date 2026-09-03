<template>
	<footer>
		<div class="footer__info">
			小杰 © 2019-2026<br><a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2021020461号-2</a><br><a
				href="https://beian.mps.gov.cn/#/query/webSearch?code=51052102510649"
				target="_blank">川公网安备51052102510649号</a>
			<br>
			本人工作特殊，联系不上，请见谅！
			<br>
			浏览器建议 PC | <a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">Chrome</a>，手机 | <a
				href="https://viayoo.com/zh-cn/" target="_blank">Via</a><br><a
				href="https://ipv6test.wcode.net/?q=www.yangjie.site&ipv6-only=1" target="_blank">支持 IPv6</a>
		</div>
		<div class="footer__badges">
			<li>
				<a href="https://www.foreverblog.cn/go.html" target="_blank"><img src="/src/assets/images/222.png"
						alt="虫洞" title="虫洞"></a>
				<a href="https://console.cloud.tencent.com/edgeone/makers" target="_blank"><img
						src="/src/assets/images/txy.png" alt="腾讯云" title="腾讯云"></a>
			</li>
		</div>
	</footer>
</template>

<style>
.footer__info {
	width: 60%;
}

.footer__badges li a img {
	width: 122px;
}

footer {
	display: flex;
	color: var(--main-text-color);
	font-size: 16px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin: 100px 0 0 0;
}

.footer__badges li {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

@media screen and (max-width: 1176px) {
	.below-1176-hidden {
		display: none;
	}

	.below-1176-hidden img {
		display: none;
	}

	.footer__info {
		width: 100%;
	}

	.footer__badges {
		display: none;
	}
}
</style>
