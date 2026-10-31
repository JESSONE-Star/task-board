import type { ThemePalette } from '../config/themes'

export function applyTheme(theme: ThemePalette, target: HTMLElement = document.documentElement) {
  Object.entries(theme.variables).forEach(([key, value]) => {
    target.style.setProperty(key, value)
  })
  target.dataset.theme = theme.name
}

export function getCssVariable(name: string, fallback = ''): string {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name)
  return value ? value.trim() : fallback
}

export function clearTheme(target: HTMLElement = document.documentElement) {
  target.removeAttribute('style')
  target.dataset.theme = 'light'
}