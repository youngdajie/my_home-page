# 一个简单大气美观的 引导页

![效果](introduce.avif)

项目结构：
```
my_home-page/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   ├── script.js
│   └── wxpay.avif
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── main/
│   │   │   ├── DonationDialog.vue
│   │   │   ├── MainContent.vue
│   │   │   ├── SiteFooter.vue
│   │   │   └── SiteHeader.vue
│   │   └── others/
│   │       ├── DarkModeToggle.vue
│   │       └── icon/
│   │           └── icon.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── introduce.avif
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

由 `Vite` & `Vue` 写的。这里只包括 `src 项目目录` 和 `public 公共目录`，及 `根 HTML 文件`。其余依赖需要自行配置。

## 配置Vite

**npm 安装**

> `npm create vite@latest`

之后选择最新的 vue，勾上。

**构建**
>
> `npm i`

不出意外，项目下就会出现 node_modules 文件夹。安装插件等其他什么的，都在其中体现。

**用于预览**

> `npm run dev`

**用于生产环境**

> `npm run build`

**在 dist 文件夹下**

0.1.0 版本 / 2024年1月20日

0.2.0 版本 / 2024年7月16日 支持昼夜模式，by `vue-dark-switch`

0.3.0 版本 / 2024年8月25日 

1.0 版本 / 2026年3月24日 移除`vue-dark-switch`，自制主题切换组件

5.0 版本 / 2026年5月5日 添加强制刷新 SW 缓存 的按钮，点击注销缓存和自动刷新网页

1. pwa 支持离线访问 by `vite-plugin-pwa`
2. 打字效果 by `vue-typed-js`
3. 弹窗触发 by `vue-toastification`
4. 一些前端效果借鉴的 **https://uiverse.io/**
5. logo 是我妹给我设计的
6. ChatGPT 写的代码，我啥也不会
7. 自定义内容修改在 路径：`my_home-page\src\assets` 下的两个 json 中
8. `ipw.cn` 已死，缅怀

5.5 版本 / 2026年9月3日，让 AI 帮我实现了卡片瀑布流，显示关闭动画，修改了一些 CSS 类名称，去除了一些无用冗余的代码