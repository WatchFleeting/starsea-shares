# 🎯 鸿渚资源分享站

<div align="center">

![](https://img.shields.io/badge/GitHub%20Pages-已部署-2ea44f?style=flat-square&logo=github)
![](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)
![](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
![](https://img.shields.io/badge/内容驱动-Markdown-blue?style=flat-square&logo=markdown)

一个基于 Markdown + GitHub Pages 的现代化、纯静态、多类型资源分享网站。支持网页推荐、软件下载、文件分享和技术文章四种资源类型，集成了爱发电兑换码付费系统、深色模式、防复制保护，并提供搜索、标签、排行榜等增强功能。

</div>

---

## 📖 目录

- [✨ 核心特性](#✨-核心特性)
- [🚀 快速开始](#🚀-快速开始)
- [📁 项目结构](#📁-项目结构)
- [📝 内容管理](#📝-内容管理)
  - [1. 资源卡片](#1-资源卡片)
  - [2. 完整文章](#2-完整文章)
  - [3. 文件详情](#3-文件详情)
  - [4. 更新索引](#4-更新索引)
- [🌐 页面导航](#🌐-页面导航)
- [⚙️ 付费功能配置（爱发电兑换码系统）](#️-付费功能配置爱发电兑换码系统)
- [🛡️ 防复制功能说明](#️-防复制功能说明)
- [🎨 自定义与扩展](#🎨-自定义与扩展)
- [❓ 常见问题](#❓-常见问题)
- [📄 许可证](#📄-许可证)

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 📂 纯静态架构 | 无需服务器与数据库，完全依赖 GitHub Pages 免费托管 |
| 📝 Markdown 驱动 | 所有内容（资源卡片、文章、文件详情）均通过 Markdown 文件管理，易于编写与维护 |
| 🔗 多资源类型 | 清晰区分 网页分享、软件分享、文件分享 和 文章分享 |
| 🎨 现代化 UI | 响应式设计，支持深色/浅色主题，拥有平滑的交互动画和动态背景 |
| 💰 爱发电付费集成 | 通过兑换码实现付费内容解锁，用户赞助后获得兑换码，输入后自动显示下载链接 |
| 🛡️ 防复制保护 | 禁用右键、选择、复制快捷键及开发者工具快捷键，保护付费资源 |
| 🔍 高级搜索 | 支持标题、描述、分类、标签的全文本搜索 |
| 🏷️ 标签聚合 | 按标签浏览资源，快速定位感兴趣的内容 |
| 📊 排行榜 | 按下载链接数量展示热门资源 |
| ❤️ 猜你喜欢 | 详情页自动推荐相似资源 |
| ⚡ 性能优异 | 快速的加载速度与流畅的浏览体验 |

---

## 🚀 快速开始

1. **获取项目**：将代码部署到你的 GitHub 仓库（Fork 或下载源码）。
2. **启用 GitHub Pages**：进入仓库 Settings → Pages，选择主分支（如 `main`）并保存。
3. **初始化内容**：按照下文说明创建 Markdown 文件和 `data-index.json`。
4. **配置付费功能（可选）**：如需使用爱发电兑换码，请参考 [付费功能配置](#️-付费功能配置爱发电兑换码系统) 部署 Vercel 云函数。

---

## 📁 项目结构

```text
仓库根目录/
├── index.html                 # 精简首页（分类导航 + 最新预览）
├── web.html                   # 网页资源列表页
├── software.html              # 软件资源列表页
├── file.html                  # 文件资源列表页
├── article.html               # 文章资源列表页
├── detail.html                # 资源详情页（含付费兑换）
├── search.html                # 搜索页面
├── tags.html                  # 标签浏览页面
├── hot.html                   # 热门排行榜页面
├── about.html                 # 关于页面
├── help.html                  # 帮助中心页面
├── changelog.html             # 更新日志页面
├── links.html                 # 友情链接页面
├── privacy.html               # 隐私政策页面
├── terms.html                 # 用户协议页面
├── data-index.json            # 核心索引文件（列出所有卡片）
├── js/
│   └── common.js              # 公共 JavaScript 函数库（供所有页面复用）
├── api/                       # Vercel 云函数目录（可选）
│   └── verify-redeem.js       # 兑换码验证接口
├── data/                      # 所有内容数据
│   ├── cards/                 # 资源卡片定义（每个 .md 对应一张首页卡片）
│   ├── articles/              # 完整文章内容（由文章卡片中的 contentRef 引用）
│   └── files/                 # 文件分享详情（由文件卡片中的 fileRef 引用）
└── assets/                    # 静态资源（图片等）
    └── covers/                # 卡片封面图片
```
📝 内容管理：一切皆 Markdown
每个 .md 文件都包含 YAML 前置元数据（Front Matter） 和 正文内容。

1. 资源卡片
路径：data/cards/
作用：每个文件定义首页上的一张卡片。

示例：my-resource.md

```yaml
---
id: "A081"
title: "🌐 流量卡免费领取"
description: "免费领取5G流量卡，告别限速。"
category: "网络"
type: "web"              # 类型：web/software/file/article
icon: "fa-wifi"          # FontAwesome 图标名
tags: ["流量卡", "5G"]
date: "2026-02-20"
notice: "数量有限"        # 可选提示
downloads:               # 下载按钮组（可选）
  - name: "官方申请"
    url: "https://..."
  - name: "备用通道"
    url: "https://..."

# 类型专属字段（根据 type 填写）
# 若 type = web/software，可填 url: "https://..."
# 若 type = article，需填 contentRef: "data/articles/my-article.md"
# 若 type = file，需填 fileRef: "data/files/my-file-details.md"

# 付费资源字段（可选）
is_paid: true
resource_id: "design-pack-101"
---
（卡片备注，主页不显示）
```

2. 完整文章
路径：data/articles/
作用：当用户点击类型为 article 的卡片时，详情页会展示该文件内容。

```yaml
---
title: "文章标题"
author: "鸿渚"
date: "2025-01-20"
readTime: "10分钟"
tags: ["教程"]
---
# 正文内容
使用 Markdown 编写。
```

3. 文件详情
路径：data/files/
作用：当用户点击类型为 file 的卡片时，详情页展示该文件的下载信息。

```yaml
---
title: "设计资源包"
fileName: "design-pack.zip"
fileSize: "215 MB"
fileType: "zip"
downloadUrl: "https://cdn.example.com/file.zip"
password: "1234"                     # 解压密码（可选）
images:                               # 截图轮播（可选）
  - "/assets/screenshots/1.jpg"
  - "/assets/screenshots/2.jpg"
remainDownloads: 3                    # 剩余下载次数（静态展示）
---
## 详细说明
...
4. 更新索引
重要：新增或删除卡片后，必须更新根目录的 data-index.json，列出所有卡片路径。

```json
{
  "cards": [
    "data/cards/design_resources.md",
    "data/cards/ai_painting.md"
  ]
}
```

🌐 页面导航
| 页面 | 功能 |
|------|------|
| index.html	| 首页，展示分类卡片和最新资源预览|
| web.html	| 网页资源列表|
| software.html	| 软件资源列表|
| file.html	| 文件资源列表|
| article.html	| 文章资源列表|
| detail.html	| 资源详情页，显示完整描述、图片轮播、下载链接（付费解锁）|
| search.html	| 搜索资源（标题、描述、标签、分类）|
| tags.html	| 按标签浏览资源，点击标签显示对应资源列表|
| hot.html	| 下载排行榜（按下载链接数量排序）|
| about.html	| 关于本站|
| help.html	| 帮助中心（常见问题、使用指南）|
| changelog.html	| 更新日志|
| links.html	| 友情链接|
| privacy.html	| 隐私政策|
| terms.html	| 用户协议|
所有页面均共享同一套 CSS 和 common.js，风格统一，支持深色模式。

⚙️ 付费功能配置（爱发电兑换码系统）
本项目采用 兑换码系统 实现付费内容解锁。流程：

创作者在爱发电创建商品，在发货内容中填入一次性兑换码。

用户赞助后获得兑换码，在资源详情页输入。

前端调用云函数验证，通过后显示下载链接。

部署云函数（使用 Vercel）
文件：api/verify-redeem.js

```javascript
const usedCodes = new Set();  // 生产环境请使用数据库（如 Vercel KV）
const validCodes = {
  'design-pack-101': ['R20250321ABCDEF', 'R20250322GHIJKL']
};
const downloadUrls = {
  'design-pack-101': 'https://your-cdn.com/design-pack.zip'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const { code, resourceId } = req.body;
  if (!code || !resourceId) return res.status(400).json({ success: false, message: '参数缺失' });

  const validList = validCodes[resourceId];
  if (!validList || !validList.includes(code)) {
    return res.status(400).json({ success: false, message: '无效的兑换码' });
  }
  if (usedCodes.has(code)) {
    return res.status(400).json({ success: false, message: '兑换码已使用' });
  }
  usedCodes.add(code);
  return res.json({ success: true, downloadUrl: downloadUrls[resourceId] || null });
}
```

部署步骤：

在项目根目录创建 api/verify-redeem.js，粘贴上述代码。

将项目推送到 GitHub，在 Vercel 中导入并部署。

修改 detail.html 中的 CONFIG.verifyApiUrl 为你的云函数地址，例如 https://your-app.vercel.app/api/verify-redeem。

🛡️ 防复制功能说明
为保护付费资源，网站已内置多层防复制机制：

CSS 禁止选中：user-select: none

禁用右键菜单：拦截 contextmenu 事件

禁用快捷键：Ctrl+C、Ctrl+A、F12、Ctrl+Shift+I 等均被阻止

禁用复制事件：拦截 copy 事件

下载链接动态生成：不暴露真实 URL

开发者工具检测：检测窗口大小变化（仅记录，不干扰正常使用）

🎨 自定义与扩展
修改网站信息：编辑各 HTML 文件中的 <title> 和 <header>。

调整主题颜色：修改 :root 下的 CSS 变量（如 --cyan-500）。

添加新资源类型：在 common.js 的 getTypeChineseName 和 getDefaultIcon 中同步添加，并创建对应的分类页面（如 newtype.html）。

修改页脚导航：所有页面的 <footer> 部分，统一更新链接。

❓ 常见问题
Q: 为什么新卡片没有显示？
A: 检查：① data-index.json 中添加了路径；② YAML 格式正确；③ 清除浏览器缓存后刷新。

Q: 文件下载有限制吗？
A: GitHub Pages 有 1GB 存储和 100GB/月带宽限制。建议大文件使用第三方对象存储（如阿里云OSS），并将 downloadUrl 指向该链接。

Q: 如何备份内容？
A: 定期备份整个 data/ 目录和 data-index.json。

Q: 付费兑换码验证失败怎么办？
A: 确认 detail.html 中的 verifyApiUrl 配置正确，且 Vercel 云函数已正常部署。检查浏览器控制台是否有跨域错误。

Q: 深色模式无法保存？
A: 浏览器需支持 localStorage，且未禁用。清除缓存后重试。

📄 许可证
本项目采用 MIT 许可证。您可以自由使用、修改和分发。

<div align="center"> <sub>Built with ❤️ by 鸿渚</sub> </div>
