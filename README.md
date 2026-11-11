# 一个简单大气美观的 引导页

![效果](introduce.avif)

线上地址：<https://www.yangjie.site>　·　技术栈：`Vite` + `Vue 3` + `TypeScript`，PWA 离线可用。

## 项目结构

```
youngdajie/home/
├── public/                              # 原样拷贝到 dist，用根路径引用
│   ├── favicon.ico                      # 兼容老浏览器
│   ├── favicon.svg                      # 矢量图标，同时是 manifest 里的 any 图标
│   ├── apple-touch-icon.png             # iOS 桌面图标；与 icon-256.png 是同一份文件
│   ├── icon-256.png                     # manifest 里 256×256 的 PNG 图标
│   ├── manifest.json                    # PWA 清单，由 index.html 的 <link rel="manifest"> 直接引用
│   └── images/                          # 站点配图（配置里统一写 /images/xxx.svg）
│       ├── logo.svg / logo-dark.svg     # 左上角 Logo，亮 / 暗各一张（暗色不是滤镜，是另一张图）
│       ├── skill-pc.svg                 # 技能图 · 宽屏
│       ├── skill-mobile.svg             # 技能图 · 窄屏
│       ├── mini-program.svg             # 小程序/公众号分享卡 · 亮色宽屏
│       ├── mini-program-dark.svg        # 　同上 · 暗色宽屏
│       ├── mini-program-narrow.svg      # 　同上 · 亮色窄屏（竖版票根）
│       ├── mini-program-narrow-dark.svg # 　同上 · 暗色窄屏
│       ├── donation-card.svg            # 赞赏券（矢量）
│       ├── donation-card-dark.svg       # 赞赏券 · 暗色
│       ├── badge-wormhole.png           # 页脚徽章 · 虫洞
│       └── badge-tencent-cloud.png      # 页脚徽章 · 腾讯云
├── src/
│   ├── assets/
│   │   └── 得意黑.woff2                  # 标题字体（base.css 的 @font-face 引用，只兜底，正文走 CDN 霞鹜文楷）
│   ├── components/
│   │   ├── main/
│   │   │   ├── SiteHeader.vue           # 大标题 + 自我介绍 + Typed 语录（语录每次进站洗牌）
│   │   │   ├── MainContent.vue          # 子站卡片 / 技能图 / 小程序分享卡（切主题预取另一张图）
│   │   │   ├── SiteFooter.vue           # 版权、备案、浏览器建议、IPv6、友情徽章
│   │   │   └── DonationDialog.vue       # 赞赏弹窗（常驻挂载 + v-show，Esc 关闭，打开时锁滚动）
│   │   └── others/
│   │       ├── SocialDock.vue           # 右上角社交坞（固定定位，内含昼夜切换）
│   │       ├── DarkModeToggle.vue       # 自制主题切换按钮（日月图标交叉淡入）
│   │       └── AppIcon.vue              # 内置 SVG 图标集：Github / Mail / Donate / Bilibili / Refresh
│   ├── composables/
│   │   ├── useTheme.ts                  # 主题偏好：auto / light / dark，写 localStorage；切换时临时关全局过渡
│   │   ├── useSocialLinks.ts            # 社交链接 → 模板结构；含「强刷新」注销 SW + 清 Cache Storage
│   │   ├── useSubsiteLayout.ts          # 子站分列（塞最矮一列）、高度平衡、折叠过渡
│   │   └── useDonation.ts               # 赞赏弹窗开关（模块级单例）+ 收款图预取
│   ├── directives/reveal.ts             # v-reveal，IntersectionObserver 滚动进场，共用一个 observer
│   ├── effects/starfield.ts             # 暗色星空（含彗星）；只在暗色下跑 rAF，浅色彻底停机
│   ├── styles/
│   │   ├── index.css                    # 样式入口，按 tokens → base → social → subsite 顺序 @import
│   │   ├── tokens.css                   # 设计变量，亮色为默认，html.dark 下覆盖
│   │   ├── base.css                     # 字体、重置、滚动条、标题渐变、加载遮罩、页脚
│   │   ├── social.css                   # 社交坞、图标、悬浮提示
│   │   └── subsite.css                  # 子站卡片、光斑、折叠、技能与分享卡
│   ├── App.vue                          # 页面骨架：Logo / 加载遮罩 / 星空 / 社交坞 / 主体 / 弹窗
│   ├── main.ts                          # 应用入口：样式、Toast、v-reveal、initTheme() 后挂载
│   └── site.config.ts                   # ★ 全站唯一数据源（含类型定义与 cardAccent 色阶）
├── edgeone.json                         # EdgeOne 重定向：裸域 → www
├── env.d.ts                             # *.vue 模块声明（没装 Volar 时的兜底）
├── index.html                           # 骨架 HTML，SEO meta 是 %SITE_*% 占位符，由配置注入
├── introduce.avif                       # README 效果图
├── vite.config.ts                       # Vue + meta 注入插件 + PWA/Workbox 缓存策略 + @ 别名
├── tsconfig.json                        # strict，路径别名 @/* → src/*
├── package.json
└── LICENSE
```

这里只列 `src`、`public` 和根目录的配置，依赖需要自行 `npm i`。
`dist`、`dev-dist`、`node_modules`、`package-lock.json`、`.workbuddy` 都在 `.gitignore` 里，不进仓库。

## 改内容只改一个文件

站点所有内容都在 **`src/site.config.ts`**：站点 meta、Logo、首页文案、打字机语录、
社交按钮、子网站列表、技能图、小程序分享卡、页脚备案、赞赏弹窗。组件里不再出现硬编码文案和 URL。

| 想改什么 | 改哪里 |
| --- | --- |
| 加 / 删子网站 | `siteConfig.subsites.items` |
| 卡片悬浮色 | `siteConfig.subsites.items[].accent`，取值统一用文件顶部的 `cardAccent` 色阶（全部由品牌色 `#1296db` 派生，色相 200.6°、饱和度 84.8% 固定，只调明度） |
| 子站列数 / 折叠断点 | `siteConfig.subsites.columns`、`breakpoint`、`collapsible` |
| 换社交链接、改悬浮色 | `siteConfig.social.links`（`accent` 就是悬浮主色；`action` 可挂 `donate` / `reset-cache`） |
| 标题 / 描述 / 关键词 | `siteConfig.meta`，构建时自动注入 `index.html` |
| 左上角 Logo | `siteConfig.logo`，`darkSrc` 不填就两套主题共用一张 |
| 打字机语录 | `siteConfig.hero.quotes`（装进 Typed 前会 Fisher-Yates 洗一次牌） |
| 主题默认策略 | `siteConfig.hero.theme`：`auto` / `light` / `dark` |
| 技能图 / 分享卡 | `siteConfig.skills`、`siteConfig.miniProgram`（分享卡有 亮/暗 × 宽/窄 四张） |
| 页脚版权、备案、徽章、浏览器建议 | `siteConfig.footer`（`since` 只写起始年，结束年取当前年） |
| 赞赏图 | `siteConfig.donation.images`，`width`/`height` 必填，用来算占位比例 |

配图放 `public/images/`，配置里用 `/images/xxx.svg` 引用。

## 几个设计取舍（改之前先看）

- **SEO 单一来源**：`vite.config.ts` 里的 `injectSiteMeta` 插件把 `site.config.ts` 的 meta 写进 `index.html` 的 `%SITE_*%` 占位符，配置和 HTML 不会漂移。
- **两套字体分工**：正文走自建 CDN 的霞鹜文楷，用 `preload` + `media=print` 抢优先级但不阻塞首屏，到货后切回 `all`，CDN 抽风时只退化成系统字体；`src/assets/得意黑.woff2` 只在字体栈里兜底。
- **SW 缓存按职责分层**：预缓存只装 `html/js/css`（靠 `__WB_REVISION__` 保证内容变就重下）；`static@jie` 管 ico / 图片 / manifest；`font@jie-v1` 管跨域字体。换字体时把 `cacheName` 升到 `v2`。
- **字体路由正则必须以 `^https://` 打头**：Workbox 的 RegExpRoute 对跨域请求只认从头匹配，只匹配 URL 末尾的正则会被静默丢弃（曾导致字体请求全进 SW、`Cache.put` 0 次）。
- **导航回退要放行静态文件**：`navigateFallbackDenylist` 用 `STATIC_FILE_PATTERN`，否则打开 `/favicon.ico` 会拿到 `index.html`。
- **弹窗常驻挂载**：`DonationDialog` 用 `v-show` 而不是 `v-if`，页面加载时 `<img>` 就挂上，点开只切 `display`，不会出现「券先出来、码后到」。
- **切换主题时关掉过渡**：`useTheme` 会给 `<html>` 挂 `is-theme-switching`，避免 `color` 过渡把文字颜色逐帧重算导致字形抖动。
- **Logo 窄屏不创建而不是隐藏**：`matchMedia('(min-width: 1177px)')` 不匹配时直接不渲染 `<img>`，`display:none` 在 Chromium 里仍可能下载。
- **强刷新按钮**：社交坞里的「强刷新」会注销 Service Worker 并清空 Cache Storage，再自动刷新——样式或字体更新没生效时用它。

## 命令

```bash
npm i                # 安装依赖
npm run dev          # 本地预览
npm run type-check   # vue-tsc 类型检查
npm run build        # 先类型检查再构建（检查不过就构建失败）
npm run build:only   # 跳过类型检查，只构建
npm run preview      # 预览 dist
```

## 版本

- 0.1.0 / 2024-01-20
- 0.2.0 / 2024-07-16 支持昼夜模式，by `vue-dark-switch`
- 0.3.0 / 2024-08-25
- 1.0.0 / 2026-03-24 移除 `vue-dark-switch`，自制主题切换组件
- 5.0.0 / 2026-05-05 添加强制刷新 SW 缓存按钮，点击注销缓存并自动刷新
- 6.0（当前 `package.json` 版本）内容集中在 `site.config.ts`，样式拆分为 tokens / base / social / subsite，效果脚本迁移为 TS

技术要点：PWA 离线访问 by `vite-plugin-pwa`，打字效果 by `typed.js`，提示 by `vue-toastification`。
