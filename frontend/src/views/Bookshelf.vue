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

    <div class="book-list" :class="viewMode">
      <div v-for="book in books" :key="book.id" class="book-item" @click="readBook(book)">
        <div class="book-cover">📗</div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.author }}</p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: book.progress + '%' }"></div>
          </div>
          <p class="progress-text">已读 {{ book.progress }}%</p>
        </div>
      </div>
    </div>

    <div v-if="books.length === 0" class="empty">
      <p>书架空空如也~</p>
      <router-link to="/search" class="btn-primary">去搜索小说</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const viewMode = ref('grid')

// TODO: 从本地存储获取书架数据
const books = ref([
  { id: 1, title: '示例小说1', author: '作者A', progress: 35 },
  { id: 2, title: '示例小说2', author: '作者B', progress: 0 },
])

const readBook = (book) => {
  router.push(`/reader/${book.id}`)
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
  transition: transform 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-item:hover {
  transform: translateY(-5px);
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

.book-info p {
  font-size: 0.85rem;
  color: #666;
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