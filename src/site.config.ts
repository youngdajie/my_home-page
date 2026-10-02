/**
 * ============================================================================
 *  site.config.ts —— 站点唯一数据源（Single Source of Truth）
 * ============================================================================
 *
 *  这个文件是全站唯一的「内容配置中心」。
 *  - 子网站列表（原 src/assets/data/set_link.json）
 *  - 社交/功能链接（原 src/assets/data/social_link.json）
 *  - 站点 meta（title / description / keywords / OG）—— 同时被 vite.config.ts
 *    读取，自动注入 index.html，所以 SEO 信息和页面内容不会再各写一份
 *  - 首页文案与 Typed 轮播语录
 *  - 页脚备案与友情徽章
 *  - 捐赠弹窗
 *
 *  维护规则：**内容是数据，不是代码。**
 *  改文案、加子站、换链接都只动这一个文件；组件里不允许再出现硬编码的中文
 *  文案或 URL。图片统一放在 public/images/ 下，用根路径引用。
 *
 *  注意：`desc` 字段允许行内 HTML（<br> 等），仅限本站自己维护的配置内容，
 *  不要往里塞用户输入。
 * ============================================================================
 */

/* ---------------------------------- 类型 ---------------------------------- */

/** AppIcon 组件内置的图标名 */
export type SocialIconName = 'Github' | 'Mail' | 'Donate' | 'Bilibili' | 'Refresh'

/** 需要 JS 介入的内置行为，优先级高于 url */
export type SocialAction = 'donate' | 'reset-cache'

/** 主题偏好：auto 跟随系统 */
export type ThemePreference = 'auto' | 'light' | 'dark'

export interface SocialLink {
	/** 悬浮提示文案 */
	tip: string
	/** 图标名 */
	icon: SocialIconName
	/** 跳转地址；纯交互按钮留空 */
	url?: string
	/** 打开方式 */
	target?: '_blank' | '_self'
	/** 品牌主色：悬浮时的填充色与光晕色 */
	accent?: string
	/** 内置行为，设置后忽略 url */
	action?: SocialAction
	/** 是否是对外链接（决定要不要 rel="noopener"） */
	external?: boolean
}

export interface Subsite {
	/** 卡片标题 */
	title: string
	/** 跳转地址 */
	url: string
	/** 卡片描述，允许行内 HTML */
	desc: string
	/** 卡片强调色，用于悬浮时的高亮。取值请用下面的 cardAccent，别写别的色系 */
	accent?: string
}

export interface HeroTextSegment {
	text: string
	/** 强调色（对应 .purple-text） */
	accent?: boolean
	/** 包成超链接 */
	href?: string
	/** 超链接是否新窗口打开 */
	external?: boolean
}

export interface FooterBadge {
	src: string
	alt: string
	href: string
}

export interface SiteConfig {
	meta: {
		name: string
		shortName: string
		title: string
		description: string
		/** og:description 单独一份，和 meta description 口径不同 */
		ogDescription: string
		keywords: string[]
		author: string
		/** 站点主域名，用于 canonical / og:url */
		url: string
		locale: string
		themeColor: string
	}
	/** 左上角悬浮 Logo */
	logo: {
		src: string
		alt: string
	}
	hero: {
		headline: {
			/** 逐行展示，最后一行拼上名字 */
			lines: string[]
			name: string
		}
		/** 首页自我介绍文案，按片段拆分以便局部高亮 */
		description: HeroTextSegment[]
		/** Typed.js 轮播语录 */
		quotes: string[]
		/** 昼夜切换默认策略 */
		theme: ThemePreference
	}
	social: {
		title: string
		links: SocialLink[]
	}
	subsites: {
		title: string
		/** 是否允许点击标题折叠 */
		collapsible: boolean
		/** 大于该宽度时铺 3 列，否则 1 列 */
		breakpoint: number
		columns: number
		items: Subsite[]
	}
	skills: {
		title: string
		desktopSrc: string
		mobileSrc: string
	}
	miniProgram: {
		title: string
		image: string
		alt: string
	}
	footer: {
		/** 版权起始年份，结束年份取当前年 */
		since: number
		owner: string
		/** 备案等合规链接 */
		links: { text: string; href: string }[]
		notice: string
		/** 推荐浏览器 */
		browserTip: {
			label: string
			entries: { device: string; text: string; href: string }[]
		}
		/** IPv6 检测入口 */
		ipv6: { text: string; href: string }
		badges: FooterBadge[]
	}
	donation: {
		/** 弹窗标题（同时也是社交按钮的提示文案） */
		tip: string
		images: { src: string; alt: string }[]
	}
}

/* --------------------------------- 配置正文 -------------------------------- */

/**
 * 卡片强调色色阶。
 *
 * 全部由品牌色 #1296db 派生：**色相固定 200.6°、饱和度固定 84.8%，只调明度**。
 * 所以卡片悬浮时的高亮（标题色 / 左侧光条 / 光标光斑 / 右下柔光）都是同一套蓝，
 * 不会出现七彩跳色。想换整套颜色只改这一个对象即可。
 *
 * 明度与用途对应关系：
 *   38%–42% 偏深，适合信息密度大的站点
 *   44%–47% 中段，就是品牌色本身
 *   48%     偏亮，适合轻松娱乐向的站点
 */
const cardAccent = {
	deep: '#0f7bb3', // hsl(200.6 84.8% 38%)  白底对比 4.66
	deepPlus: '#1081bc', // hsl(200.6 84.8% 40%)  4.30
	dark: '#1088c6', // hsl(200.6 84.8% 42%)  3.92
	mid: '#118ecf', // hsl(200.6 84.8% 44%)  3.62
	soft: '#1191d4', // hsl(200.6 84.8% 45%)  3.49
	brand: '#1296db', // 品牌原色                                  3.28
	light: '#139be2', // hsl(200.6 84.8% 48%)  3.08
} as const

export const siteConfig: SiteConfig = {
	meta: {
		name: '小杰主页',
		shortName: '小杰主页',
		title: '小杰主页',
		description:
			'这里是网站的主页，所有子网站的引导站，欢迎访问。可以在必应、谷歌搜索引擎中搜索【yangjie.site】',
		ogDescription: '人生就像一艘小船，内心指引方向',
		keywords: ['youngdajie', 'xiaojie', '小杰主页', '引导页', 'www.yangjie.site'],
		author: 'youngdajie',
		url: 'https://www.yangjie.site',
		locale: 'zh_CN',
		themeColor: '#1296db',
	},

	logo: {
		src: '/images/logo.webp',
		alt: 'logo',
	},

	hero: {
		headline: {
			/** 逐行展示，最后一行拼上名字 */
			lines: ['HI,', "I'm"],
			name: 'Yang.JIE',
		},
		description: [
			{ text: '😁', href: 'https://cdn.yangjie.site/sites/clock', external: true },
			{ text: ' 业余的', accent: true },
			{ text: ' 开发者 / 喜欢折腾各种' },
			{ text: ' 新鲜事物', accent: true },
		],
		quotes: [
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
			'请求一块二向箔，清理用',
		],
		theme: 'auto',
	},

	social: {
		title: '社交 / Social',
		links: [
			{
				tip: 'Github',
				icon: 'Github',
				url: 'https://github.com/youngdajie',
				target: '_blank',
				external: true,
				accent: '#6e5494',
			},
			{
				tip: 'Mail',
				icon: 'Mail',
				url: 'mailto:ok@yangjie.site',
				accent: '#1296db',
			},
			{
				tip: '捐赠',
				icon: 'Donate',
				action: 'donate',
				accent: '#fa5151',
			},
			{
				tip: 'B站',
				icon: 'Bilibili',
				url: 'https://space.bilibili.com/646325099',
				target: '_blank',
				external: true,
				accent: '#fb7299',
			},
			{
				tip: '强刷新',
				icon: 'Refresh',
				action: 'reset-cache',
				accent: '#12b886',
			},
		],
	},

	subsites: {
		title: '子网站 / Subsites',
		collapsible: true,
		breakpoint: 600,
		columns: 3,
		items: [
			{
				title: '杂记',
				url: 'https://box.yangjie.site',
				desc: '已迁到 Nuxt，折腾不动了，长期耕耘，不瞎搞了。<br><br>托管于 EdgeOne Makers，跟随平台的缓存规则，国内速度快',
				accent: cardAccent.mid,
			},
			{
				title: '监控',
				url: 'https://up.yangjie.site',
				desc: '基于 UptimeRobot 接口做的监控网站，接口十分有九分的不稳定，多刷新，只当个在线检测器，监测结果不准，优势是去服务器化，零成本',
				accent: cardAccent.dark,
			},
			{
				title: '足迹',
				url: 'https://cdn.yangjie.site/sites/foot',
				desc: '行千里，致广大',
				accent: cardAccent.deep,
			},
			{
				title: '原神，启动！',
				url: 'https://cdn.yangjie.site/sites/yuanshen',
				desc: '大佬开源的 web音乐，我用来放原神的 BGM 了',
				accent: cardAccent.light,
			},
			{
				title: '飞牛，启动！',
				url: 'https://fnos.net/yangjay',
				desc: '部署在内网的飞牛面板，用的友善的 ARM 机子，来管理局域网内的服务',
				accent: cardAccent.deepPlus,
			},
			{
				title: '壁纸',
				url: 'https://wallpaper.yangjie.site',
				desc: '由 Node.js&Next.js 驱动的壁纸收藏网站，CNB 托管，EdgeOne Makers 分发，资源由 JSDMirror CDN 提供加速和外链服务',
				accent: cardAccent.soft,
			},
			{
				title: 'CDN',
				url: 'https://cdn.yangjie.site',
				desc: '自建静态资源分发服务，稳定自用，CNB 存储 + EdgeOne Makers 分发，用自己写的程序管理文件，再见 PicX',
				accent: cardAccent.brand,
			},
		],
	},

	skills: {
		title: '技能 / Skills',
		desktopSrc: '/images/skill-pc.svg',
		mobileSrc: '/images/skill-mobile.svg',
	},

	miniProgram: {
		title: '小程序 / 公众号',
		image: '/images/mini-program.png',
		alt: '小程序',
	},

	footer: {
		since: 2019,
		owner: '小杰',
		links: [
			{ text: '蜀ICP备2021020461号-2', href: 'https://beian.miit.gov.cn/' },
			{
				text: '川公网安备51052102510649号',
				href: 'https://beian.mps.gov.cn/#/query/webSearch?code=51052102510649',
			},
		],
		notice: '本人工作特殊，联系不上，请见谅！',
		browserTip: {
			label: '浏览器建议',
			entries: [
				{ device: 'PC', text: 'Chrome', href: 'https://www.google.cn/intl/zh-CN/chrome/' },
				{ device: '手机', text: 'Via', href: 'https://viayoo.com/zh-cn/' },
			],
		},
		ipv6: {
			text: '支持 IPv6',
			href: 'https://ipv6test.wcode.net/?q=www.yangjie.site&ipv6-only=1',
		},
		badges: [
			{ src: '/images/badge-wormhole.png', alt: '虫洞', href: 'https://www.foreverblog.cn/go.html' },
			{
				src: '/images/badge-tencent-cloud.png',
				alt: '腾讯云',
				href: 'https://console.cloud.tencent.com/edgeone/makers',
			},
		],
	},

	donation: {
		tip: '求打赏',
		images: [{ src: '/wxpay.avif', alt: '微信赞赏码' }],
	},
}

/* --------------------------------- 派生工具 -------------------------------- */

/** 页脚版权年份区间，例如 2019-2026 */
export const copyrightRange = (): string => {
	const current = new Date().getFullYear()
	return current > siteConfig.footer.since
		? `${siteConfig.footer.since}-${current}`
		: `${siteConfig.footer.since}`
}

/** 便捷导出：子站列表（原 set_link.json） */
export const subsites = siteConfig.subsites.items

/** 便捷导出：社交链接（原 social_link.json） */
export const socialLinks = siteConfig.social.links

/** 便捷导出：Typed.js 语录 */
export const heroQuotes = siteConfig.hero.quotes

export default siteConfig
