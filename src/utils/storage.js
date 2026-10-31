export const STORAGE_KEY = 'task-kanban-state-v1'

export const defaultColumns = [
  { id: 'todo', title: '待办', color: '#6366f1', icon: '📋' },
  { id: 'doing', title: '进行中', color: '#f59e0b', icon: '🚀' },
  { id: 'done', title: '已完成', color: '#10b981', icon: '✅' }
]

export const defaultCategories = [
  { name: '产品', color: '#6366f1' },
  { name: '开发', color: '#0ea5e9' },
  { name: '设计', color: '#ec4899' },
  { name: '测试', color: '#10b981' }
]

export function createDefaultState() {
  return {
    columns: defaultColumns.map((column) => ({ ...column })),
    tasks: [],
    categories: defaultCategories.map((category) => ({ ...category }))
  }
}

function isValidTask(task) {
  return Boolean(
    task &&
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.columnId === 'string'
  )
}

function normalizeCategory(category) {
  if (typeof category === 'string' && category.trim()) {
    return { name: category.trim(), color: '#6366f1' }
  }
  if (category && typeof category.name === 'string' && category.name.trim()) {
    return { name: category.name.trim(), color: category.color || '#6366f1' }
  }
  return null
}

export function loadState() {
  const fallback = createDefaultState()
  if (typeof localStorage === 'undefined') return fallback

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return fallback

    const columns =
      Array.isArray(parsed.columns) && parsed.columns.length
        ? parsed.columns
            .filter((column) => column && typeof column.id === 'string')
            .map((column) => ({
              id: column.id,
              title: String(column.title || column.id),
              color: column.color || '#6366f1',
              icon: column.icon || '📌'
            }))
        : fallback.columns

    const tasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.filter(isValidTask).map((task) => ({
          id: String(task.id),
          title: String(task.title),
          description: task.description ? String(task.description) : '',
          category: task.category ? String(task.category) : '',
          columnId: columns.some((column) => column.id === task.columnId)
            ? task.columnId
            : columns[0].id,
          starred: Boolean(task.starred),
          urgent: Boolean(task.urgent),
          createdAt: Number(task.createdAt) || Date.now(),
          updatedAt: Number(task.updatedAt) || Number(task.createdAt) || Date.now()
        }))
      : []

    const categoryMap = new Map()
    const rawCategories = Array.isArray(parsed.categories) ? parsed.categories : []
    rawCategories.forEach((category) => {
      const normalized = normalizeCategory(category)
      if (normalized) categoryMap.set(normalized.name, normalized)
    })
    tasks.forEach((task) => {
      if (task.category && !categoryMap.has(task.category)) {
        categoryMap.set(task.category, { name: task.category, color: '#6366f1' })
      }
    })

    return {
      columns: columns.length ? columns : fallback.columns,
      tasks,
      categories: categoryMap.size
        ? Array.from(categoryMap.values())
        : fallback.categories
    }
  } catch (error) {
    console.warn('[task-kanban] 读取本地数据失败，已降级为默认状态：', error)
    return fallback
  }
}

export function saveState(state) {
  if (typeof localStorage === 'undefined') return false

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (error) {
    console.warn('[task-kanban] 保存本地数据失败：', error)
    return false
  }
}

export function clearState() {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('[task-kanban] 清除本地数据失败：', error)
  }
}