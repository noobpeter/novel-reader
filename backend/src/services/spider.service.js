// 书源配置
const sources = [
  {
    name: '笔趣阁',
    baseUrl: 'https://www.biquge.com',
    searchUrl: 'https://www.biquge.com/search?keyword={keyword}',
    selectors: {
      bookList: '.result-list .result-item',
      title: 'h3 a',
      author: '.author',
      intro: '.intro',
      link: 'h3 a@href'
    }
  },
  {
    name: '新笔趣阁',
    baseUrl: 'https://www.xbiquge.so',
    searchUrl: 'https://www.xbiquge.so/search.php?keyword={keyword}',
    selectors: {
      bookList: '#main .grid tr',
      title: 'td:nth-child(1) a',
      author: 'td:nth-child(3)',
      intro: '.intro',
      link: 'td:nth-child(1) a@href'
    }
  }
];

// 搜索书籍
async function searchFromSource(source, keyword) {
  const axios = require('axios');
  const cheerio = require('cheerio');
  
  try {
    const url = source.searchUrl.replace('{keyword}', encodeURIComponent(keyword));
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const books = [];
    
    $(source.selectors.bookList).each((i, elem) => {
      if (i >= 10) return; // 限制结果数量
      
      const title = $(elem).find(source.selectors.title).text().trim();
      const author = $(elem).find(source.selectors.author).text().trim();
      const intro = $(elem).find(source.selectors.intro).text().trim();
      const link = $(elem).find(source.selectors.link).attr('href');
      
      if (title) {
        books.push({
          title,
          author: author || '未知',
          intro: intro || '暂无简介',
          sourceUrl: link,
          sourceSite: source.name
        });
      }
    });
    
    return books;
  } catch (error) {
    console.error(`${source.name} 搜索失败:`, error.message);
    return [];
  }
}

// 多源搜索
async function searchBooks(keyword) {
  const allResults = [];
  
  for (const source of sources) {
    const results = await searchFromSource(source, keyword);
    allResults.push(...results);
  }
  
  return allResults;
}

module.exports = {
  sources,
  searchBooks
};