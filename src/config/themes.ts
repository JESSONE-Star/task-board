export interface ThemePalette {
  name: string
  label: string
  icon: string
  variables: Record<string, string>
}

export const themes: ThemePalette[] = [
  {
    name: 'light',
    label: '亮色',
    icon: '☀️',
    variables: {
      '--color-bg': '#f4f6fb',
      '--color-bg-soft': '#eef1f8',
      '--color-surface': '#ffffff',
      '--color-surface-hover': '#f8faff',
      '--color-text': '#1f2937',
      '--color-text-muted': '#6b7280',
      '--color-border': '#e5e8f0',
      '--color-primary': '#6366f1',
      '--color-primary-soft': '#eef0ff',
      '--color-accent': '#8b5cf6',
      '--color-danger': '#ef4444',
      '--color-warning': '#f59e0b',
      '--color-success': '#10b981',
      '--color-shadow': 'rgba(31, 41, 55, 0.08)',
      '--color-glass': 'rgba(255, 255, 255, 0.72)'
    }
  },
  {
    name: 'dark',
    label: '暗色',
    icon: '🌙',
    variables: {
      '--color-bg': '#0f172a',
      '--color-bg-soft': '#151f36',
      '--color-surface': '#1b253b',
      '--color-surface-hover': '#22304a',
      '--color-text': '#e5e9f2',
      '--color-text-muted': '#94a3b8',
      '--color-border': '#2b3852',
      '--color-primary': '#818cf8',
      '--color-primary-soft': '#242f4d',
      '--color-accent': '#a78bfa',
      '--color-danger': '#f87171',
      '--color-warning': '#fbbf24',
      '--color-success': '#34d399',
      '--color-shadow': 'rgba(0, 0, 0, 0.45)',
      '--color-glass': 'rgba(27, 37, 59, 0.78)'
    }
  },
  {
    name: 'playful',
    label: '多彩',
    icon: '🎨',
    variables: {
      '--color-bg': '#fff7f0',
      '--color-bg-soft': '#fdeee4',
      '--color-surface': '#ffffff',
      '--color-surface-hover': '#fffaf5',
      '--color-text': '#3d2b2b',
      '--color-text-muted': '#8a6f6f',
      '--color-border': '#f3ded2',
      '--color-primary': '#f97316',
      '--color-primary-soft': '#ffedd5',
      '--color-accent': '#ec4899',
      '--color-danger': '#e11d48',
      '--color-warning': '#d97706',
      '--color-success': '#059669',
      '--color-shadow': 'rgba(249, 115, 22, 0.16)',
      '--color-glass': 'rgba(255, 255, 255, 0.78)'
    }
  }
]

export const defaultTheme = 'light'

export function findTheme(name: string): ThemePalette {
  return themes.find((item) => item.name === name) || themes[0]
}