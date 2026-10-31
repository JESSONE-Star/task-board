<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  effect: {
    type: String,
    default: 'mixed'
  },
  duration: {
    type: Number,
    default: 2400
  }
})

const emit = defineEmits(['complete'])
const canvasRef = ref(null)

let animationId = 0
let particles = []
let startedAt = 0

const palette = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#ef4444']

function random(min, max) {
  return min + Math.random() * (max - min)
}

function spawn(count) {
  const width = window.innerWidth
  const height = window.innerHeight
  for (let index = 0; index < count; index += 1) {
    const shape =
      props.effect === 'mixed'
        ? ['rect', 'circle', 'star'][Math.floor(Math.random() * 3)]
        : props.effect
    particles.push({
      x: random(width * 0.2, width * 0.8),
      y: height * random(0.45, 0.7),
      vx: random(-4.2, 4.2),
      vy: random(-9.5, -4.5),
      gravity: random(0.14, 0.22),
      size: random(5, 10),
      rotation: random(0, Math.PI * 2),
      spin: random(-0.16, 0.16),
      color: palette[Math.floor(Math.random() * palette.length)],
      shape,
      life: random(0.8, 1)
    })
  }
}

function drawStar(ctx, radius) {
  ctx.beginPath()
  for (let point = 0; point < 5; point += 1) {
    const outer = (Math.PI * 2 * point) / 5 - Math.PI / 2
    ctx.lineTo(Math.cos(outer) * radius, Math.sin(outer) * radius)
    const inner = outer + Math.PI / 5
    ctx.lineTo(Math.cos(inner) * radius * 0.45, Math.sin(inner) * radius * 0.45)
  }
  ctx.closePath()
}

function render(timestamp) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const elapsed = timestamp - startedAt
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((particle) => {
    particle.vy += particle.gravity
    particle.x += particle.vx
    particle.y += particle.vy
    particle.rotation += particle.spin
    particle.life -= 0.006

    if (particle.life <= 0) return

    ctx.save()
    ctx.globalAlpha = Math.max(0, particle.life)
    ctx.translate(particle.x, particle.y)
    ctx.rotate(particle.rotation)
    ctx.fillStyle = particle.color

    if (particle.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (particle.shape === 'star') {
      drawStar(ctx, particle.size * 0.75)
      ctx.fill()
    } else {
      ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2)
    }
    ctx.restore()
  })

  particles = particles.filter(
    (particle) => particle.life > 0 && particle.y < window.innerHeight + 60
  )

  if (elapsed < props.duration) {
    animationId = requestAnimationFrame(render)
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles = []
    emit('complete')
  }
}

function start() {
  const canvas = canvasRef.value
  if (!canvas) return
  cancelAnimationFrame(animationId)

  const ratio = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * ratio
  canvas.height = window.innerHeight * ratio
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  const ctx = canvas.getContext('2d')
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  particles = []
  spawn(90)
  startedAt = performance.now()
  animationId = requestAnimationFrame(render)
}

let burstTimer = 0

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return
    start()
    window.clearTimeout(burstTimer)
    burstTimer = window.setTimeout(() => start(), 420)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.clearTimeout(burstTimer)
})
</script>

<template>
  <canvas ref="canvasRef" class="celebration-canvas" aria-hidden="true"></canvas>
</template>

<style scoped>
.celebration-canvas {
  position: fixed;
  inset: 0;
  z-index: var(--z-celebration);
  pointer-events: none;
}
</style>