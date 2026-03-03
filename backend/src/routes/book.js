const express = require('express');
const router = express.Router();
const spiderService = require('../services/spider.service');

// 获取数据库实例（从index.js传递）
let db;
const setDatabase = (database) => {
  db = database;
};

// 搜索书籍
router.get('/search', async (req, res) => {
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
router.get('/book/:id', async (req, res) => {
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
router.get('/book/:id/chapter/:chapterNo', async (req, res) => {
  try {
    const { id, chapterNo } = req.params;
    const chapter = await spiderService.getChapter(id, chapterNo);
    res.json({ success: true, chapter });
  } catch (error) {
    console.error('获取章节失败:', error);
    res.status(500).json({ success: false, message: '获取章节失败' });
  }
});

// 获取书架（从数据库）
router.get('/bookshelf', async (req, res) => {
  try {
    const sql = `
      SELECT b.*, bs.current_chapter, bs.progress_percent, bs.last_read_at
      FROM bookshelf bs
      JOIN books b ON bs.book_id = b.id
      ORDER BY bs.last_read_at DESC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('获取书架失败:', err);
        return res.status(500).json({ success: false, message: '获取书架失败' });
      }
      res.json({ success: true, books: rows });
    });
  } catch (error) {
    console.error('获取书架失败:', error);
    res.status(500).json({ success: false, message: '获取书架失败' });
  }
});

// 添加到书架
router.post('/bookshelf', async (req, res) => {
  try {
    const book = req.body;
    
    // 先检查书籍是否已存在
    db.get('SELECT id FROM books WHERE id = ?', [book.id], (err, row) => {
      if (err) {
        console.error('查询书籍失败:', err);
        return res.status(500).json({ success: false, message: '添加失败' });
      }
      
      // 如果书籍不存在，先插入书籍
      if (!row) {
        const insertBookSql = `
          INSERT INTO books (id, title, author, cover, intro, source_url, source_site, status, total_chapters)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(insertBookSql, [
          book.id,
          book.title,
          book.author || '',
          book.cover || '',
          book.intro || '',
          book.sourceUrl || '',
          book.sourceSite || '',
          book.status || '连载',
          book.totalChapters || 0
        ], (err) => {
          if (err) {
            console.error('插入书籍失败:', err);
            return res.status(500).json({ success: false, message: '添加失败' });
          }
          addToBookshelf(book.id);
        });
      } else {
        addToBookshelf(book.id);
      }
    });
    
    function addToBookshelf(bookId) {
      // 检查是否已在书架
      db.get('SELECT id FROM bookshelf WHERE book_id = ?', [bookId], (err, row) => {
        if (err) {
          console.error('查询书架失败:', err);
          return res.status(500).json({ success: false, message: '添加失败' });
        }
        
        if (row) {
          return res.json({ success: true, message: '已在书架' });
        }
        
        // 添加到书架
        const sql = `
          INSERT INTO bookshelf (book_id, current_chapter, progress_percent)
          VALUES (?, 1, 0)
        `;
        db.run(sql, [bookId], (err) => {
          if (err) {
            console.error('添加书架失败:', err);
            return res.status(500).json({ success: false, message: '添加失败' });
          }
          res.json({ success: true, message: '已添加到书架' });
        });
      });
    }
  } catch (error) {
    console.error('添加书架失败:', error);
    res.status(500).json({ success: false, message: '添加失败' });
  }
});

// 更新阅读进度
router.put('/bookshelf/:id/progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { chapter, progress } = req.body;
    
    const sql = `
      UPDATE bookshelf 
      SET current_chapter = ?, progress_percent = ?, last_read_at = datetime('now')
      WHERE book_id = ?
    `;
    
    db.run(sql, [chapter, progress, id], (err) => {
      if (err) {
        console.error('更新进度失败:', err);
        return res.status(500).json({ success: false, message: '更新失败' });
      }
      res.json({ success: true });
    });
  } catch (error) {
    console.error('更新进度失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 从书架删除
router.delete('/bookshelf/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    db.run('DELETE FROM bookshelf WHERE book_id = ?', [id], (err) => {
      if (err) {
        console.error('删除失败:', err);
        return res.status(500).json({ success: false, message: '删除失败' });
      }
      res.json({ success: true, message: '已从书架移除' });
    });
  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

module.exports = { router, setDatabase };