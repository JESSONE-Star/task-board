<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useTheme } from '../composables/useTheme.ts'

const { themes, currentName, setTheme, previewTheme, cancelPreview, currentTheme } = useTheme()
const open = ref(false)
const root = ref(null)

function toggle() {
  open.value = !open.value
}

function choose(name) {
  setTheme(name)
  open.value = false
}

function onEnter(name) {
  if (name !== currentName.value) previewTheme(name)
}

function onLeave() {
  cancelPreview()
}

function onDocumentClick(event) {
  if (root.value && !root.value.contains(event.target)) {
    open.value = false
    cancelPreview()
  }
}

document.addEventListener('click', onDocumentClick)
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  cancelPreview()
})
</script>

<template>
  <div ref="root" class="theme-selector">
    <button
      class="btn btn-ghost theme-trigger"
      type="button"
      :aria-expanded="open"
      aria-label="切换主题"
      @click.stop="toggle"
    >
      <span class="theme-icon">{{ currentTheme().icon }}</span>
      <span class="theme-label">{{ currentTheme().label }}</span>
      <span class="caret" :class="{ open }">▾</span>
    </button>

    <transition name="dropdown">
      <div v-if="open" class="theme-menu" @mouseleave="onLeave">
        <button
          v-for="theme in themes"
          :key="theme.name"
          class="theme-item"
          :class="{ active: theme.name === currentName }"
          type="button"
          @mouseenter="onEnter(theme.name)"
          @click.stop="choose(theme.name)"
        >
          <span>{{ theme.icon }}</span>
          <span>{{ theme.label }}</span>
          <span v-if="theme.name === currentName" class="check">✓</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.theme-icon {
  font-size: 16px;
}

.theme-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.caret {
  font-size: 11px;
  color: var(--color-text-muted);
  transition: transform var(--transition-fast);
}

.caret.open {
  transform: rotate(180deg);
}

.theme-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 148px;
  padding: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 12px 30px var(--color-shadow);
  z-index: var(--z-dropdown);
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  font-size: 13px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.theme-item:hover,
.theme-item.active {
  background: var(--color-primary-soft);
}

.theme-item .check {
  margin-left: auto;
  color: var(--color-primary);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>