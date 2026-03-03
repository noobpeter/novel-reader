<template>
  <div class="detail">
    <header class="header">
      <router-link to="/search" class="back">← 返回</router-link>
      <h1>书籍详情</h1>
    </header>

    <div class="book-detail" v-if="book">
      <div class="book-header">
        <div class="book-cover">📘</div>
        <div class="book-meta">
          <h2>{{ book.title }}</h2>
          <p class="author">👤 {{ book.author }}</p>
          <p class="status">📌 {{ book.status }}</p>
          <p class="chapters">📚 共 {{ book.totalChapters }} 章</p>
          <div class="actions">
            <button @click="addToBookshelf" class="btn-primary">加入书架</button>
            <button @click="startReading" class="btn-secondary">开始阅读</button>
          </div>
        </div>
      </div>

      <div class="book-intro">
        <h3>简介</h3>
        <p>{{ book.intro }}</p>
      </div>

      <div class="chapter-list">
        <h3>章节目录</h3>
        <div class="chapters">
          <div 
            v-for="chapter in chapters" 
            :key="chapter.id"
            class="chapter-item"
            @click="readChapter(chapter)"
          >
            <span>第{{ chapter.number }}章 {{ chapter.title }}</span>
            <span class="chapter-status">{{ chapter.isRead ? '已读' : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

const book = ref({
  id: bookId,
  title: '示例小说',
  author: '作者名',
  status: '连载中',
  totalChapters: 100,
  intro: '这是小说的简介内容...'
})

const chapters = ref([
  { id: 1, number: 1, title: '第一章标题', isRead: false },
  { id: 2, number: 2, title: '第二章标题', isRead: false },
  { id: 3, number: 3, title: '第三章标题', isRead: false },
])

onMounted(() => {
  // TODO: 加载书籍详情
})

const addToBookshelf = () => {
  alert(`已添加《${book.value.title}》到书架`)
}

const startReading = () => {
  router.push(`/reader/${bookId}`)
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
}

.book-meta {
  flex: 1;
}

.book-meta h2 {
  margin-bottom: 15px;
}

.author, .status, .chapters {
  color: #666;
  margin-bottom: 8px;
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
}

.btn-primary {
  background: #2D5A4A;
  color: white;
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

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.chapter-item:hover {
  background: #f5f5f5;
}

.chapter-status {
  color: #2D5A4A;
  font-size: 0.85rem;
}
</style>