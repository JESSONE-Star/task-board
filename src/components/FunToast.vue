<script setup>
import { useToast } from '../composables/useToast.ts'

const { toasts, pause, resume } = useToast()

const kindIcons = {
  create: '📝',
  update: '💾',
  move: '🚀',
  delete: '🗑️',
  star: '⭐',
  urgent: '🔥',
  filter: '🔎',
  reset: '♻️',
  theme: '🎨',
  error: '⚠️'
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.type"
          @mouseenter="pause(toast.id)"
          @mouseleave="resume(toast.id)"
        >
          <span class="toast-icon" aria-hidden="true">{{ kindIcons[toast.kind] || '💡' }}</span>
          <span class="toast-text">{{ toast.message }}</span>
          <span
            class="toast-progress"
            :style="{ animationDuration: toast.duration + 'ms' }"
          ></span>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
  max-width: min(86vw, 380px);
  padding: 11px 15px 13px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 12.5px;
  box-shadow: 0 14px 34px -14px rgba(15, 23, 42, 0.5);
  pointer-events: auto;
}

.toast.error {
  border-color: var(--color-danger);
}

.toast-icon {
  font-size: 14px;
}

.toast-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2.5px;
  width: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transform-origin: left center;
  animation: toast-progress linear forwards;
}

.toast:hover .toast-progress {
  animation-play-state: paused;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>