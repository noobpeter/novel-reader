// 全本小说网 (quanben-xiaoshuo.com) 爬虫配置
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://quanben-xiaoshuo.com';

// 搜索书籍
async function searchBooks(keyword) {
  try {
    const url = `${BASE_URL}/?c=book&a=search.json&keywords=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    // 解析JSONP响应
    const jsonp = response.data;
    const match = jsonp.match(/search\(({.+})\);/);
    if (!match) return [];
    
    const data = JSON.parse(match[1]);
    if (data.id === 0) {
      // 没有搜索结果，尝试从分类获取
      return await getBooksFromCategory();
    }
    
    // 解析HTML内容提取书籍信息
    const $ = cheerio.load(data.content);
    const books = [];
    
    $('.book').each((i, elem) => {
      const title = $(elem).find('h1').text().trim();
      const link = $(elem).find('a').attr('href');
      if (title && link) {
        books.push({
          id: link.replace('/n/', '').replace('/', ''),
          title,
          author: $(elem).find('.author').text().trim() || '未知',
          intro: $(elem).find('.description').text().trim() || '',
          cover: '📘',
          sourceSite: '全本小说网',
          sourceUrl: `${BASE_URL}${link}`
        });
      }
    });
    
    return books;
  } catch (error) {
    console.error('搜索失败:', error.message);
    // 搜索失败时返回分类书籍
    return await getBooksFromCategory();
  }
}

// 从分类获取书籍
async function getBooksFromCategory(category = 'xuanhuanxiaoshuo') {
  try {
    const url = `${BASE_URL}/category/${category}.html`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const books = [];
    
    // 提取书籍链接
    $('a[href^="/n/"]').each((i, elem) => {
      if (i >= 10) return; // 限制数量
      
      const link = $(elem).attr('href');
      const title = $(elem).text().trim();
      
      if (link && title && link.startsWith('/n/')) {
        const id = link.replace('/n/', '').replace('/', '');
        if (!books.find(b => b.id === id)) {
          books.push({
            id,
            title,
            author: '未知',
            intro: '',
            cover: '📘',
            sourceSite: '全本小说网',
            sourceUrl: `${BASE_URL}${link}`
          });
        }
      }
    });
    
    return books;
  } catch (error) {
    console.error('获取分类失败:', error.message);
    return [];
  }
}

// 获取书籍详情
async function getBookDetail(bookId) {
  try {
    const url = `${BASE_URL}/n/${bookId}/`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    const title = $('.info .h1').text().trim();
    const author = $('.info p:contains("作者") span').text().trim();
    const category = $('.info p:contains("类别") span').text().trim();
    const intro = $('.articlebody p').text().trim();
    const cover = $('.pic img').attr('src') || '';
    
    // 获取章节列表
    const chapters = [];
    // 章节列表通常在另一个页面，如 xiaoshuo.html
    
    return {
      id: bookId,
      title: title || '未知书名',
      author: author || '未知作者',
      category,
      intro: intro || '暂无简介',
      cover: cover ? `📘` : '📘',
      sourceSite: '全本小说网',
      sourceUrl: url,
      chapters
    };
  } catch (error) {
    console.error('获取详情失败:', error.message);
    return null;
  }
}

// 获取章节列表
async function getChapters(bookId) {
  try {
    const url = `${BASE_URL}/n/${bookId}/xiaoshuo.html`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const chapters = [];
    
    // 查找章节链接
    $('a[href*="/n/"]').each((i, elem) => {
      const link = $(elem).attr('href');
      const title = $(elem).text().trim();
      
      if (link && link.includes(bookId) && title) {
        const match = link.match(/\/(\d+)\.html$/);
        if (match) {
          chapters.push({
            id: parseInt(match[1]),
            number: parseInt(match[1]),
            title,
            url: `${BASE_URL}${link}`
          });
        }
      }
    });
    
    return chapters;
  } catch (error) {
    console.error('获取章节失败:', error.message);
    return [];
  }
}

// 获取章节内容
async function getChapterContent(bookId, chapterId) {
  try {
    const url = `${BASE_URL}/n/${bookId}/${chapterId}.html`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    const title = $('.title').text().trim();
    const content = $('.articlebody').text().trim();
    
    return {
      id: chapterId,
      number: parseInt(chapterId),
      title: title || `第${chapterId}章`,
      content: content || '内容加载失败'
    };
  } catch (error) {
    console.error('获取内容失败:', error.message);
    return null;
  }
}

// 测试爬虫
async function testSpider() {
  console.log('🕷️ 测试全本小说网爬虫...\n');
  
  // 1. 搜索书籍
  console.log('1. 搜索书籍...');
  const books = await getBooksFromCategory('xuanhuanxiaoshuo');
  console.log(`找到 ${books.length} 本书`);
  if (books.length > 0) {
    console.log('第一本书:', books[0].title, '-', books[0].id);
  }
  
  // 2. 获取详情
  if (books.length > 0) {
    console.log('\n2. 获取书籍详情...');
    const detail = await getBookDetail(books[0].id);
    console.log('书名:', detail?.title);
    console.log('作者:', detail?.author);
    console.log('简介:', detail?.intro?.substring(0, 100) + '...');
    
    // 3. 获取章节
    console.log('\n3. 获取章节列表...');
    const chapters = await getChapters(books[0].id);
    console.log(`找到 ${chapters.length} 章`);
    if (chapters.length > 0) {
      console.log('第一章:', chapters[0].title);
      
      // 4. 获取内容
      console.log('\n4. 获取章节内容...');
      const content = await getChapterContent(books[0].id, chapters[0].id);
      console.log('内容长度:', content?.content?.length);
      console.log('内容预览:', content?.content?.substring(0, 200) + '...');
    }
  }
  
  console.log('\n✅ 爬虫测试完成！');
}

module.exports = {
  searchBooks,
  getBooksFromCategory,
  getBookDetail,
  getChapters,
  getChapterContent,
  testSpider
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testSpider();
}