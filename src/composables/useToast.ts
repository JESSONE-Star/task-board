import { reactive } from 'vue'
import type { ToastKind } from '../config/toastMessages'

export interface ToastItem {
  id: number
  message: string
  kind: string
  type: 'success' | 'info' | 'error'
  duration: number
}

const toasts = reactive<ToastItem[]>([])
const timers = new Map<number, number>()
let seq = 0

export function useToast() {
  function remove(id: number) {
    const index = toasts.findIndex((item) => item.id === id)
    if (index !== -1) toasts.splice(index, 1)
    const timer = timers.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.delete(id)
    }
  }

  function show(
    message: string,
    options: { kind?: ToastKind | string; type?: 'success' | 'info' | 'error'; duration?: number } = {}
  ) {
    const id = ++seq
    const duration = options.duration ?? 2600
    toasts.push({
      id,
      message,
      kind: String(options.kind || 'info'),
      type: options.type || 'success',
      duration
    })
    const timer = window.setTimeout(() => remove(id), duration)
    timers.set(id, timer)
    if (toasts.length > 4) remove(toasts[0].id)
    return id
  }

  function success(message: string, kind: ToastKind | string = 'update') {
    return show(message, { kind, type: 'success' })
  }

  function error(message: string) {
    return show(message, { kind: 'error', type: 'error' })
  }

  function pause(id: number) {
    const timer = timers.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.delete(id)
    }
  }

  function resume(id: number) {
    const item = toasts.find((toast) => toast.id === id)
    if (!item || timers.has(id)) return
    const timer = window.setTimeout(() => remove(id), item.duration)
    timers.set(id, timer)
  }

  function clear() {
    timers.forEach((timer) => window.clearTimeout(timer))
    timers.clear()
    toasts.splice(0, toasts.length)
  }

  return { toasts, show, success, error, remove, pause, resume, clear }
}