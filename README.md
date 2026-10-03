# 一个简单大气美观的 引导页

![效果](introduce.avif)

项目结构：
```
my_home-page/
├── public/                     # 原样拷贝到 dist，走根路径引用
│   ├── favicon.ico             # 兼容老浏览器
│   ├── favicon.svg             # 矢量图标
│   ├── apple-touch-icon.png    # iOS 桌面图标
│   ├── icon-256.png            # PWA 图标（256×256）
│   ├── manifest.json           # PWA 清单
│   ├── wxpay.avif              # 捐赠二维码
│   └── images/                 # 站点配图（logo / 技能图 / 徽章 …）
├── src/
│   ├── assets/                 # 只放需要打包处理的资源（字体等）
│   ├── components/
│   │   ├── main/
│   │   │   ├── DonationDialog.vue
│   │   │   ├── MainContent.vue
│   │   │   ├── SiteFooter.vue
│   │   │   └── SiteHeader.vue
│   │   └── others/
│   │       ├── AppIcon.vue
│   │       └── DarkModeToggle.vue
│   ├── composables/            # 可复用逻辑
│   │   ├── useDonation.ts
│   │   ├── useSocialLinks.ts
│   │   ├── useSubsiteLayout.ts
│   │   └── useTheme.ts
│   ├── directives/reveal.ts    # v-reveal，滚动进场
│   ├── effects/starfield.ts    # 暗色星空背景
│   ├── styles/                 # tokens / base / social / subsite
│   ├── App.vue
│   ├── main.ts
│   └── site.config.ts          # ★ 全站唯一数据源
├── index.html                  # SEO meta 由 site.config.ts 注入
├── introduce.avif
├── LICENSE
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

由 `Vite` & `Vue 3` + `TypeScript` 写的。这里只包括 `src 项目目录` 和 `public 公共目录`，及 `根 HTML 文件`。其余依赖需要自行配置。

## 改内容只改一个文件

站点所有内容都在 **`src/site.config.ts`**：站点 meta、首页文案、打字机语录、
社交按钮、子网站列表、页脚备案、捐赠弹窗。组件里不再出现硬编码文案和 URL。

- 加 / 删子网站 → `siteConfig.subsites.items`
- 卡片悬浮色 → `siteConfig.subsites.items[].accent`，取值统一用文件顶部的 `cardAccent` 色阶
  （全部由品牌色 `#1296db` 派生，只调明度，保证悬浮态是同一套蓝）
- 换社交链接、改悬浮色 → `siteConfig.social.links`（`accent` 就是悬浮主色）
- 改标题 / 描述 / 关键词 → `siteConfig.meta`，会自动注入 `index.html`，不用手改 HTML
- 配图放 `public/images/`，在配置里用 `/images/xxx.png` 引用

## 命令

**npm 安装**

> `npm create vite@latest`

之后选择最新的 vue，勾上。

**构建**
>
> `npm i`

不出意外，项目下就会出现 node_modules 文件夹。安装插件等其他什么的，都在其中体现。

**用于预览**

> `npm run dev`

**类型检查**

> `npm run type-check`

**用于生产环境**

> `npm run build`（会先跑一遍类型检查，再过不了就构建失败）

**在 dist 文件夹下**

0.1.0 版本 / 2024年1月20日

0.2.0 版本 / 2024年7月16日 支持昼夜模式，by `vue-dark-switch`

0.3.0 版本 / 2024年8月25日 

1.0 版本 / 2026年3月24日 移除`vue-dark-switch`，自制主题切换组件

5.0 版本 / 2026年5月5日 添加强制刷新 SW 缓存 的按钮，点击注销缓存和自动刷新网页

1. pwa 支持离线访问 by `vite-plugin-pwa`
2. 打字效果 by `typed.js`
3. 弹窗触发 by `vue-toastification`
4. 一些前端效果借鉴的 **https://uiverse.io/**
5. logo 是我妹给我设计的
6. ChatGPT 写的代码，我啥也不会
7. ~~自定义内容修改在 路径：`my_home-page\src\assets` 下的两个 json 中~~
8. `ipw.cn` 已死，缅怀

5.5 版本 / 2026年9月3日，让 AI 帮我实现了卡片瀑布流，显示关闭动画，修改了一些 CSS 类名称，去除了一些无用冗余的代码

6.0 版本 / 2026年10月2日
1. 全面 TypeScript 重构：`.js` → `.ts`，所有组件加 `lang="ts"`，`npm run build` 前先跑 `vue-tsc` 类型检查
2. 两个 JSON 合并进 `src/site.config.ts`，成为全站唯一数据源；`index.html` 的 SEO meta 也由它注入
3. 目录重组：`composables/` 抽逻辑、`styles/` 拆 CSS、`directives/` 收指令、`effects/` 收独立动效；`@` 别名指向 `src`
4. 干掉 `public/script.js` 这个全局脚本，里面的逻辑全部搬进 Vue（加载动画、卡片进场、捐赠弹窗、强制刷新）
5. 修掉 favicon 的坑：Service Worker 的导航回退会把地址栏直接访问 `/favicon.ico` 的请求返回 `index.html`；加 `navigateFallbackDenylist` + 缓存名加版本号解决
6. 重做左侧社交按钮样式：统一圆角方块、悬浮品牌色填充 + 光晕、气泡提示挪到右侧
7. 性能：去掉全局 `transition: all`，暗色星空只在暗色模式跑 rAF，画布支持高分屏