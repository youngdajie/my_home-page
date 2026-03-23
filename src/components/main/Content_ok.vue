<script setup>
	import {
		ref
	} from 'vue'

	const isOpen = ref(false)

	const toggle = () => {
		isOpen.value = !isOpen.value
	}
</script>

<template>
	<content>
		<!-- 内容开始 -->
		<div class="title collapse-header" @click="isOpen = !isOpen">
			<svg t="1705257422086" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="1891" width="26px" height="26px">
				<path
					d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z m-277.333334-213.333333h-384v320h213.333334v-170.666667h170.666666v-149.333333z m0 213.333333h-106.666666v106.666667h106.666666v-106.666667z"
					p-id="1892"></path>
			</svg> 子网站 / Subsites <div class="toggle-icon-title" :class="{ 'open': !isOpen }"></div>
		</div>
		<div v-show="!isOpen">
			<div class="projectList">
				<!-- 项目列表开始 -->
				<!---->
				<!-- 				<p class="projectList_p"><code>IPV 4/6</code><a href="https://ipw.cn" target="_blank"
						style=" right: 0; position: absolute; padding-right: 10px;">网络自检🔍</a></p> -->
				<!---->
				<a class="projectItem" target="_blank" href="https://box.yangjie.site">
					<!-- 项目项开始 -->
					<div class="projectItemLeft">
						<h1>杂记</h1>
						<p>已迁到 hexo，折腾不动了，长期耕耘，不瞎搞了。<br><br>用腾讯云 CDN 加速，全站开了 HTTP 缓存的（20天强缓存），之后的访问就会快到飞起</p>
					</div>
					<!-- 项目项结束 -->
				</a>
				<!---->
				<a class="projectItem" target="_blank" href="https://nav.yangjie.site">
					<!-- 项目项开始 -->
					<div class="projectItemLeft projectItemLeft_one">
						<h1>导航</h1>
						<p class="projectItemLeft_other"><s>做网站的起点，一切的开始。很久没动了，等找个时间再好好优化一下吧，呜呜</s></p>
						<p class="other_one" style="font-size: 20px;">项目封存
						</p>
					</div>
					<!-- 项目项结束 -->
				</a>
				<a class="projectItem" target="_blank" href="https://foot.yangjie.site/">
					<!-- 项目项开始 -->
					<div class="projectItemLeft">
						<h1>足迹</h1>
						<p>还是想在外面多走走，祖国的大好河山还是看得太少了</p>
					</div>
					<!-- 项目项结束 -->
				</a>
				<a class="projectItem" target="_blank" href="https://yuanshen.yangjie.site/">
					<!-- 项目项开始 -->
					<div class="projectItemLeft">
						<h1>原神，启动！</h1>
						<p>大佬开源的 web音乐，我用来放原神的 BGM 了</p>
					</div>
					<!-- 项目项结束 -->
				</a>
				<a class="projectItem" target="_blank" href="https://1p.yangjie.site">
					<!-- 项目项开始 -->
					<div class="projectItemLeft">
						<h1>面板管理</h1>
						<p>层层加密，重兵把守，外人休闯！</p>
					</div>
					<!-- 项目项结束 -->
				</a>
				<!-- <hr
					style="position: relative;margin: 40px auto;border: 4px dashed #1296db;width: calc(100% - 32%);border-radius: 3px;"> -->
				<!---->
				<a class="projectItem" target="_blank" href="https://pan.yangjie.site">
					<!-- 项目项开始 -->
					<div class="projectItemLeft">
						<h1>OpenList</h1>
						<p>OpenList 是一个支持多种存储的文件列表程序🗂️，是一个有韧性、长期治理、社区驱动的 AList 分支🔀，旨在防御基于信任的开源攻击🛡️。<br><br>搭建在腾讯轻量服务器上</p>
					</div>
					<!-- 项目项结束 -->
				</a>
				<!---->
			</div>
		</div>
		<!-- 项目列表结束 -->
		<div class="title dark_none">
			<svg t="1705257823317" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="7833" width="26px" height="26px">
				<path
					d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z"
					p-id="7834"></path>
			</svg> 技能 / Skills
		</div>
		<div class="skill dark_none">
			<!-- 技能开始 -->
			<!-- 前往https://skillicons.dev/
            生成，一个pc端，一个移动端，区别是一行的个数 -->
			<img id="skillPc" src="../../assets/images/skillPc.svg" alt="" srcset="">
			<img id="skillWap" src="../../assets/images/skillWap.svg" alt="" srcset="">
		</div>
		<div class="title dark_none min_1176_none">
			<svg t="1749913207810" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
				p-id="6167" id="mx_n_1749913207811" width="26px" height="26px"
				xmlns:xlink="http://www.w3.org/1999/xlink">
				<path d="M588.8 588.8m-281.6 0a281.6 281.6 0 1 0 563.2 0 281.6 281.6 0 1 0-563.2 0Z" fill="#000000"
					p-id="6168"></path>
				<path
					d="M803.84 768l199.68 199.68c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0L768 803.84c-81.92 71.68-189.44 117.76-307.2 117.76-256 0-460.8-204.8-460.8-460.8s204.8-460.8 460.8-460.8 460.8 204.8 460.8 460.8c0 117.76-46.08 225.28-117.76 307.2zM460.8 870.4c225.28 0 409.6-184.32 409.6-409.6s-184.32-409.6-409.6-409.6-409.6 184.32-409.6 409.6 184.32 409.6 409.6 409.6z"
					fill="#000000" p-id="6169" data-spm-anchor-id="a313x.search_index.0.i10.117c3a81prSnSL" class="">
				</path>
			</svg> 小程序 / 公众号
		</div>
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 80%;"
			class="dark_none min_1176_none">
			<img class="xiaochengxu-light-dark-background" src="../../assets/images/1.png" alt="小程序">
		</div>

		<!-- 技能结束 -->
	</content>
	<!-- 内容结束 -->
</template>

<style scoped>
	.collapse-header {
		cursor: pointer;
	}

	.toggle-icon-title {
		margin: 0 0 0 3px;
		display: inline-block;
		width: 0;
		height: 0;
		border-left: 16px solid currentColor;
		border-top: 9px solid transparent;
		border-bottom: 9px solid transparent;
		transition: transform 0.2s;
	}

	.toggle-icon-title.open {
		transform: rotate(90deg);
	}

	.projectList_p {
		font-size: 20px;
		position: relative;
		z-index: 10;
		width: 100%;
		height: 36px;
		display: block;

	}

	.projectList_p code::before {
		display: inline-block;
		transform: rotate(-2deg) translateX(-50%);
		position: absolute;
		opacity: 0.3;
		content: ' ';
		width: 86px;
		height: 80%;
		left: 32px;
		z-index: -1;
		border-radius: 0.4rem;
		background-color: #1296db;
	}

	.projectList_p a:hover {
		color: #1296db;
	}

	/* 二妹web */
	.yang2s_button button {
		position: relative;
		padding: 15px 45px;
		background: #fec195;
		font-size: 17px;
		font-weight: 500;
		color: #181818;
		cursor: pointer;
		border: 1px solid #fec195;
		border-radius: 8px;
		filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2));
		animation: wind 2s ease-in-out infinite;
	}

	@keyframes wind {
		0% {
			background-position: 0% 50%;
		}

		0% {
			background-position: 50% 100%;
		}

		0% {
			background-position: 0% 50%;
		}
	}

	.yang2s_button .icon-1 {
		position: absolute;
		top: 0;
		right: 0;
		width: 25px;
		transform-origin: 0 0;
		transform: rotate(10deg);
		transition: all 0.1s ease-in-out;
		filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3));
		animation: slay-1 3s cubic-bezier(0.52, 0, 0.58, 1) infinite;
		transform: rotate(10deg);
		fill: #299200;
	}

	@keyframes slay-1 {
		0% {
			transform: rotate(10deg);
		}

		50% {
			transform: rotate(-5deg);
		}

		100% {
			transform: rotate(10deg);
		}
	}

	.yang2s_button .icon-2 {
		position: absolute;
		top: 0;
		left: 25px;
		width: 12px;
		transform-origin: 50% 0;
		transform: rotate(10deg);
		transition: all .1s ease-in-out;
		filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.5));
		animation: slay-2 3s cubic-bezier(0.52, 0, 0.58, 1) 1s infinite;
		transform: rotate(0);
		fill: #328a0f;
	}


	@keyframes slay-2 {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(15deg);
		}

		100% {
			transform: rotate(0);
		}
	}

	.yang2s_button .icon-3 {
		position: absolute;
		top: 0;
		left: 0;
		width: 18px;
		transform-origin: 50% 0;
		transform: rotate(-5deg);
		transition: all .1s ease-in-out;
		filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.5));
		animation: slay-3 2s cubic-bezier(0.52, 0, 0.58, 1) 1s infinite;
		transform: rotate(0);
		fill: #257c03;
	}


	@keyframes slay-3 {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(-5deg);
		}

		100% {
			transform: rotate(0);
		}
	}

	/* 时间屏保 */
	/* From Uiverse.io by MuhammadHasann */
	.time_button button {
		position: relative;
		padding: 12px 35px;
		background: #fec195;
		font-size: 17px;
		font-weight: 500;
		color: #181818;
		border: 3px solid #fec195;
		border-radius: 8px;
		box-shadow: 0 0 0 #fec1958c;
		transition: all 0.3s ease-in-out;
		cursor: pointer;
	}

	.star-1 {
		position: absolute;
		top: 20%;
		left: 20%;
		width: 25px;
		height: auto;
		filter: drop-shadow(0 0 0 #fffdef);
		z-index: -5;
		transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
	}

	.star-2 {
		position: absolute;
		top: 45%;
		left: 45%;
		width: 15px;
		height: auto;
		filter: drop-shadow(0 0 0 #fffdef);
		z-index: -5;
		transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
	}

	.star-3 {
		position: absolute;
		top: 40%;
		left: 40%;
		width: 5px;
		height: auto;
		filter: drop-shadow(0 0 0 #fffdef);
		z-index: -5;
		transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
	}

	.star-4 {
		position: absolute;
		top: 20%;
		left: 40%;
		width: 8px;
		height: auto;
		filter: drop-shadow(0 0 0 #fffdef);
		z-index: -5;
		transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
	}

	.star-5 {
		position: absolute;
		top: 25%;
		left: 45%;
		width: 15px;
		height: auto;
		filter: drop-shadow(0 0 0 #fffdef);
		z-index: -5;
		transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
	}

	.star-6 {
		position: absolute;
		top: 5%;
		left: 50%;
		width: 5px;
		height: auto;
		filter: drop-shadow(0 0 0 #fffdef);
		z-index: -5;
		transition: all 0.8s ease;
	}

	.time_button button:hover {
		background: transparent;
		color: #fec195;
		box-shadow: 0 0 25px #fec1958c;
	}

	.time_button button:hover .star-1 {
		position: absolute;
		top: -80%;
		left: -30%;
		width: 25px;
		height: auto;
		filter: drop-shadow(0 0 10px #fffdef);
		z-index: 2;
	}

	.time_button button:hover .star-2 {
		position: absolute;
		top: -25%;
		left: 10%;
		width: 15px;
		height: auto;
		filter: drop-shadow(0 0 10px #fffdef);
		z-index: 2;
	}

	.time_button button:hover .star-3 {
		position: absolute;
		top: 55%;
		left: 25%;
		width: 5px;
		height: auto;
		filter: drop-shadow(0 0 10px #fffdef);
		z-index: 2;
	}

	.time_button button:hover .star-4 {
		position: absolute;
		top: 30%;
		left: 80%;
		width: 8px;
		height: auto;
		filter: drop-shadow(0 0 10px #fffdef);
		z-index: 2;
	}

	.time_button button:hover .star-5 {
		position: absolute;
		top: 25%;
		left: 115%;
		width: 15px;
		height: auto;
		filter: drop-shadow(0 0 10px #fffdef);
		z-index: 2;
	}

	.time_button button:hover .star-6 {
		position: absolute;
		top: 5%;
		left: 60%;
		width: 5px;
		height: auto;
		filter: drop-shadow(0 0 10px #fffdef);
		z-index: 2;
	}

	.time_button .fil0 {
		fill: #ffc107;
	}

	.projectItemLeft_one:hover .projectItemLeft_other {
		display: none;
	}

	.projectItemLeft_other:hover .other_one {
		display: block;
		font-size: 20px;
	}
</style>