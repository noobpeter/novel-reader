<template>
  <div class="home">
    <header class="header">
      <h1 class="title">📚 小说阅读器</h1>
      <p class="subtitle">发现精彩小说，享受阅读时光</p>
    </header>
    
    <div class="search-box" @click="$router.push('/search')">
      <span class="search-icon">🔍</span>
      <span class="search-text">搜索书名、作者...</span>
    </div>
    
    <nav class="quick-nav">
      <router-link to="/search" class="quick-item">
        <span class="icon">🔍</span>
        <span>搜索</span>
      </router-link>
      <router-link to="/bookshelf" class="quick-item">
        <span class="icon">📚</span>
        <span>书架</span>
      </router-link>
    </nav>

    <!-- 最近阅读 -->
    <section class="section" v-if="recentBooks.length > 0">
      <div class="section-header">
        <h2>📖 最近阅读</h2>
        <router-link to="/bookshelf" class="more">查看全部 →</router-link>
      </div>
      <div class="book-list">
        <div 
          v-for="book in recentBooks" 
          :key="book.id" 
          class="book-card horizontal"
          @click="continueReading(book)"
        >
          <div class="book-cover">{{ book.cover || '📘' }}</div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p class="author">{{ book.author }}</p>
            <div class="progress-bar">
              <div class="progress" :style="{ width: (book.progress_percent || 0) + '%' }"></div>
            </div>
            <p class="progress-text">读到第{{ book.current_chapter || 1 }}章 · {{ book.progress_percent || 0 }}%</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门推荐 -->
    <section class="section">
      <h2>🔥 热门推荐</h2>
      <div v-if="loadingHot" class="loading">加载中...</div>
      <div v-else-if="hotBooks.length === 0" class="empty-tip">
        暂无推荐书籍，去搜索看看吧
      </div>
      <div v-else class="book-grid">
        <div 
          v-for="book in hotBooks" 
          :key="book.id" 
          class="book-card"
          @click="viewDetail(book)"
        >
          <div class="book-cover">📘</div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类浏览 -->
    <section class="section">
      <h2>📂 分类浏览</h2>
      <div class="category-grid">
        <div 
          v-for="cat in categories" 
          :key="cat.name"
          class="category-item"
          @click="searchByCategory(cat.keyword)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBookshelf, searchBooks } from '../utils/api'

const router = useRouter()
const recentBooks = ref([])
const hotBooks = ref([])
const loadingHot = ref(false)

const categories = [
  { name: '玄幻', icon: '⚔️', keyword: '玄幻' },
  { name: '修真', icon: '☯️', keyword: '修真' },
  { name: '都市', icon: '🏙️', keyword: '都市' },
  { name: '历史', icon: '📜', keyword: '历史' },
  { name: '科幻', icon: '🚀', keyword: '科幻' },
  { name: '悬疑', icon: '🔮', keyword: '悬疑' },
]

onMounted(() => {
  loadRecentBooks()
  loadHotBooks()
})

const loadRecentBooks = async () => {
  try {
    const books = await getBookshelf()
    recentBooks.value = books.slice(0, 3)
  } catch (error) {
    console.error('获取最近阅读失败:', error)
  }
}

const loadHotBooks = async () => {
  loadingHot.value = true
  try {
    const books = await searchBooks('修仙')
    hotBooks.value = books.slice(0, 6)
  } catch (error) {
    console.error('获取热门书籍失败:', error)
    hotBooks.value = []
  } finally {
    loadingHot.value = false
  }
}

const continueReading = (book) => {
  router.push(`/reader/${book.id}?chapter=${book.current_chapter || 1}`)
}

const viewDetail = (book) => {
  router.push(`/detail/${book.id}`)
}

const searchByCategory = (keyword) => {
  router.push({
    path: '/search',
    query: { q: keyword }
  })
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 100px;
}

.header {
  text-align: center;
  padding: 30px 0;
}

.title {
  font-size: 2rem;
  color: #2D5A4A;
  margin-bottom: 8px;
}

.subtitle {
  color: #888;
  font-size: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: white;
  border-radius: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 20px 0;
  cursor: pointer;
  transition: all 0.3s;
}

.search-box:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.search-icon {
  font-size: 1.2rem;
}

.search-text {
  color: #999;
}

.quick-nav {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 25px 0;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #333;
}

.quick-item .icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2D5A4A;
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
}

.section {
  margin-top: 35px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section h2 {
  font-size: 1.1rem;
  color: #333;
}

.more {
  color: #2D5A4A;
  text-decoration: none;
  font-size: 0.9rem;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.12);
}

.book-card.horizontal {
  display: flex;
  gap: 15px;
  text-align: left;
}

.book-cover {
  font-size: 3.5rem;
  line-height: 1;
}

.book-card.horizontal .book-cover {
  font-size: 3rem;
}

.book-info {
  flex: 1;
}

.book-info h3 {
  font-size: 1rem;
  margin-bottom: 4px;
  color: #333;
}

.book-info .author {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 8px;
}

.progress-bar {
  height: 3px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress {
  height: 100%;
  background: #2D5A4A;
  border-radius: 2px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.75rem;
  color: #999;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.book-grid .book-info p {
  font-size: 0.8rem;
  color: #888;
  margin-top: 4px;
}

.loading, .empty-tip {
  text-align: center;
  padding: 30px;
  color: #999;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.12);
}

.cat-icon {
  font-size: 1.8rem;
}

.cat-name {
  font-size: 0.9rem;
  color: #333;
}
</style>