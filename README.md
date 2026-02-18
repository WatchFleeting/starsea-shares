# 🎯 鸿渚资源分享站

一个基于 **Markdown + GitHub Pages** 的现代化、纯静态、多类型资源分享网站。支持网页推荐、软件下载、文件分享和技术文章四种资源类型，并集成了**爱发电兑换码付费系统**及**防复制保护**。

**在线演示：** `https://watchfleeting.github.io/starsea-shares/`

---

## ✨ 核心特性

- **📂 纯静态架构**：无需服务器与数据库，完全依赖 GitHub Pages 免费托管。
- **📝 Markdown 驱动**：所有内容（资源卡片、文章、文件详情）均通过 Markdown 文件管理，易于编写与维护。
- **🔗 多资源类型**：清晰区分**网页分享**、**软件分享**、**文件分享**和**文章分享**。
- **🎨 现代化 UI**：响应式设计，支持深色/浅色主题，拥有平滑的交互动画与毛玻璃效果。
- **💰 爱发电付费集成**：通过兑换码实现付费内容解锁，用户赞助后获得兑换码，输入后自动显示下载链接。
- **🛡️ 防复制保护**：禁用右键、选择、复制快捷键及开发者工具快捷键，保护付费资源。
- **⚡ 性能优异**：快速的加载速度与流畅的浏览体验。

---

## 🚀 快速开始

### 1. 获取项目
将项目代码部署到你的 GitHub 仓库。你可以选择：
- **Fork** 本模板仓库。
- 或直接**下载源码**，上传到你自己的新仓库。

### 2. 启用 GitHub Pages
1.  进入仓库的 **Settings**（设置）页面。
2.  在左侧边栏中选择 **Pages**（页面）。
3.  在 **Source**（来源）部分，选择 `Deploy from a branch`（从分支部署）。
4.  在 **Branch**（分支）部分，选择你的主分支（如 `main` 或 `master`），文件夹选择 `/(root)`（根目录）。
5.  点击 **Save**（保存）。稍等片刻，你的网站就会在 `https://<你的用户名>.github.io/<仓库名>` 上线。

### 3. 初始化本地内容
按照下文 **“📁 项目结构”** 和 **“📝 内容管理”** 章节的说明，创建并修改示例 Markdown 文件和 `data-index.json` 索引。

---

## 📁 项目结构

```

你的仓库根目录/
├── index.html                 # 网站唯一的主页面
├── data-index.json            # 核心索引文件，列出所有需加载的.md文件
├── README.md                  # 本说明文件
├── success.html               # （可选）支付成功跳转页面，可保留或删除
│
├── data/                      # 所有内容数据
│   ├── cards/                 # 资源卡片定义（一个.md文件对应一张首页卡片）
│   │
│   ├── articles/              # 完整文章内容（由文章卡片调用）
│   │
│   └── files/                 # 文件分享详情（由文件卡片调用）
│
└── assets/                    # 静态资源（图片、文件等）
└── covers/                # 卡片封面图片

```

---

## 📝 内容管理：一切皆 Markdown

所有内容都通过编写 Markdown 文件来创建。每个 `.md` 文件都包含 **YAML 前置元数据（Front Matter）** 和正文内容。

### 1. 资源卡片 (`data/cards/` 目录下)
每个文件定义首页上的一张卡片。

**文件名示例：** `my-resource.md`
````yaml
---
# 基础信息
id: 1
title: "资源名称"
description: "关于这个资源的一段详细描述。"
category: "分类名称"
type: "web" # 类型：web(网页)/software(软件)/file(文件)/article(文章)
icon: "fas fa-globe" # FontAwesome 图标类名

# 展示信息
tags: ["热门", "推荐"]
author: "鸿渚"
date: "2025-01-20"
cover: "/assets/covers/cover.jpg" # 卡片背景图URL

# --- 类型专属字段（根据上述 type 选择填写）---
# 类型为 ‘web‘ 或 ‘software’ 时填写：
url: "https://example.com"

# 类型为 ‘article‘ 时填写：
contentRef: "data/articles/my-article.md"

# 类型为 ‘file‘ 时填写：
fileRef: "data/files/my-file-details.md"

# --- 付费功能字段（可选）---
is_paid: true
price: 9.99
currency: "CNY"
resource_id: "design-pack-101"   # 资源唯一ID，用于兑换码验证
---
（这里是卡片的备注区，可为空。主页不会显示这里的内容。）
```

2. 完整文章 (data/articles/ 目录下)

当用户点击类型为 article 的卡片时，会展示对应文件的内容。

文件名示例： my-article.md

```yaml
---
id: "article-1"
title: "文章标题"
author: "作者"
date: "2025-01-20"
readTime: "10分钟阅读"
tags: ["教程", "Markdown"]
---
# 这里是文章的正文
使用标准的 **Markdown 语法** 来书写你的精彩内容。
```

3. 文件详情 (data/files/ 目录下)

当用户点击类型为 file 的卡片时，会展示对应文件的下载信息和详情。

文件名示例： my-file-details.md

```yaml
---
id: "file-1"
title: "文件展示标题"
fileName: "ultimate-resources.zip"
fileSize: "215 MB"
fileType: "zip"
downloadUrl: "https://your-cdn.com/file.zip" # 文件的实际下载直链
password: "" # 解压密码（如有）
description: "这里是文件的详细描述和使用说明。"
---
## 🗂️ 内容清单
- 具体包含哪些资源...
- 使用教程...
```

4. 更新索引 (data-index.json)

重要！ 每当你新增了 .md 文件，都必须在根目录的 data-index.json 文件中注册它的路径。

```json
{
  "cards": [
    "data/cards/design_resources.md",
    "data/cards/ai_painting.md"
    // ... 其他卡片
  ],
  "articles": [
    "data/articles/ai-painting-guide.md"
    // ... 其他文章
  ],
  "files": [
    "data/files/design-resources-details.md"
    // ... 其他文件详情
  ]
}
```

---

⚙️ 付费功能配置（爱发电兑换码系统）

本项目采用 兑换码系统 实现爱发电付费内容解锁。流程如下：

1. 创作者在爱发电创建商品，并在发货内容中填入一次性兑换码。
2. 用户赞助后，在爱发电页面直接看到兑换码。
3. 用户回到网站，在资源详情页输入兑换码。
4. 前端调用云函数验证，验证通过后显示下载链接。

部署云函数（必须）

你需要一个简单的后端来验证兑换码。推荐使用 Vercel 免费部署。

云函数代码示例 (api/verify-redeem.js)

```javascript
// 使用内存存储已使用兑换码（生产环境建议使用数据库）
const usedCodes = new Set();

// 预定义的兑换码列表（实际应从环境变量或数据库读取）
const validCodes = {
    'design-pack-101': [  // resource_id 对应的有效兑换码
        'R20250321ABCDEF',
        'R20250322GHIJKL',
    ]
};

const downloadUrls = {
    'design-pack-101': 'https://your-cdn.com/design-pack.zip',
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    return res.status(200).json({
        success: true,
        downloadUrl: downloadUrls[resourceId] || null
    });
}
```

部署步骤

1. 在项目根目录创建 api/verify-redeem.js，粘贴上述代码。
2. 将项目推送到 GitHub。
3. 在 Vercel 中导入该仓库，部署后获得域名如 your-project.vercel.app。
4. 修改 index.html 中的 CONFIG.verifyApiUrl 为你的云函数地址：https://your-project.vercel.app/api/verify-redeem。

安全提示：生产环境请使用数据库（如 Vercel KV）存储已使用兑换码，并将有效码列表存储在环境变量中。

---

🛡️ 防复制功能说明

为保护付费资源，网站已内置多层防复制机制：

· CSS 禁止选中：user-select: none 阻止文本选择。
· 禁用右键菜单：contextmenu 事件被阻止。
· 禁用常用快捷键：Ctrl+C、Ctrl+A、Ctrl+S、Ctrl+U、F12、Ctrl+Shift+I 等均被拦截。
· 禁用复制事件：copy 事件被阻止。
· 下载链接不暴露文本：下载按钮使用 JavaScript 动态触发，不显示真实 URL。
· 简单开发者工具检测：检测窗口大小变化，但仅记录日志，不干扰正常使用。

---

🎨 自定义与扩展

· 修改网站信息：直接编辑 index.html 文件中的 <title> 和 <header> 部分。
· 调整主题颜色：在 index.html 的 <style> 标签内修改 :root 下的 CSS 变量。
· 添加新资源类型：需要在 index.html 的 JavaScript 逻辑和 CSS 样式中同时添加对新类型的支持。

---

❓ 常见问题 (FAQ)

Q: 为什么我新加的卡片没有显示在首页？
A: 请按顺序检查：1. 确保 data-index.json 中已添加了新卡片的路径；2. 检查 Markdown 文件的 YAML 格式是否正确；3. 尝试清除浏览器缓存后刷新。

Q: 网站流量和存储有限制吗？
A: GitHub Pages 每月有 100GB 带宽和 1GB 存储空间的限制。如果分享大型文件，强烈建议使用第三方对象存储服务（如阿里云OSS、Backblaze B2），并将 downloadUrl 指向该服务提供的链接。

Q: 如何备份我的内容？
A: 整个 data/ 目录包含了你的所有核心内容，定期备份此目录和 data-index.json 文件即可。

---

📄 许可证

本项目采用 MIT 许可证。您可以自由地使用、修改和分发此项目。

---

🤝 贡献与支持

欢迎提交 Issue 和 Pull Request 来改进项目！
如果您觉得这个项目有帮助，请给它一个 ⭐ Star，这是对开发者最大的鼓励。

遇到问题？

· 请先查阅本文件及代码注释。
· 通过 GitHub Issues 提交问题。
· 如需安全漏洞报告，请通过邮件私下联系。