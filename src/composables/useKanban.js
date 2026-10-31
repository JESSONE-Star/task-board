import { computed, ref, watch } from 'vue'
import { loadState, saveState, defaultCategories, defaultColumns } from '../utils/storage.js'

export function useKanban() {
  const initialState = loadState()
  const columns = ref(initialState.columns)
  const tasks = ref(initialState.tasks)
  const categories = ref(initialState.categories)
  const filterCategory = ref('all')

  const categoryNames = computed(() => categories.value.map((item) => item.name))

  const filteredTasks = computed(() => {
    if (filterCategory.value === 'all') return tasks.value
    return tasks.value.filter((task) => task.category === filterCategory.value)
  })

  const stats = computed(() => {
    const total = tasks.value.length
    const done = tasks.value.filter((task) => task.columnId === 'done').length
    const starred = tasks.value.filter((task) => task.starred).length
    return { total, done, starred, pending: total - done }
  })

  function tasksOf(columnId) {
    return filteredTasks.value.filter((task) => task.columnId === columnId)
  }

  function countOf(columnId) {
    return tasks.value.filter((task) => task.columnId === columnId).length
  }

  function persist() {
    saveState({
      columns: columns.value,
      tasks: tasks.value,
      categories: categories.value
    })
  }

  watch([columns, tasks, categories], persist, { deep: true })

  function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    return `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
  }

  function ensureCategory(name) {
    const trimmed = String(name || '').trim()
    if (!trimmed) return
    if (!categories.value.some((item) => item.name === trimmed)) {
      const palette = ['#6366f1', '#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6']
      categories.value.push({
        name: trimmed,
        color: palette[categories.value.length % palette.length]
      })
    }
  }

  function addTask(payload) {
    const title = String(payload.title || '').trim()
    if (!title) return null

    const now = Date.now()
    const task = {
      id: createId(),
      title,
      description: String(payload.description || '').trim(),
      category: String(payload.category || '').trim(),
      columnId: payload.columnId || 'todo',
      starred: Boolean(payload.starred),
      urgent: Boolean(payload.urgent),
      createdAt: now,
      updatedAt: now
    }
    if (task.category) ensureCategory(task.category)
    tasks.value.unshift(task)
    return task
  }

  function updateTask(id, payload) {
    const task = tasks.value.find((item) => item.id === id)
    if (!task) return null

    if (payload.title !== undefined) {
      const title = String(payload.title).trim()
      if (!title) return null
      task.title = title
    }
    if (payload.description !== undefined) task.description = String(payload.description).trim()
    if (payload.category !== undefined) {
      task.category = String(payload.category).trim()
      if (task.category) ensureCategory(task.category)
    }
    if (payload.columnId !== undefined) task.columnId = payload.columnId
    task.updatedAt = Date.now()
    return task
  }

  function removeTask(id) {
    const index = tasks.value.findIndex((item) => item.id === id)
    if (index === -1) return false
    tasks.value.splice(index, 1)
    return true
  }

  function moveTask(taskId, columnId) {
    if (!columns.value.some((column) => column.id === columnId)) return false
    const index = tasks.value.findIndex((item) => item.id === taskId)
    if (index === -1) return false

    const [task] = tasks.value.splice(index, 1)
    if (task.columnId === columnId) {
      tasks.value.splice(index, 0, task)
      return false
    }
    task.columnId = columnId
    task.updatedAt = Date.now()
    tasks.value.push(task)
    return true
  }

  function toggleFlag(id, flag) {
    const task = tasks.value.find((item) => item.id === id)
    if (!task || !['starred', 'urgent'].includes(flag)) return false
    task[flag] = !task[flag]
    task.updatedAt = Date.now()
    return true
  }

  function resetBoard() {
    tasks.value = []
    filterCategory.value = 'all'
    categories.value = defaultCategories.map((item) => ({ ...item }))
    columns.value = defaultColumns.map((column) => ({ ...column }))
  }

  function setFilter(name) {
    filterCategory.value = name
  }

  return {
    columns,
    tasks,
    categories,
    categoryNames,
    filterCategory,
    filteredTasks,
    stats,
    tasksOf,
    countOf,
    addTask,
    updateTask,
    removeTask,
    moveTask,
    toggleFlag,
    resetBoard,
    setFilter,
    ensureCategory
  }
}