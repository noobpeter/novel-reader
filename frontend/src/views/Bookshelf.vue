<template>
  <div class="bookshelf">
    <header class="header">
      <router-link to="/" class="back">← 返回</router-link>
      <h1>我的书架</h1>
    </header>

    <div class="view-toggle">
      <button @click="viewMode = 'grid'" :class="{ active: viewMode === 'grid' }">⊞ 宫格</button>
      <button @click="viewMode = 'list'" :class="{ active: viewMode === 'list' }">☰ 列表</button>
    </div>

    <div class="book-list" :class="viewMode" v-if="books.length > 0">
      <div 
        v-for="book in books" 
        :key="book.id" 
        class="book-item" 
        @click="readBook(book)"
      >
        <div class="book-cover">{{ book.cover || '📗' }}</div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p class="author">{{ book.author }}</p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: book.progress + '%' }"></div>
          </div>
          <p class="progress-text">
            读到第{{ book.currentChapter || 1 }}章 · {{ book.progress || 0 }}%
          </p>
        </div>
        <button 
          class="delete-btn" 
          @click.stop="removeBook(book.id)"
          title="从书架移除"
        >
          ×
        </button>
      </div>
    </div>

    <div v-if="books.length === 0" class="empty">
      <p>书架空空如也~</p>
      <router-link to="/search" class="btn-primary">去搜索小说</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBookshelf, removeFromBookshelf } from '../utils/api'

const router = useRouter()
const viewMode = ref('grid')
const books = ref([])
const loading = ref(false)

onMounted(() => {
  loadBooks()
})

const loadBooks = async () => {
  loading.value = true
  try {
    books.value = await getBookshelf()
  } catch (error) {
    console.error('获取书架失败:', error)
    alert('获取书架失败')
  } finally {
    loading.value = false
  }
}

const readBook = (book) => {
  router.push(`/reader/${book.id}?chapter=${book.currentChapter || 1}`)
}

const removeBook = async (bookId) => {
  if (!confirm('确定要从书架移除这本书吗？')) return
  
  try {
    await removeFromBookshelf(bookId)
    books.value = books.value.filter(b => b.id !== bookId)
  } catch (error) {
    alert('移除失败：' + error.message)
  }
}
</script>

<style scoped>
.bookshelf {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.back {
  color: #2D5A4A;
  text-decoration: none;
}

.view-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.view-toggle button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
}

.view-toggle button.active {
  background: #2D5A4A;
  color: white;
  border-color: #2D5A4A;
}

.book-list {
  display: grid;
  gap: 20px;
}

.book-list.grid {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.book-list.list {
  grid-template-columns: 1fr;
}

.book-item {
  background: white;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
}

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.book-cover {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 10px;
}

.book-info h3 {
  font-size: 1rem;
  margin-bottom: 5px;
}

.author {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 10px;
}

.progress-bar {
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin: 10px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #2D5A4A;
  border-radius: 2px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.8rem;
  color: #999;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #ff4444;
  color: white;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-item:hover .delete-btn {
  opacity: 1;
}

.empty {
  text-align: center;
  padding: 60px;
}

.empty p {
  color: #999;
  margin-bottom: 20px;
}

.btn-primary {
  padding: 12px 30px;
  background: #2D5A4A;
  color: white;
  border-radius: 25px;
  text-decoration: none;
  display: inline-block;
}
</style>