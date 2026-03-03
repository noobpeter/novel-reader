import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// 导入页面组件
import Home from './views/Home.vue'
import Search from './views/Search.vue'
import Bookshelf from './views/Bookshelf.vue'
import Reader from './views/Reader.vue'
import Detail from './views/Detail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/bookshelf', component: Bookshelf },
  { path: '/reader/:id', component: Reader },
  { path: '/detail/:id', component: Detail },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')