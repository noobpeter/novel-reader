<template>
  <div class="reader">
    <header class="reader-header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h2>{{ bookTitle }}</h2>
      <button @click="showSettings = !showSettings" class="settings-btn">⚙️</button>
    </header>

    <div class="reader-content" @click="toggleControls">
      <div class="chapter-title">第{{ currentChapter }}章 {{ chapterTitle }}</div>
      <div class="content" :style="contentStyle">
        {{ chapterContent }}
      </div>
    </div>

    <div class="reader-footer" v-show="showControls">
      <button @click="prevChapter" :disabled="currentChapter <= 1">← 上一章</button>
      <span>第 {{ currentChapter }} / {{ totalChapters }} 章</span>
      <button @click="nextChapter" :disabled="currentChapter >= totalChapters">下一章 →</button>
    </div>

    <!-- 设置面板 -->
    <div class="settings-panel" v-if="showSettings">
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const bookId = route.params.id
const bookTitle = ref('示例小说')
const currentChapter = ref(1)
const totalChapters = ref(100)
const chapterTitle = ref('章节标题')
const chapterContent = ref('这是章节内容...（示例数据）')
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
  if (currentChapter.value < totalChapters.value) {
    currentChapter.value++
    loadChapter()
  }
}

const loadChapter = () => {
  // TODO: 从后端加载章节内容
  chapterTitle.value = `第${currentChapter.value}章标题`
  chapterContent.value = `这是第${currentChapter.value}章的内容...`
}
</script>

<style scoped>
.reader {
  height: 100vh;
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
}

.reader-header h2 {
  font-size: 1.1rem;
  flex: 1;
  text-align: center;
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
  overflow-y: auto;
  padding: 20px;
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
  text-indent: 2em;
  min-height: 60vh;
  padding: 20px;
  border-radius: 8px;
}

.reader-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
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