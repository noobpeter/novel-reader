<template>
  <div class="search">
    <header class="search-header">
      <router-link to="/" class="back">← 返回</router-link>
      <h1>搜索小说</h1>
    </header>

    <div class="search-box">
      <input 
        v-model="keyword" 
        @keyup.enter="handleSearch"
        placeholder="输入书名或作者，如：修仙、玄幻" 
        class="search-input"
      />
      <button @click="handleSearch" class="search-btn" :disabled="searching">
        {{ searching ? '搜索中...' : '搜索' }}
      </button>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="searchHistory.length > 0 && !hasSearched">
      <div class="history-header">
        <span>搜索历史</span>
        <button @click="clearHistory" class="clear-btn">清空</button>
      </div>
      <div class="history-tags">
        <span 
          v-for="(item, index) in searchHistory" 
          :key="index"
          class="history-tag"
          @click="keyword = item; handleSearch()"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="results" v-if="hasSearched">
      <div class="results-header" v-if="!searching">
        找到 {{ results.length }} 本相关书籍
      </div>

      <div v-for="book in results" :key="book.id" class="result-item">
        <div class="book-cover">{{ book.cover || '📘' }}</div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">👤 {{ book.author }} | 📌 {{ book.status }} | 📚 {{ book.totalChapters }}章</p>
          <p class="intro">{{ book.intro }}</p>
          <div class="actions">
            <button @click="addToBookshelf(book)" class="btn-primary" :disabled="isInBookshelf(book.id)">
              {{ isInBookshelf(book.id) ? '已在书架' : '加入书架' }}
            </button>
            <button @click="viewDetail(book)" class="btn-secondary">查看详情</button>
          </div>
        </div>
      </div>

      <div v-if="results.length === 0 && !searching" class="empty">
        未找到相关书籍，换个关键词试试
      </div>
    </div>

    <!-- 热门推荐 - 从真实API获取 -->
    <div class="hot-books" v-if="!hasSearched">
      <h3>🔥 热门推荐</h3>
      <div v-if="loadingHot" class="loading">加载中...</div>
      <div v-else-if="hotBooks.length === 0" class="empty-tip">
        暂无推荐，请直接搜索
      </div>
      <div v-else class="book-grid">
        <div 
          v-for="book in hotBooks" 
          :key="book.id" 
          class="book-card"
          @click="keyword = book.title; handleSearch()"
        >
          <div class="cover">📘</div>
          <div class="title">{{ book.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchBooks, addToBookshelf, getBookshelf } from '../utils/api'

const router = useRouter()
const keyword = ref('')
const searching = ref(false)
const hasSearched = ref(false)
const results = ref([])
const bookshelf = ref([])
const searchHistory = ref([])
const hotBooks = ref([])
const loadingHot = ref(false)

onMounted(() => {
  loadSearchHistory()
  loadBookshelf()
  loadHotBooks()
})

const loadSearchHistory = () => {
  const saved = localStorage.getItem('searchHistory')
  if (saved) {
    try {
      const history = JSON.parse(saved)
      // 过滤掉可能存在的mock数据关键词
      const validKeywords = history.filter(item => 
        item && 
        typeof item === 'string' && 
        item.length > 0 &&
        item.length < 50  // 合理长度限制
      )
      searchHistory.value = validKeywords
    } catch (e) {
      searchHistory.value = []
    }
  }
}

const saveSearchHistory = () => {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

const loadBookshelf = async () => {
  try {
    bookshelf.value = await getBookshelf()
  } catch (error) {
    console.error('获取书架失败:', error)
    bookshelf.value = []
  }
}

const loadHotBooks = async () => {
  loadingHot.value = true
  try {
    // 从搜索API获取真实书籍作为热门推荐
    const books = await searchBooks('修仙')
    // 只取前5本作为热门推荐
    hotBooks.value = books.slice(0, 5).map(book => ({
      id: book.id,
      title: book.title
    }))
  } catch (error) {
    console.error('获取热门书籍失败:', error)
    hotBooks.value = []
  } finally {
    loadingHot.value = false
  }
}

const isInBookshelf = (bookId) => {
  return bookshelf.value.some(b => b.id === bookId)
}

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  
  searching.value = true
  hasSearched.value = true
  results.value = [] // 清空之前的结果
  
  try {
    // 保存搜索历史
    const searchTerm = keyword.value.trim()
    if (!searchHistory.value.includes(searchTerm)) {
      searchHistory.value.unshift(searchTerm)
      if (searchHistory.value.length > 10) {
        searchHistory.value.pop()
      }
      saveSearchHistory()
    }
    
    results.value = await searchBooks(searchTerm)
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
  } finally {
    searching.value = false
  }
}

const addToShelf = async (book) => {
  try {
    await addToBookshelf(book)
    alert(`《${book.title}》已添加到书架`)
    loadBookshelf() // 刷新书架状态
  } catch (error) {
    alert('添加失败：' + error.message)
  }
}

const viewDetail = (book) => {
  router.push(`/detail/${book.id}`)
}
</script>

<style scoped>
.search {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back {
  color: #2D5A4A;
  text-decoration: none;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: #2D5A4A;
}

.search-btn {
  padding: 12px 30px;
  background: #2D5A4A;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.search-btn:disabled {
  opacity: 0.6;
}

.search-history {
  margin-bottom: 30px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #666;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-tag {
  padding: 6px 14px;
  background: #f0f0f0;
  border-radius: 15px;
  font-size: 0.9rem;
  cursor: pointer;
}

.results-header {
  color: #666;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.result-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-cover {
  font-size: 4rem;
  flex-shrink: 0;
}

.book-info {
  flex: 1;
}

.book-info h3 {
  margin-bottom: 5px;
}

.author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.intro {
  color: #888;
  font-size: 0.9rem;
  margin: 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: #2D5A4A;
  color: white;
}

.btn-primary:disabled {
  background: #999;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.hot-books {
  margin-top: 30px;
}

.hot-books h3 {
  margin-bottom: 15px;
  color: #333;
}

.loading, .empty-tip {
  text-align: center;
  padding: 30px;
  color: #999;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.book-card {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.book-card:hover {
  transform: translateY(-3px);
}

.book-card .cover {
  font-size: 3rem;
  margin-bottom: 8px;
}

.book-card .title {
  font-size: 0.85rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>