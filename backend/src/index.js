const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 确保数据库目录存在
const dbDir = path.join(__dirname, '../database');
if (!require('fs').existsSync(dbDir)) {
  require('fs').mkdirSync(dbDir, { recursive: true });
}

// 数据库连接
const dbPath = path.join(dbDir, 'novel.db');
console.log('数据库路径:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err);
  } else {
    console.log('✅ 数据库连接成功');
    initDatabase();
  }
});

// 初始化数据库表
function initDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      cover TEXT,
      intro TEXT,
      source_url TEXT,
      source_site TEXT,
      status TEXT DEFAULT '连载',
      total_chapters INTEGER DEFAULT 0,
      last_update TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT,
      chapter_no INTEGER,
      title TEXT,
      content TEXT,
      word_count INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS bookshelf (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT UNIQUE,
      current_chapter INTEGER DEFAULT 1,
      progress_percent INTEGER DEFAULT 0,
      is_favorite BOOLEAN DEFAULT 0,
      tags TEXT,
      last_read_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS read_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT,
      chapter_no INTEGER,
      read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      base_url TEXT,
      search_url TEXT,
      selectors TEXT,
      is_enabled BOOLEAN DEFAULT 1,
      priority INTEGER DEFAULT 0
    );
  `;
  
  db.exec(sql, (err) => {
    if (err) {
      console.error('数据库表创建失败:', err);
    } else {
      console.log('✅ 数据库表初始化完成');
    }
  });
}

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API路由
const { router: bookRoutes, setDatabase } = require('./routes/book');
setDatabase(db); // 传递数据库实例
app.use('/api', bookRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

module.exports = { app, db };