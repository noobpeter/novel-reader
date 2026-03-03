<template>
  <div class="home">
    <header class="header">
      <h1 class="title">📚 小说阅读器</h1>
      <p class="subtitle">发现精彩小说，享受阅读时光</p>
    </header>
    
    <nav class="nav">
      <router-link to="/search" class="nav-item">
        🔍 搜索小说
      </router-link>
      <router-link to="/bookshelf" class="nav-item">
        📖 我的书架
      </router-link>
    </nav>

    <section class="section">
      <h2>热门推荐</h2>
      <div class="book-grid">
        <div v-for="i in 6" :key="i" class="book-card">
          <div class="book-cover">📕</div>
          <div class="book-info">
            <h3>示例小说 {{ i }}</h3>
            <p>作者名</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 首页逻辑
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  padding: 40px 0;
}

.title {
  font-size: 2.5rem;
  color: #2D5A4A;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.nav-item {
  padding: 12px 30px;
  background: #2D5A4A;
  color: white;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(45, 90, 74, 0.3);
}

.section {
  margin-top: 40px;
}

.section h2 {
  margin-bottom: 20px;
  color: #333;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.book-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  font-size: 4rem;
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
</style>