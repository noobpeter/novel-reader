# 📚 NovelReader - 小说阅读器

一个简洁优雅的网页版小说阅读器，支持**真实书源爬取**、书架管理和沉浸式阅读体验。

## ✨ 功能特性

- 🔍 **智能搜索** - 从全本小说网爬取真实书籍数据
- 📖 **书架管理** - 收藏喜爱的小说，追踪阅读进度（持久化存储）
- 📱 **沉浸阅读** - 支持多种阅读主题和字体设置
- 🕷️ **自动爬虫** - 自动获取小说章节内容
- 💾 **本地存储** - 数据保存在本地SQLite，无需登录
- ⚡ **一键启动** - 单条命令启动前后端服务

## 🚀 快速开始

### 方式一：一键启动（推荐）

```bash
git clone https://github.com/noobpeter/novel-reader.git
cd novel-reader
./start.sh
```

然后打开浏览器访问 http://localhost:5173

### 方式二：手动启动

```bash
# 1. 克隆项目
git clone https://github.com/noobpeter/novel-reader.git
cd novel-reader

# 2. 启动后端
cd backend
npm install
npm start

# 3. 启动前端（新终端）
cd frontend
npm install
npm run dev

# 4. 访问
打开浏览器访问 http://localhost:5173
```

## 📖 使用指南

### 搜索小说
1. 在首页点击"搜索"或直接在搜索框输入关键词
2. 系统会从**全本小说网**实时爬取相关书籍
3. 点击书籍查看详情

### 加入书架
1. 在书籍详情页点击"加入书架"
2. 书籍会自动保存到本地数据库
3. 刷新页面后书架数据不会丢失

### 阅读小说
1. 从书架或搜索结果进入阅读页面
2. 支持点击翻页或滑动翻页
3. 可调节字体大小、背景主题
4. 自动保存阅读进度

### 书源说明
- ✅ **全本小说网** (quanben-xiaoshuo.com) - 已集成，可用
- ⚠️ 其他书源（笔趣阁等）- 因网络限制暂时不可用

## 📁 项目结构

```
novel-reader/
├── start.sh           # 一键启动脚本 ⭐
├── frontend/          # Vue 3 前端
│   ├── src/
│   │   ├── views/    # 页面组件
│   │   ├── stores/   # Pinia状态管理
│   │   └── utils/    # 工具函数
│   └── package.json
├── backend/           # Node.js 后端
│   ├── src/
│   │   ├── routes/   # API路由
│   │   ├── services/ # 业务逻辑
│   │   └── spiders/  # 爬虫模块 🕷️
│   └── package.json
├── database/          # SQLite数据库
└── README.md
```

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS + Pinia
- **后端**: Node.js + Express + SQLite3 (better-sqlite3)
- **爬虫**: Axios + Cheerio

## 💻 系统兼容性

| 平台 | 架构 | 支持状态 |
|------|------|----------|
| macOS | Intel (x86_64) | ✅ 完整支持 |
| macOS | Apple Silicon (ARM64/M1/M2/M3) | ✅ 完整支持 |
| Linux | x86_64 / ARM64 | ✅ 支持 |
| Windows | x86_64 | ✅ 支持 |

**注意**: 使用 `better-sqlite3` 数据库，原生支持多架构，无需额外配置。（已集成全本小说网）

## 🔧 开发相关

### 环境要求
- Node.js >= 16
- npm >= 8

### 常用命令

```bash
# 一键启动
./start.sh

# 仅启动后端
cd backend && npm start

# 仅启动前端
cd frontend && npm run dev

# 前端构建
cd frontend && npm run build
```

### API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/search?q=keyword | GET | 搜索书籍 |
| /api/book/:id | GET | 获取书籍详情 |
| /api/book/:id/chapter/:no | GET | 获取章节内容 |
| /api/bookshelf | GET | 获取书架列表 |
| /api/bookshelf | POST | 添加到书架 |
| /api/bookshelf/:id/progress | PUT | 更新阅读进度 |

## ⚠️ 免责声明

本项目仅供学习研究使用：
- 爬取的小说内容版权归原作者所有
- 请遵守相关网站的robots协议
- 建议支持正版阅读
- 请勿用于商业用途

## 📝 更新日志

### 2026-03-03
- ✅ 集成全本小说网真实书源
- ✅ 一键启动脚本
- ✅ 完整搜索/书架/阅读功能
- ✅ 数据持久化（SQLite）

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 License

MIT License