export function useRipple() {
  function ripple(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null
    if (!target) return

    const rect = target.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const circle = document.createElement('span')
    circle.className = 'ripple-effect'
    circle.style.width = `${size}px`
    circle.style.height = `${size}px`
    circle.style.left = `${event.clientX - rect.left - size / 2}px`
    circle.style.top = `${event.clientY - rect.top - size / 2}px`

    target.appendChild(circle)
    circle.addEventListener('animationend', () => circle.remove(), { once: true })
  }

  return { ripple }
}