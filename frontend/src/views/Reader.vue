<template>
  <div class="reader">
    <header class="reader-header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h2>{{ bookTitle }}</h2>
      <button @click="showSettings = !showSettings" class="settings-btn">⚙️</button>
    </header>

    <div class="reader-content" @click="toggleControls">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <template v-else>
        <div class="chapter-title">{{ chapterTitle }}</div>
        <div class="content" :style="contentStyle">
          <div v-for="(paragraph, index) in paragraphs" :key="index" class="paragraph">
            {{ paragraph }}
          </div>
        </div>
      </template>
    </div>

    <div class="reader-footer" v-show="showControls">
      <button @click="prevChapter" :disabled="currentChapter <= 1 || loading">← 上一章</button>
      <span>第 {{ currentChapter }} 章</span>
      <button @click="nextChapter" :disabled="loading">下一章 →</button>
    </div>

    <!-- 设置面板 -->
    <div class="settings-panel" v-if="showSettings" @click.stop
>
      <div class="setting-item">
        <label>字体大小</label>
        <input type="range" v-model="fontSize" min="14" max="24" />
        <span>{{ fontSize }}px</span>
      </div>
      <div class="setting-item">
        <label>背景</label>
        <div class="theme-options">
          <button 
            v-for="theme in themes" 
            :key="theme.name"
            @click="currentTheme = theme"
            :class="['theme-btn', { active: currentTheme.name === theme.name }]"
            :style="{ background: theme.bg, color: theme.color }"
          >
            {{ theme.name }}
          </button>
        </div>
      </div>
      <button @click="showSettings = false" class="close-btn">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapter, getBookDetail, updateProgress } from '../utils/api'

const route = useRoute()
const router = useRouter()

const bookId = route.params.id
const bookTitle = ref('')
const currentChapter = ref(parseInt(route.query.chapter) || 1)
const chapterTitle = ref('')
const chapterContent = ref('')
const loading = ref(false)
const error = ref('')
const showControls = ref(true)
const showSettings = ref(false)

const fontSize = ref(18)
const currentTheme = ref({ name: '白天', bg: '#F5F5F0', color: '#333' })

const themes = [
  { name: '白天', bg: '#F5F5F0', color: '#333' },
  { name: '夜间', bg: '#1a1a2e', color: '#eee' },
  { name: '护眼', bg: '#c7edcc', color: '#333' },
]

const contentStyle = computed(() => ({
  fontSize: fontSize.value + 'px',
  background: currentTheme.value.bg,
  color: currentTheme.value.color,
}))

const paragraphs = computed(() => {
  if (!chapterContent.value) return []
  return chapterContent.value.split('\n').filter(p => p.trim())
})

onMounted(() => {
  loadBookInfo()
  loadChapter()
})

const loadBookInfo = async () => {
  try {
    const book = await getBookDetail(bookId)
    if (book) {
      bookTitle.value = book.title
    }
  } catch (err) {
    console.error('获取书籍信息失败:', err)
  }
}

const loadChapter = async () => {
  loading.value = true
  error.value = ''
  try {
    const chapter = await getChapter(bookId, currentChapter.value)
    chapterTitle.value = chapter.title || `第${currentChapter.value}章`
    chapterContent.value = chapter.content
    
    // 保存阅读进度
    await saveProgress()
    
    // 滚动到顶部
    window.scrollTo(0, 0)
  } catch (err) {
    error.value = '加载章节失败：' + err.message
  } finally {
    loading.value = false
  }
}

const saveProgress = async () => {
  try {
    // 计算阅读进度（简化版，假设每本书100章）
    const progress = Math.min(Math.round((currentChapter.value / 100) * 100), 100)
    await updateProgress(bookId, currentChapter.value, progress)
  } catch (err) {
    console.error('保存进度失败:', err)
  }
}

const goBack = () => {
  router.back()
}

const toggleControls = () => {
  showControls.value = !showControls.value
}

const prevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--
    loadChapter()
  }
}

const nextChapter = () => {
  currentChapter.value++
  loadChapter()
}

// 监听章节变化，更新URL
watch(currentChapter, (newVal) => {
  router.replace({
    path: `/reader/${bookId}`,
    query: { chapter: newVal }
  })
})
</script>

<style scoped>
.reader {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.reader-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.reader-header h2 {
  font-size: 1.1rem;
  flex: 1;
  text-align: center;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.back-btn, .settings-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 10px;
}

.reader-content {
  flex: 1;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.loading, .error {
  text-align: center;
  padding: 60px;
  color: #999;
}

.error {
  color: #ff4444;
}

.chapter-title {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.content {
  line-height: 1.8;
  padding: 20px;
  border-radius: 8px;
  min-height: 60vh;
}

.paragraph {
  text-indent: 2em;
  margin-bottom: 1em;
}

.reader-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  position: sticky;
  bottom: 0;
}

.reader-footer button {
  padding: 10px 20px;
  background: #2D5A4A;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.reader-footer button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.settings-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.2);
  border-radius: 20px 20px 0 0;
  z-index: 200;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.theme-options {
  display: flex;
  gap: 10px;
}

.theme-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.theme-btn.active {
  border-color: #2D5A4A;
}

.close-btn {
  width: 100%;
  padding: 12px;
  background: #2D5A4A;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>