import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookStore = defineStore('book', () => {
  // 书架列表
  const bookshelf = ref([])
  
  // 当前阅读的书籍
  const currentBook = ref(null)
  
  // 搜索历史
  const searchHistory = ref([])
  
  // 添加到书架
  const addToBookshelf = (book) => {
    const exists = bookshelf.value.find(b => b.id === book.id)
    if (!exists) {
      bookshelf.value.push({
        ...book,
        currentChapter: 1,
        progress: 0,
        lastReadAt: new Date().toISOString()
      })
      // 保存到本地存储
      localStorage.setItem('bookshelf', JSON.stringify(bookshelf.value))
    }
  }
  
  // 从本地存储加载
  const loadBookshelf = () => {
    const saved = localStorage.getItem('bookshelf')
    if (saved) {
      bookshelf.value = JSON.parse(saved)
    }
  }
  
  // 更新阅读进度
  const updateProgress = (bookId, chapter, progress) => {
    const book = bookshelf.value.find(b => b.id === bookId)
    if (book) {
      book.currentChapter = chapter
      book.progress = progress
      book.lastReadAt = new Date().toISOString()
      localStorage.setItem('bookshelf', JSON.stringify(bookshelf.value))
    }
  }
  
  // 添加搜索历史
  const addSearchHistory = (keyword) => {
    if (!searchHistory.value.includes(keyword)) {
      searchHistory.value.unshift(keyword)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }
  }
  
  return {
    bookshelf,
    currentBook,
    searchHistory,
    addToBookshelf,
    loadBookshelf,
    updateProgress,
    addSearchHistory
  }
})