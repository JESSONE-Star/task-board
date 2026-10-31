import { ref } from 'vue'
import { themes, findTheme, defaultTheme } from '../config/themes'
import { applyTheme } from '../utils/cssVariables'

const THEME_KEY = 'task-kanban-theme'

function readTheme(): string {
  if (typeof localStorage === 'undefined') return defaultTheme
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved && themes.some((theme) => theme.name === saved)) return saved
  } catch (error) {
    console.warn('[task-kanban] 读取主题失败：', error)
  }
  return defaultTheme
}

const currentName = ref(readTheme())
applyTheme(findTheme(currentName.value))

export function useTheme() {
  function setTheme(name: string) {
    if (!themes.some((theme) => theme.name === name)) return
    currentName.value = name
    applyTheme(findTheme(name))
    try {
      localStorage.setItem(THEME_KEY, name)
    } catch (error) {
      console.warn('[task-kanban] 保存主题失败：', error)
    }
  }

  function previewTheme(name: string) {
    if (!themes.some((theme) => theme.name === name)) return
    applyTheme(findTheme(name))
  }

  function cancelPreview() {
    applyTheme(findTheme(currentName.value))
  }

  function cycleTheme() {
    const index = themes.findIndex((theme) => theme.name === currentName.value)
    const next = themes[(index + 1) % themes.length]
    setTheme(next.name)
    return next
  }

  return {
    themes,
    currentName,
    currentTheme: () => findTheme(currentName.value),
    setTheme,
    previewTheme,
    cancelPreview,
    cycleTheme
  }
}