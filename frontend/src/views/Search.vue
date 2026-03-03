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
        placeholder="输入书名或作者..." 
        class="search-input"
      />
      <button @click="handleSearch" class="search-btn">搜索</button>
    </div>

    <div class="results" v-if="searching">
      <div class="loading">搜索中...⏳</div>
    </div>

    <div class="results" v-else-if="results.length > 0">
      <div v-for="book in results" :key="book.id" class="result-item">
        <div class="book-cover">📘</div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.author }}</p>
          <p class="intro">{{ book.intro }}</p>
          <div class="actions">
            <button @click="addToBookshelf(book)" class="btn-primary">加入书架</button>
            <button @click="readNow(book)" class="btn-secondary">立即阅读</button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty" v-else-if="hasSearched">
      未找到相关书籍，换个关键词试试
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')
const searching = ref(false)
const hasSearched = ref(false)
const results = ref([])

const handleSearch = async () => {
  if (!keyword.value.trim()) return
  
  searching.value = true
  hasSearched.value = true
  
  // TODO: 调用后端搜索API
  setTimeout(() => {
    results.value = [
      { id: 1, title: '示例小说1', author: '作者A', intro: '简介...' },
      { id: 2, title: '示例小说2', author: '作者B', intro: '简介...' },
    ]
    searching.value = false
  }, 1000)
}

const addToBookshelf = (book) => {
  // TODO: 添加到书架
  alert(`已添加《${book.title}》到书架`)
}

const readNow = (book) => {
  router.push(`/reader/${book.id}`)
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
  margin-bottom: 30px;
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
}

.book-info {
  flex: 1;
}

.book-info h3 {
  margin-bottom: 5px;
}

.intro {
  color: #666;
  font-size: 0.9rem;
  margin: 10px 0;
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
}

.btn-primary {
  background: #2D5A4A;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>