const express = require('express');
const router = express.Router();

// 搜索书籍
router.get('/search', async (req, res) => {
  const { q } = req.query;
  // TODO: 调用爬虫服务搜索
  res.json({
    keyword: q,
    results: [
      { id: 1, title: '示例书籍1', author: '作者A', intro: '简介...' },
      { id: 2, title: '示例书籍2', author: '作者B', intro: '简介...' },
    ]
  });
});

// 获取书籍详情
router.get('/book/:id', async (req, res) => {
  const { id } = req.params;
  // TODO: 从数据库获取
  res.json({
    id,
    title: '示例书籍',
    author: '作者',
    intro: '简介内容...',
    totalChapters: 100,
    status: '连载中'
  });
});

// 获取章节内容
router.get('/book/:id/chapter/:chapterNo', async (req, res) => {
  const { id, chapterNo } = req.params;
  // TODO: 从数据库或爬虫获取
  res.json({
    bookId: id,
    chapterNo: parseInt(chapterNo),
    title: `第${chapterNo}章`,
    content: '这是章节内容...'
  });
});

// 获取书架
router.get('/bookshelf', async (req, res) => {
  // TODO: 从数据库获取
  res.json([]);
});

// 添加到书架
router.post('/bookshelf', async (req, res) => {
  const book = req.body;
  // TODO: 保存到数据库
  res.json({ success: true, book });
});

// 更新阅读进度
router.put('/bookshelf/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { chapter, progress } = req.body;
  // TODO: 更新数据库
  res.json({ success: true });
});

module.exports = router;