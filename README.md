# 一个简单大气美观的 引导页

![效果](introduce.avif)

线上地址：<https://www.yangjie.site>　·　技术栈：`Vite` + `Vue 3` + `TypeScript`，PWA 离线可用。

## 项目结构

```
youngdajie/home/
├── public/                              # 原样拷贝到 dist，走根路径引用
│   ├── favicon.ico                      # 兼容老浏览器
│   ├── favicon.svg                      # 矢量图标
│   ├── apple-touch-icon.png             # iOS 桌面图标
│   ├── icon-256.png                     # PWA 图标（256×256）
│   ├── manifest.json                    # PWA 清单（示例文件，构建时 manifest: false 不参与打包）
│   └── images/                          # 站点配图
│       ├── logo.svg / logo-dark.svg     # 左上角 Logo，亮 / 暗各一张
│       ├── skill-pc.svg                 # 技能图 · 宽屏
│       ├── skill-mobile.svg             # 技能图 · 窄屏
│       ├── mini-program.svg             # 小程序/公众号分享卡 · 亮色宽屏
│       ├── mini-program-dark.svg        # 　同上 · 暗色
│       ├── mini-program-narrow.svg      # 　同上 · 亮色窄屏（竖版票根）
│       ├── mini-program-narrow-dark.svg # 　同上 · 暗色窄屏
│       ├── donation-card.svg            # 赞赏券（矢量）
│       ├── donation-card-dark.svg       # 赞赏券 · 暗色
│       ├── badge-wormhole.png           # 页脚徽章 · 虫洞
│       └── badge-tencent-cloud.png      # 页脚徽章 · 腾讯云
├── src/
│   ├── assets/                          # 需要打包处理的资源
│   │   ├── 得意黑.woff2                  # 标题字体（base.css @font-face 引用）
│   │   └── images/                      # 历史遗留，当前代码未引用
│   │       ├── 111.png / 512.png
│   │       ├── jk.svg
│   │       ├── snake-Light.svg
│   │       └── svg/snake-Light.svg / snake-Dark.svg
│   ├── components/
│   │   ├── main/
│   │   │   ├── SiteHeader.vue           # 大标题 + 自我介绍 + Typed 语录
│   │   │   ├── MainContent.vue          # 子站卡片 / 技能 / 小程序分享卡
│   │   │   ├── SiteFooter.vue           # 备案、浏览器建议、IPv6、徽章
│   │   │   └── DonationDialog.vue       # 赞赏弹窗（常驻挂载 + v-show）
│   │   └── others/
│   │       ├── SocialDock.vue           # 右上角社交坞（含昼夜切换）
│   │       ├── DarkModeToggle.vue       # 自制主题切换按钮
│   │       └── AppIcon.vue              # 内置 SVG 图标集（Github / Mail / Donate / Bilibili / Refresh）
│   ├── composables/
│   │   ├── useTheme.ts                  # 主题偏好：auto / light / dark，读写 localStorage
│   │   ├── useSocialLinks.ts            # 社交链接 → 模板结构；含「强刷新」清 SW 缓存
│   │   ├── useSubsiteLayout.ts          # 子站卡片分列、高度平衡、折叠动画
│   │   └── useDonation.ts               # 赞赏弹窗开关 + 图片预取
│   ├── directives/reveal.ts             # v-reveal，IntersectionObserver 滚动进场
│   ├── effects/starfield.ts             # 暗色星空背景（仅在暗色下跑 rAF）
│   ├── styles/
│   │   ├── index.css                    # 样式入口，按 tokens → base → social → subsite 顺序导入
│   │   ├── tokens.css                   # 设计变量，亮色默认 / html.dark 覆盖
│   │   ├── base.css                     # 字体、布局、标题渐变、加载遮罩、页脚
│   │   ├── social.css                   # 社交坞与图标
│   │   └── subsite.css                  # 子站卡片、光斑、折叠
│   ├── App.vue                          # 页面骨架：Logo / 加载遮罩 / 星空 / 社交坞 / 主体
│   ├── main.ts                          # 应用入口：样式、Toast、v-reveal、挂载
│   └── site.config.ts                   # ★ 全站唯一数据源
├── edgeone.json                         # EdgeOne 301：裸域 → www
├── env.d.ts                             # *.vue 模块声明（无 Volar 时的兜底）
├── index.html                           # 骨架 HTML，SEO meta 由 site.config.ts 注入
├── introduce.avif                       # README 效果图
├── vite.config.ts                       # Vue + meta 注入插件 + PWA/Workbox 缓存策略 + @ 别名
├── tsconfig.json
├── package.json
└── LICENSE
```

这里只包括 `src` 项目目录、`public` 公共目录和根目录配置文件，其余依赖需要自行 `npm i`。

## 改内容只改一个文件

站点所有内容都在 **`src/site.config.ts`**：站点 meta、首页文案、打字机语录、
社交按钮、子网站列表、页脚备案、捐赠弹窗。组件里不再出现硬编码文案和 URL。

| 想改什么 | 改哪里 |
| --- | --- |
| 加 / 删子网站 | `siteConfig.subsites.items` |
| 卡片悬浮色 | `siteConfig.subsites.items[].accent`，取值统一用文件顶部的 `cardAccent` 色阶（全部由品牌色 `#1296db` 派生，只调明度，悬浮态是同一套蓝） |
| 换社交链接、改悬浮色 | `siteConfig.social.links`（`accent` 就是悬浮主色） |
| 标题 / 描述 / 关键词 | `siteConfig.meta`，自动注入 `index.html`，不用手改 HTML |
| 打字机语录 | `siteConfig.hero.quotes` |
| 主题默认策略 | `siteConfig.hero.theme`：`auto` / `light` / `dark` |
| 页脚备案、徽章、浏览器建议 | `siteConfig.footer` |
| 赞赏图 | `siteConfig.donation.images` |

配图放 `public/images/`，配置里用 `/images/xxx.svg` 引用。

## 几个设计取舍（改之前先看）

- **SEO 单一来源**：`vite.config.ts` 里的 `injectSiteMeta` 插件把 `site.config.ts` 的 meta 写进 `index.html` 的 `%SITE_*%` 占位符，配置和 HTML 不会漂移。
- **字体非阻塞加载**：霞鹜文楷走自建 CDN，用 `preload` + `media=print` 抢优先级但不阻塞首屏，到货后切回 `all`；CDN 抽风时只是先用系统字体。
- **SW 缓存按职责分层**：预缓存只装 `html/js/css`（靠 `__WB_REVISION__` 保证内容变就重下）；`static@jie` 管 ico / 图片 / manifest；`font@jie-v1` 管跨域字体。换字体时把 `cacheName` 升到 `v2`。
- **弹窗常驻挂载**：`DonationDialog` 用 `v-show` 而不是 `v-if`，避免打开瞬间才取图、先出券后出码。
- **强刷新按钮**：社交坞里的「强刷新」会注销 Service Worker 并清空 Cache Storage，再自动刷新——样式或字体更新没生效时用它。

## 命令

```bash
npm i          # 安装依赖
npm run dev    # 本地预览
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

技术要点：PWA 离线访问 by `vite-plugin-pwa`，打字效果 by `typed.js`。
