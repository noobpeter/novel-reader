// 书源配置 - 预留真实书源，当前使用模拟数据
const sources = [
  {
    name: '笔趣阁',
    baseUrl: 'https://www.biquge.com',
    searchUrl: 'https://www.biquge.com/search?keyword={keyword}',
    enabled: false // 网络受限，暂时禁用
  },
  {
    name: '新笔趣阁',
    baseUrl: 'https://www.xbiquge.so',
    searchUrl: 'https://www.xbiquge.so/search.php?keyword={keyword}',
    enabled: false
  }
];

// 模拟书籍数据（演示用）
const mockBooks = [
  {
    id: '1',
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
    id: '2',
    title: '凡人修仙传',
    author: '忘语',
    intro: '一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子...',
    cover: '📗',
    status: '完本',
    totalChapters: 2446,
    sourceSite: '模拟数据',
    sourceUrl: '#'
  },
  {
    id: '3',
    title: '诡秘之主',
    author: '爱潜水的乌贼',
    intro: '蒸汽与机械的浪潮中，谁能触及非凡？历史和黑暗的迷雾里，又是谁在耳语？',
    cover: '📘',
    status: '完本',
    totalChapters: 1394,
    sourceSite: '模拟数据',
    sourceUrl: '#'
  },
  {
    id: '4',
    title: '大奉打更人',
    author: '卖报小郎君',
    intro: '这个世界，有儒；有道；有佛；有妖；有术士。警校毕业的许七安幽幽醒来...',
    cover: '📙',
    status: '完本',
    totalChapters: 1059,
    sourceSite: '模拟数据',
    sourceUrl: '#'
  },
  {
    id: '5',
    title: '深空彼岸',
    author: '辰东',
    intro: '浩瀚的宇宙中，一片死寂。在枯寂的星空中，有一座巨大的钢铁堡垒在漂浮...',
    cover: '📓',
    status: '连载',
    totalChapters: 1265,
    sourceSite: '模拟数据',
    sourceUrl: '#'
  }
];

// 模拟章节数据
const mockChapters = {
  '1': [ // 斗破苍穹示例章节
    { id: 1, number: 1, title: '陨落的天才', content: '第一章内容：这里是斗破苍穹的第一章内容...萧炎从天才跌落为废物，受尽冷眼。' },
    { id: 2, number: 2, title: '斗之气，三段', content: '第二章内容：萧炎的斗之气只有三段，连普通族人都不如...' },
    { id: 3, number: 3, title: '客人', content: '第三章内容：云岚宗来人退婚，萧炎受尽屈辱...' },
    { id: 4, number: 4, title: '云岚宗', content: '第四章内容：纳兰嫣然强势退婚，萧炎写下休书...' },
  ],
  '2': [ // 凡人修仙传示例章节
    { id: 1, number: 1, title: '七玄门', content: '第一章内容：韩立拜入七玄门，开始修仙之路...' },
    { id: 2, number: 2, title: '墨大夫', content: '第二章内容：墨大夫教韩立医术，暗中却另有图谋...' },
    { id: 3, number: 3, title: '长春功', content: '第三章内容：韩立发现神秘小瓶，修炼长春功...' },
  ],
  '3': [ // 诡秘之主示例章节
    { id: 1, number: 1, title: '绯红', content: '第一章内容：周明瑞穿越到异世界，成为克莱恩·莫雷蒂...' },
    { id: 2, number: 2, title: '笔记', content: '第二章内容：克莱恩发现神秘的笔记，上面记载着诡异的仪式...' },
  ],
  '4': [ // 大奉打更人示例章节
    { id: 1, number: 1, title: '牢狱之灾', content: '第一章内容：许七安醒来发现自己身处牢狱，即将被流放...' },
    { id: 2, number: 2, title: '税银案', content: '第二章内容：许七安运用现代知识，开始破解税银案...' },
  ],
  '5': [ // 深空彼岸示例章节
    { id: 1, number: 1, title: '旧土', content: '第一章内容：王煊从旧土走出，进入新星...' },
    { id: 2, number: 2, title: '新术', content: '第二章内容：新术与旧术的对决，王煊展现实力...' },
  ]
};

// 搜索书籍（当前使用模拟数据）
async function searchBooks(keyword) {
  if (!keyword || keyword.trim() === '') {
    return [];
  }
  
  // 模拟搜索延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟匹配
  const results = mockBooks.filter(book => {
    return book.title.includes(keyword) || 
           book.author.includes(keyword) ||
           book.intro.includes(keyword);
  });
  
  // 如果没有匹配，返回所有（演示用）
  if (results.length === 0) {
    return mockBooks;
  }
  
  return results;
}

// 获取书籍详情
async function getBookDetail(bookId) {
  const book = mockBooks.find(b => b.id === bookId);
  if (!book) return null;
  
  const chapters = mockChapters[bookId] || [];
  return {
    ...book,
    chapters: chapters.map(c => ({ id: c.id, number: c.number, title: c.title }))
  };
}

// 获取章节内容
async function getChapter(bookId, chapterNo) {
  const chapters = mockChapters[bookId] || [];
  const chapter = chapters.find(c => c.number === parseInt(chapterNo));
  
  if (!chapter) {
    // 如果没有找到，返回一个默认章节
    return {
      bookId,
      chapterNo: parseInt(chapterNo),
      title: `第${chapterNo}章`,
      content: `这是第${chapterNo}章的内容。\n\n（模拟数据，真实内容需要接入书源爬虫获取）\n\n内容示例：\n\n春风和煦，阳光明媚。\n\n这是一个平凡的早晨，却注定不平凡。\n\n主角站在窗前，望着远处的山峦，心中思绪万千...`
    };
  }
  
  return {
    bookId,
    chapterNo: chapter.number,
    title: chapter.title,
    content: chapter.content
  };
}

module.exports = {
  sources,
  searchBooks,
  getBookDetail,
  getChapter
};