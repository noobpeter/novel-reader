// 内存数据存储（用于测试，无需安装 better-sqlite3）
class MemoryDB {
  constructor() {
    this.books = new Map();
    this.bookshelf = new Map();
    this.chapters = new Map();
    
    // 初始化一些测试数据
    this.initTestData();
  }
  
  initTestData() {
    // 添加几本测试书籍
    const testBooks = [
      {
        id: 'wenjianxiuxian-conglianhuawanwukaishi',
        title: '稳健修仙：从炼化万物开始',
        author: '锅锅锅锅贴',
        intro: '【凡人修仙】【苟道+稳健】【该稳则稳，该狠就狠】穿越修仙世界...',
        cover: '📘',
        status: '连载',
        totalChapters: 38,
        sourceSite: '全本小说网',
        sourceUrl: 'https://quanben-xiaoshuo.com/n/wenjianxiuxian-conglianhuawanwukaishi/'
      }
    ];
    
    testBooks.forEach(book => {
      this.books.set(book.id, book);
    });
  }
  
  // 书架操作
  getBookshelf() {
    const result = [];
    for (const [bookId, shelfData] of this.bookshelf) {
      const book = this.books.get(bookId);
      if (book) {
        result.push({
          ...book,
          current_chapter: shelfData.current_chapter,
          progress_percent: shelfData.progress_percent,
          last_read_at: shelfData.last_read_at
        });
      }
    }
    return result.sort((a, b) => new Date(b.last_read_at) - new Date(a.last_read_at));
  }
  
  addToBookshelf(book) {
    // 先保存书籍信息
    if (!this.books.has(book.id)) {
      this.books.set(book.id, book);
    }
    
    // 再添加到书架
    if (!this.bookshelf.has(book.id)) {
      this.bookshelf.set(book.id, {
        book_id: book.id,
        current_chapter: 1,
        progress_percent: 0,
        last_read_at: new Date().toISOString()
      });
      return { success: true, message: '已添加到书架' };
    }
    return { success: true, message: '已在书架' };
  }
  
  updateProgress(bookId, chapter, progress) {
    if (this.bookshelf.has(bookId)) {
      const data = this.bookshelf.get(bookId);
      data.current_chapter = chapter;
      data.progress_percent = progress;
      data.last_read_at = new Date().toISOString();
      return { success: true };
    }
    return { success: false, message: '书籍不在书架' };
  }
  
  removeFromBookshelf(bookId) {
    this.bookshelf.delete(bookId);
    return { success: true };
  }
  
  // 书籍操作
  getBook(id) {
    return this.books.get(id);
  }
  
  saveBook(book) {
    this.books.set(book.id, book);
  }
  
  // 章节操作
  getChapters(bookId) {
    return this.chapters.get(bookId) || [];
  }
  
  saveChapter(bookId, chapterNo, title, content) {
    if (!this.chapters.has(bookId)) {
      this.chapters.set(bookId, []);
    }
    const chapters = this.chapters.get(bookId);
    const existing = chapters.find(c => c.number === parseInt(chapterNo));
    if (existing) {
      existing.title = title;
      existing.content = content;
    } else {
      chapters.push({
        id: parseInt(chapterNo),
        number: parseInt(chapterNo),
        title,
        content
      });
    }
  }
}

// 导出单例
module.exports = new MemoryDB();