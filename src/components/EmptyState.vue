<script setup>
defineProps({
  icon: {
    type: String,
    default: '🗂️'
  },
  title: {
    type: String,
    default: '这里还很空'
  },
  hint: {
    type: String,
    default: '把任务拖到这里试试'
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: '＋'
  }
})

defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon" aria-hidden="true">{{ icon }}</div>
    <p class="empty-title">{{ title }}</p>
    <p class="empty-hint">{{ hint }}</p>
    <button
      v-if="actionText"
      type="button"
      class="btn btn-ghost empty-action"
      @click="$emit('action')"
    >
      <span aria-hidden="true">{{ actionIcon }}</span>
      {{ actionText }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 160px;
  padding: 20px 14px;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-align: center;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.empty-icon {
  font-size: 30px;
  opacity: 0.85;
  animation: float 3.4s ease-in-out infinite;
}

.empty-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.empty-hint {
  margin: 0;
  font-size: 12px;
}

.empty-action {
  margin-top: 6px;
  height: 30px;
  font-size: 12px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>