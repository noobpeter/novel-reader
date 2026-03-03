const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 确保数据库目录存在
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 数据库连接
const dbPath = path.join(dbDir, 'novel.db');
console.log('数据库路径:', dbPath);

const db = new Database(dbPath);
console.log('✅ 数据库连接成功');

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
  
  try {
    db.exec(sql);
    console.log('✅ 数据库表初始化完成');
  } catch (err) {
    console.error('数据库表创建失败:', err);
  }
}

initDatabase();

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API路由 - 使用 better-sqlite3 的同步 API
const spiderService = require('./services/spider.service');

// 搜索书籍
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await spiderService.searchBooks(q);
    res.json({
      success: true,
      keyword: q,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({ success: false, message: '搜索失败' });
  }
});

// 获取书籍详情
app.get('/api/book/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await spiderService.getBookDetail(id);
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
    const { id, chapterNo } = req.params;
    const chapter = await spiderService.getChapter(id, chapterNo);
    res.json({ success: true, chapter });
  } catch (error) {
    console.error('获取章节失败:', error);
    res.status(500).json({ success: false, message: '获取章节失败' });
  }
});

// 获取书架
app.get('/api/bookshelf', (req, res) => {
  try {
    const sql = `
      SELECT b.*, bs.current_chapter, bs.progress_percent, bs.last_read_at
      FROM bookshelf bs
      JOIN books b ON bs.book_id = b.id
      ORDER BY bs.last_read_at DESC
    `;
    const books = db.prepare(sql).all();
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
    
    // 检查书籍是否已存在
    const existingBook = db.prepare('SELECT id FROM books WHERE id = ?').get(book.id);
    
    if (!existingBook) {
      // 插入书籍
      const insertBook = db.prepare(`
        INSERT INTO books (id, title, author, cover, intro, source_url, source_site, status, total_chapters)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertBook.run(
        book.id,
        book.title,
        book.author || '',
        book.cover || '',
        book.intro || '',
        book.sourceUrl || '',
        book.sourceSite || '',
        book.status || '连载',
        book.totalChapters || 0
      );
    }
    
    // 检查是否已在书架
    const existingShelf = db.prepare('SELECT id FROM bookshelf WHERE book_id = ?').get(book.id);
    
    if (existingShelf) {
      return res.json({ success: true, message: '已在书架' });
    }
    
    // 添加到书架
    const insertShelf = db.prepare(`
      INSERT INTO bookshelf (book_id, current_chapter, progress_percent)
      VALUES (?, 1, 0)
    `);
    insertShelf.run(book.id);
    
    res.json({ success: true, message: '已添加到书架' });
  } catch (error) {
    console.error('添加书架失败:', error);
    res.status(500).json({ success: false, message: '添加失败' });
  }
});

// 更新阅读进度
app.put('/api/bookshelf/:id/progress', (req, res) => {
  try {
    const { id } = req.params;
    const { chapter, progress } = req.body;
    
    const update = db.prepare(`
      UPDATE bookshelf 
      SET current_chapter = ?, progress_percent = ?, last_read_at = datetime('now')
      WHERE book_id = ?
    `);
    update.run(chapter, progress, id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('更新进度失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 从书架删除
app.delete('/api/bookshelf/:id', (req, res) => {
  try {
    const { id } = req.params;
    const del = db.prepare('DELETE FROM bookshelf WHERE book_id = ?');
    del.run(id);
    res.json({ success: true, message: '已从书架移除' });
  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});

module.exports = { app, db };