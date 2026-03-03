const API_BASE = 'http://localhost:3000/api'

// 搜索书籍
export async function searchBooks(keyword) {
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(keyword)}`)
    return await response.json()
  } catch (error) {
    console.error('搜索失败:', error)
    return []
  }
}

// 获取书籍详情
export async function getBookDetail(bookId) {
  try {
    const response = await fetch(`${API_BASE}/book/${bookId}`)
    return await response.json()
  } catch (error) {
    console.error('获取详情失败:', error)
    return null
  }
}

// 获取章节内容
export async function getChapter(bookId, chapterNo) {
  try {
    const response = await fetch(`${API_BASE}/book/${bookId}/chapter/${chapterNo}`)
    return await response.json()
  } catch (error) {
    console.error('获取章节失败:', error)
    return null
  }
}

// 获取书架
export async function getBookshelf() {
  try {
    const response = await fetch(`${API_BASE}/bookshelf`)
    return await response.json()
  } catch (error) {
    console.error('获取书架失败:', error)
    return []
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
    return await response.json()
  } catch (error) {
    console.error('添加书架失败:', error)
    return null
  }
}