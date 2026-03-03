const express = require('express');
const router = express.Router();
const spiderService = require('../services/spider.service');

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

// 获取书架（从内存/数据库）
let bookshelf = []; // 演示用，实际应该使用数据库

router.get('/bookshelf', async (req, res) => {
  res.json({ success: true, books: bookshelf });
});

// 添加到书架
router.post('/bookshelf', async (req, res) => {
  try {
    const book = req.body;
    const exists = bookshelf.find(b => b.id === book.id);
    if (!exists) {
      bookshelf.push({
        ...book,
        currentChapter: 1,
        progress: 0,
        addedAt: new Date().toISOString()
      });
    }
    res.json({ success: true, message: '已添加到书架' });
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
    const book = bookshelf.find(b => b.id === id);
    if (book) {
      book.currentChapter = chapter;
      book.progress = progress;
      book.lastReadAt = new Date().toISOString();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('更新进度失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 从书架删除
router.delete('/bookshelf/:id', async (req, res) => {
  try {
    const { id } = req.params;
    bookshelf = bookshelf.filter(b => b.id !== id);
    res.json({ success: true, message: '已从书架移除' });
  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

module.exports = router;