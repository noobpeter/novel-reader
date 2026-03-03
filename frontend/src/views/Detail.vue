<template>
  <div class="detail">
    <header class="header">
      <router-link to="/search" class="back">← 返回</router-link>
      <h1>书籍详情</h1>
    </header>

    <div class="book-detail" v-if="book">
      <div class="book-header">
        <div class="book-cover">{{ book.cover || '📘' }}</div>
        <div class="book-meta">
          <h2>{{ book.title }}</h2>
          <p class="author">👤 {{ book.author }} | 📌 {{ book.status }} | 📚 {{ book.totalChapters }}章</p>
          <p class="source">来源: {{ book.sourceSite }}</p>
          <div class="actions">
            <button 
              @click="addToShelf" 
              class="btn-primary"
              :disabled="isInBookshelf"
            >
              {{ isInBookshelf ? '已在书架' : '加入书架' }}
            </button>
            <button @click="startReading" class="btn-secondary">开始阅读</button>
          </div>
        </div>
      </div>

      <div class="book-intro">
        <h3>简介</h3>
        <p>{{ book.intro || '暂无简介' }}</p>
      </div>

      <div class="chapter-list" v-if="chapters.length > 0">
        <h3>章节目录 ({{ chapters.length }}章)</h3>
        <div class="chapters">
          <div 
            v-for="chapter in displayedChapters" 
            :key="chapter.id"
            class="chapter-item"
            @click="readChapter(chapter)"
          >
            <span>第{{ chapter.number }}章 {{ chapter.title }}</span>
          </div>
        </div>
        <button v-if="chapters.length > 10" @click="showAllChapters = !showAllChapters" class="show-more">
          {{ showAllChapters ? '收起' : '显示全部章节' }}
        </button>
      </div>
      <div v-else class="loading-chapters">
        加载章节列表中...
      </div>
    </div>

    <div v-else-if="loading" class="loading">加载中...</div>
    <div v-else class="error">书籍不存在</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookDetail, addToBookshelf, getBookshelf } from '../utils/api'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

const book = ref(null)
const chapters = ref([])
const loading = ref(false)
const isInBookshelf = ref(false)
const showAllChapters = ref(false)

const displayedChapters = computed(() => {
  if (showAllChapters.value) return chapters.value
  return chapters.value.slice(0, 10)
})

onMounted(() => {
  loadBookDetail()
  checkBookshelf()
})

const loadBookDetail = async () => {
  loading.value = true
  try {
    const data = await getBookDetail(bookId)
    if (data) {
      book.value = data
      chapters.value = data.chapters || []
    }
  } catch (error) {
    console.error('获取书籍详情失败:', error)
  } finally {
    loading.value = false
  }
}

const checkBookshelf = async () => {
  try {
    const bookshelf = await getBookshelf()
    isInBookshelf.value = bookshelf.some(b => b.id === bookId)
  } catch (error) {
    console.error('检查书架失败:', error)
  }
}

const addToShelf = async () => {
  if (!book.value) return
  
  try {
    await addToBookshelf(book.value)
    isInBookshelf.value = true
    alert(`《${book.value.title}》已添加到书架`)
  } catch (error) {
    alert('添加失败：' + error.message)
  }
}

const startReading = () => {
  router.push(`/reader/${bookId}?chapter=1`)
}

const readChapter = (chapter) => {
  router.push(`/reader/${bookId}?chapter=${chapter.number}`)
}
</script>

<style scoped>
.detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back {
  color: #2D5A4A;
  text-decoration: none;
}

.book-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-cover {
  font-size: 6rem;
  flex-shrink: 0;
}

.book-meta {
  flex: 1;
}

.book-meta h2 {
  margin-bottom: 15px;
}

.author, .source {
  color: #666;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
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

.book-intro {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-intro h3 {
  margin-bottom: 15px;
}

.book-intro p {
  color: #666;
  line-height: 1.6;
}

.chapter-list {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chapter-list h3 {
  margin-bottom: 15px;
}

.chapters {
  max-height: 400px;
  overflow-y: auto;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.3s;
}

.chapter-item:hover {
  background: #f5f5f5;
}

.show-more {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.loading, .error, .loading-chapters {
  text-align: center;
  padding: 60px;
  color: #999;
}

.error {
  color: #ff4444;
}
</style>