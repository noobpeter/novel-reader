const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 尝试使用 better-sqlite3，如果失败则使用内存数据库
let db;
let useSQLite = false;

try {
  const Database = require('better-sqlite3');
  const dbDir = path.join(__dirname, '../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  db = new Database(path.join(dbDir, 'novel.db'));
  useSQLite = true;
  console.log('✅ 使用 better-sqlite3 数据库');
  
  // 初始化表
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      cover TEXT,
      intro TEXT,
      source_url TEXT,
      source_site TEXT,
      status TEXT DEFAULT '连载',
      total_chapters INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS bookshelf (
      book_id TEXT PRIMARY KEY,
      current_chapter INTEGER DEFAULT 1,
      progress_percent INTEGER DEFAULT 0,
      last_read_at TIMESTAMP
    );
  `);
} catch (err) {
  console.log('⚠️ 使用内存数据库（用于测试）');
  db = require('./db/memory');
}

// API路由
const spiderService = require('./services/spider.service');

// 搜索书籍
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await spiderService.searchBooks(q);
    res.json({ success: true, keyword: q, count: results.length, results });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({ success: false, message: '搜索失败' });
  }
});

// 获取书籍详情
app.get('/api/book/:id', async (req, res) => {
  try {
    const book = await spiderService.getBookDetail(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: '书籍不存在' });
    }
    res.json({ success: true, book });
  } catch (error) {
    console.error('获取详情失败:', error);
    res.status(500).json({ success: false, message: '获取详情失败' });
  }
});

// 获取章节内容
app.get('/api/book/:id/chapter/:chapterNo', async (req, res) => {
  try {
    const chapter = await spiderService.getChapter(req.params.id, req.params.chapterNo);
    res.json({ success: true, chapter });
  } catch (error) {
    console.error('获取章节失败:', error);
    res.status(500).json({ success: false, message: '获取章节失败' });
  }
});

// 获取书架
app.get('/api/bookshelf', (req, res) => {
  try {
    let books;
    if (useSQLite) {
      books = db.prepare(`
        SELECT b.*, bs.current_chapter, bs.progress_percent, bs.last_read_at
        FROM bookshelf bs JOIN books b ON bs.book_id = b.id
        ORDER BY bs.last_read_at DESC
      `).all();
    } else {
      books = db.getBookshelf();
    }
    res.json({ success: true, books });
  } catch (error) {
    console.error('获取书架失败:', error);
    res.status(500).json({ success: false, message: '获取书架失败' });
  }
});

// 添加到书架
app.post('/api/bookshelf', (req, res) => {
  try {
    const book = req.body;
    if (useSQLite) {
      if (!db.prepare('SELECT 1 FROM books WHERE id = ?').get(book.id)) {
        db.prepare(`INSERT INTO books (id, title, author, cover, intro, source_site)
          VALUES (?, ?, ?, ?, ?, ?)`).run(book.id, book.title, book.author || '', book.cover || '', book.intro || '', book.sourceSite || '');
      }
      if (!db.prepare('SELECT 1 FROM bookshelf WHERE book_id = ?').get(book.id)) {
        db.prepare('INSERT INTO bookshelf (book_id) VALUES (?)').run(book.id);
      }
    } else {
      db.addToBookshelf(book);
    }
    res.json({ success: true, message: '已添加到书架' });
  } catch (error) {
    console.error('添加书架失败:', error);
    res.status(500).json({ success: false, message: '添加失败' });
  }
});

// 更新阅读进度
app.put('/api/bookshelf/:id/progress', (req, res) => {
  try {
    const { chapter, progress } = req.body;
    if (useSQLite) {
      db.prepare('UPDATE bookshelf SET current_chapter = ?, progress_percent = ?, last_read_at = datetime("now") WHERE book_id = ?')
        .run(chapter, progress, req.params.id);
    } else {
      db.updateProgress(req.params.id, chapter, progress);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('更新进度失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 从书架删除
app.delete('/api/bookshelf/:id', (req, res) => {
  try {
    if (useSQLite) {
      db.prepare('DELETE FROM bookshelf WHERE book_id = ?').run(req.params.id);
    } else {
      db.removeFromBookshelf(req.params.id);
    }
    res.json({ success: true, message: '已从书架移除' });
  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: useSQLite ? 'sqlite' : 'memory' });
});

// 启动
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`💾 数据库: ${useSQLite ? 'SQLite' : '内存'}`);
});

module.exports = { app, db };