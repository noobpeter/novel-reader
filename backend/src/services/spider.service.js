// 导入全本小说网爬虫
const quanbenSpider = require('../spiders/quanben');

// 书源配置
const sources = [
  {
    name: '全本小说网',
    type: 'quanben',
    enabled: true
  },
  {
    name: '笔趣阁',
    type: 'mock',
    enabled: false // 网络受限
  }
];

// 模拟书籍数据（备用）
const mockBooks = [
  {
    id: 'mock-1',
    title: '斗破苍穹',
    author: '天蚕土豆',
    intro: '这里是斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！',
    cover: '📕',
    status: '完本',
    totalChapters: 1621,
    sourceSite: '模拟数据',
    sourceUrl: '#'
  },
  {
    id: 'mock-2',
    title: '凡人修仙传',
    author: '忘语',
    intro: '一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子...',
    cover: '📗',
    status: '完本',
    totalChapters: 2446,
    sourceSite: '模拟数据',
    sourceUrl: '#'
  }
];

// 搜索书籍（优先使用真实书源）
async function searchBooks(keyword) {
  if (!keyword || keyword.trim() === '') {
    return [];
  }
  
  try {
    // 尝试从全本小说网搜索
    const books = await quanbenSpider.getBooksFromCategory('xuanhuanxiaoshuo');
    
    // 过滤匹配关键词的书籍
    const filtered = books.filter(book => {
      return book.title.includes(keyword) || 
             book.author?.includes(keyword);
    });
    
    // 如果找到匹配的书籍，返回结果
    if (filtered.length > 0) {
      return filtered.map(book => ({
        ...book,
        status: '连载',
        totalChapters: book.totalChapters || 0
      }));
    }
    
    // 如果没有精确匹配，返回前几本作为推荐
    return books.slice(0, 8).map(book => ({
      ...book,
      status: '连载',
      totalChapters: book.totalChapters || 0
    }));
    
  } catch (error) {
    console.error('真实书源搜索失败，使用模拟数据:', error.message);
    // 降级到模拟数据
    return mockBooks.filter(book => {
      return book.title.includes(keyword) || 
             book.author.includes(keyword);
    });
  }
}

// 获取书籍详情
async function getBookDetail(bookId) {
  // 判断是否为真实书源ID（全本小说网的ID通常包含连字符）
  if (bookId.includes('-')) {
    try {
      const detail = await quanbenSpider.getBookDetail(bookId);
      if (detail) {
        // 获取章节列表
        const chapters = await quanbenSpider.getChapters(bookId);
        return {
          ...detail,
          status: '连载',
          totalChapters: chapters.length,
          chapters: chapters.map(c => ({ 
            id: c.id, 
            number: c.number, 
            title: c.title 
          }))
        };
      }
    } catch (error) {
      console.error('获取真实书籍详情失败:', error.message);
    }
  }
  
  // 降级到模拟数据
  const book = mockBooks.find(b => b.id === bookId);
  if (!book) {
    // 如果找不到，返回一个默认的书籍
    return {
      id: bookId,
      title: '未知书籍',
      author: '未知作者',
      intro: '暂无简介',
      cover: '📘',
      status: '连载',
      totalChapters: 0,
      sourceSite: '全本小说网',
      sourceUrl: '#',
      chapters: []
    };
  }
  
  return {
    ...book,
    chapters: []
  };
}

// 获取章节内容
async function getChapter(bookId, chapterNo) {
  // 尝试从真实书源获取
  if (bookId.includes('-')) {
    try {
      const content = await quanbenSpider.getChapterContent(bookId, chapterNo);
      if (content && content.content) {
        return {
          bookId,
          chapterNo: parseInt(chapterNo),
          title: content.title || `第${chapterNo}章`,
          content: content.content
        };
      }
    } catch (error) {
      console.error('获取真实章节内容失败:', error.message);
    }
  }
  
  // 降级到模拟数据
  return {
    bookId,
    chapterNo: parseInt(chapterNo),
    title: `第${chapterNo}章`,
    content: `这是第${chapterNo}章的内容。

（如果长时间无法加载，可能是网络问题或该章节不存在）

内容示例：

春风和煦，阳光明媚。

这是一个平凡的早晨，却注定不平凡。

主角站在窗前，望着远处的山峦，心中思绪万千...

---

提示：本项目仅供学习研究使用，请支持正版阅读。`
  };
}

module.exports = {
  sources,
  searchBooks,
  getBookDetail,
  getChapter
};