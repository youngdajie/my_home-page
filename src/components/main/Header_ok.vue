<template>
	<header>
		<!-- 头部开始 -->
		<div class="welcome">
			HI,<br /> I'm
			<span class="gradientText">Yang.JIE</span>
		</div>
		<div class="description">
			<a target="_blank" href="https://clock.yangjie.site/">😁</a>
			<span class="purpleText"> 业余的</span> 开发者 / 喜欢折腾各种
			<span class="purpleText"> 新鲜事物</span>
		</div>
		<div class="description d-2">
			<p id="typing-text"></p>
		</div>
		<div class="iconContainer">
			<a 
			  v-for="(link, index) in socialLinks" 
			  :key="index" 
			  class="iconItem" 
			  :data-tip="link.tip" 
			  :href="link.url || 'javascript:void(0)'"
			  :target="link.target || null" 
			  @click="link.click ? link.click() : null">
			  <Icon :name="link.icon" />
			</a>
			<DarkModeToggle />
		</div>
		<!-- 图标容器结束 -->
	</header>
	<!-- 头部结束 -->

</template>


<script setup>
	import {
		onMounted,
		computed
	} from 'vue';
	import Typed from 'typed.js';
	import DarkModeToggle from '../../components/others/DarkModeToggle.vue'
	import socialLinksData from '../../assets/data/social_link.json'; // 重命名导入变量避免冲突
	import Icon from '../others/icon/icon.vue'; // 导入通用图标组件
	
	onMounted(() => {
		const options = {
			strings: [
				'失去人性，失去很多；失去兽性，失去一切',
				'我爱你，与你有何相干？毁灭你，又与你有何相干？',
				'宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都小心翼翼',
				'给岁月以文明，而不是给文明岁月，给时光以生命而不是给生命以时光',
				'弱小和无知不是生存的障碍，傲慢才是',
				'麦克·伊文斯的一句话已成为降临派的座右铭：我们不知道外星文明是什么样子，但知道人类',
				'妈妈，我将变成一只萤火虫',
				'把人类看成虫子的三体人似乎从来没有意识到一个事实：虫子从来没有被战胜过',
				'唯一不可阻挡的是时间，它像一把利刃，无声地切开了坚硬和柔软的一切，恒定地向前推进着，没有任何东西能够使它的行进出现丝毫颠簸，它却改变着一切',
				'消灭人类暴政，世界属于三体',
				'这是人类的落日',
				'没有救世的能力不是你的错，但给世界以希望后又打碎它就是一种不可饶恕的罪恶了',
				'西方人并不比东方人聪明，但是他们却找对了路',
				'邪乎到家必有鬼',
				'我有一个梦，也许有一天，灿烂的阳光能照进黑暗森林',
				'你的无畏来源于你的无知',
				'在中国，任何超脱飞扬的思想都会砰然坠地——现实的引力实在是太沉重了',
				'空不是无，空是一种存在，你得用空这种存在填满自己',
				'孩子问，他们是烈士吗？妈妈说，不是。他们是敌人吗？ 不是。 那他们是什么？ 他们是历史！',
				'前进！前进！！不择手段地前进！！！ ——托马斯·维德',
				'粮食？这不都是粮食吗？每个人看看你们周围，活生生的粮食',
				'不理睬是最大的轻蔑',
				'不要返航，这里不是家！',
				'把海弄干的鱼在海干前上了陆地，从一片黑暗森林奔向另一片黑暗森林',
				'请求一块二向箔，清理用'
			],
			typeSpeed: 100,
			startDelay: 500,
			showCursor: true,
			loop: true, // 添加此行以启用循环
			loopDelay: 3000, // 每次循环之前的延迟时间（毫秒）
			backDelay: 3000 // 退格之前的延迟时间（毫秒）
		};

		new Typed('#typing-text', options);
	});

	import {
		useToast
	} from 'vue-toastification';

	// 调用 useToast 函数来获取 toast 实例
	const toast = useToast();

	
	// 添加这个函数用于重置 SW 缓存并刷新页面
	const resetSWCacheAndRefresh = async () => {
		try {
			toast.info('正在重置缓存...', { 
				timeout: 2000,
				closeOnClick: false,
				draggable: false
			})

			// 注销所有 Service Workers
			if ('serviceWorker' in navigator) {
				const registrations = await navigator.serviceWorker.getRegistrations()
				
				for (let registration of registrations) {
					await registration.unregister()
				}
				
				// 清除所有缓存
				if ('caches' in window) {
					const cacheNames = await caches.keys()
					await Promise.all(
						cacheNames.map(cacheName => caches.delete(cacheName))
					)
				}
			}

			// 通知用户即将刷新
			toast.success('缓存已重置，页面将在 3 秒后刷新', { 
				timeout: 3000,
				closeOnClick: false,
				draggable: false
			})

			// 等待1秒后刷新页面
			setTimeout(() => {
				window.location.reload(true)
			}, 3050)

		} catch (error) {
			console.error('重置缓存时出错:', error)
			toast.error('重置缓存失败，请手动刷新页面', {
				timeout: 3000
			})
		}
	}
	
	// 重写 wx 函数 - 用于显示捐赠图片
	const wx = (imageURL) => {
		// 使用原生 JavaScript 操作 DOM
		toggleClass(".tc", "active");
		toggleClass(".tc-main", "active");
	}
	
	// 辅助函数：切换类名
	const toggleClass = (selector, className) => {
		const elements = document.querySelectorAll(selector);
		elements.forEach(element => {
			if (element.classList.contains(className)) {
				element.classList.remove(className);
			} else {
				element.classList.add(className);
			}
		});
	}
	
	// 辅助函数：移除类名
	const removeClass = (selector, className) => {
		const elements = document.querySelectorAll(selector);
		elements.forEach(element => {
			element.classList.remove(className);
		});
	}
	
	// 创建一个计算属性来更新 socialLinks，为刷新按钮添加 click 事件
	const socialLinks = computed(() => {
		return socialLinksData.map(link => {
			if (link.tip === '强刷新') {
				return {
					...link,
					click: resetSWCacheAndRefresh,
					url: undefined
				}
			} else if (link.tip === '捐赠') {
				return {
					...link,
					click: () => wx(link.url), // 使用箭头函数包装，传递参数
					url: undefined // 防止默认跳转行为
				}
			}
			return link
		})
	})
</script>

<style scoped>
	/*打字效果*/
	.typed-text {
		font-family: monospace;
		white-space: nowrap;
		overflow: hidden;
		border-right: .15em solid orange;
		animation: caret 1s steps(1) infinite;
	}

	@keyframes caret {
		50% {
			border-color: transparent;
		}
	}

	#typing-text {
		display: inline;
		margin-right: 10px;
		font-size: 16px;
	}

	.d-2 {
		height: 64px;
	}
</style>