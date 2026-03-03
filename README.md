# 📚 NovelReader - 小说阅读器

一个简洁优雅的网页版小说阅读器，支持多源搜索、书架管理和沉浸式阅读体验。

## ✨ 功能特性

- 🔍 **智能搜索** - 聚合多个书源搜索小说
- 📖 **书架管理** - 收藏喜爱的小说，追踪阅读进度
- 📱 **沉浸阅读** - 支持多种阅读主题和字体设置
- 🕷️ **自动爬虫** - 自动获取小说章节内容
- 💾 **本地存储** - 数据保存在本地，无需登录

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/noobpeter/novel-reader.git
cd novel-reader
```

### 2. 启动后端
```bash
cd backend
npm install
npm start
```

### 3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

### 4. 访问
打开浏览器访问 http://localhost:5173

## 📁 项目结构

```
novel-reader/
├── frontend/          # Vue 3 前端
│   ├── src/
│   │   ├── views/    # 页面组件
│   │   ├── stores/   # Pinia状态管理
│   │   └── utils/    # 工具函数
│   └── package.json
├── backend/           # Node.js 后端
│   ├── src/
│   │   ├── routes/   # API路由
│   │   └── services/ # 业务逻辑
│   └── package.json
└── database/          # SQLite数据库
```

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS + Pinia
- **后端**: Node.js + Express + SQLite3
- **爬虫**: Axios + Cheerio

## ⚠️ 免责声明

本项目仅供学习研究使用，爬取的小说内容版权归原作者所有。请遵守相关网站的robots协议，合理使用爬虫功能。

## 📄 License

MIT License