const API_BASE = 'http://localhost:3000/api'

// 统一错误处理
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || '请求失败')
  }
  return data
}

// 搜索书籍
export async function searchBooks(keyword) {
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(keyword)}`)
    const data = await handleResponse(response)
    return data.results || []
  } catch (error) {
    console.error('搜索失败:', error)
    throw error
  }
}

// 获取书籍详情
export async function getBookDetail(bookId) {
  try {
    const response = await fetch(`${API_BASE}/book/${bookId}`)
    const data = await handleResponse(response)
    return data.book
  } catch (error) {
    console.error('获取详情失败:', error)
    throw error
  }
}

// 获取章节内容
export async function getChapter(bookId, chapterNo) {
  try {
    const response = await fetch(`${API_BASE}/book/${bookId}/chapter/${chapterNo}`)
    const data = await handleResponse(response)
    return data.chapter
  } catch (error) {
    console.error('获取章节失败:', error)
    throw error
  }
}

// 获取书架
export async function getBookshelf() {
  try {
    const response = await fetch(`${API_BASE}/bookshelf`)
    const data = await handleResponse(response)
    return data.books || []
  } catch (error) {
    console.error('获取书架失败:', error)
    throw error
  }
}

// 添加到书架
export async function addToBookshelf(book) {
  try {
    const response = await fetch(`${API_BASE}/bookshelf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('添加书架失败:', error)
    throw error
  }
}

// 更新阅读进度
export async function updateProgress(bookId, chapter, progress) {
  try {
    const response = await fetch(`${API_BASE}/bookshelf/${bookId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter, progress })
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('更新进度失败:', error)
    throw error
  }
}

// 从书架删除
export async function removeFromBookshelf(bookId) {
  try {
    const response = await fetch(`${API_BASE}/bookshelf/${bookId}`, {
      method: 'DELETE'
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('删除失败:', error)
    throw error
  }
}