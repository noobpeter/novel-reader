<template>
  <div id="app">
    <router-view />
    
    <!-- 底部导航栏 -->
    <nav class="bottom-nav" v-if="showNav">
      <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
        🏠 首页
      </router-link>
      <router-link to="/search" class="nav-item" :class="{ active: $route.path === '/search' }">
        🔍 搜索
      </router-link>
      <router-link to="/bookshelf" class="nav-item" :class="{ active: $route.path === '/bookshelf' }">
        📚 书架
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 阅读页面不显示底部导航
const showNav = computed(() => {
  return !route.path.startsWith('/reader')
})
</script>

<style>
#app {
  min-height: 100vh;
  padding-bottom: 70px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 20px;
  color: #999;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.nav-item.active {
  color: #2D5A4A;
}

.nav-item:hover {
  color: #2D5A4A;
}
</style>