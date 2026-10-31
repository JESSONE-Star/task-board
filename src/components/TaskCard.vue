<script setup>
import { ref } from 'vue'
import { formatRelativeTime } from '../utils/timeFormat.ts'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  categoryColor: {
    type: String,
    default: 'var(--color-primary)'
  }
})

const emit = defineEmits(['edit', 'remove', 'toggle'])

const dragging = ref(false)

function onDragStart(event) {
  dragging.value = true
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.setData('application/x-task-id', props.task.id)
}

function onDragEnd() {
  dragging.value = false
}
</script>

<template>
  <article
    class="task-card"
    :class="{
      'is-dragging': dragging,
      'is-starred': task.starred,
      'is-urgent': task.urgent
    }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="card-top">
      <h3 class="card-title">{{ task.title }}</h3>
      <div class="card-flags">
        <button
          type="button"
          class="icon-btn"
          :class="{ active: task.starred }"
          :title="task.starred ? '取消星标' : '标记为重要'"
          :aria-label="task.starred ? '取消星标' : '标记为重要'"
          @click.stop="$emit('toggle', task.id, 'starred')"
        >
          {{ task.starred ? '★' : '☆' }}
        </button>
        <button
          type="button"
          class="icon-btn urgent"
          :class="{ active: task.urgent }"
          :title="task.urgent ? '取消紧急' : '标记为紧急'"
          :aria-label="task.urgent ? '取消紧急' : '标记为紧急'"
          @click.stop="$emit('toggle', task.id, 'urgent')"
        >
          {{ task.urgent ? '🔥' : '🔥' }}
        </button>
      </div>
    </div>

    <p v-if="task.description" class="card-desc">{{ task.description }}</p>

    <div class="card-meta">
      <span v-if="task.category" class="category-tag">
        <span class="tag-dot" :style="{ background: categoryColor }"></span>
        {{ task.category }}
      </span>
      <span v-else class="category-tag muted">未分类</span>
      <span class="time" :title="new Date(task.createdAt).toLocaleString()">
        {{ formatRelativeTime(task.createdAt) }}
      </span>
    </div>

    <div class="card-actions">
      <button type="button" class="text-btn" @click.stop="$emit('edit', task)">
        <span aria-hidden="true">✎</span> 编辑
      </button>
      <button type="button" class="text-btn danger" @click.stop="$emit('remove', task)">
        <span aria-hidden="true">🗑</span> 删除
      </button>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  position: relative;
  padding: 13px 14px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 6px var(--color-shadow);
  cursor: grab;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    border-color var(--transition-fast);
  animation: card-in 0.22s ease both;
}

.task-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: 0 10px 22px -12px var(--color-primary);
}

.task-card:active {
  cursor: grabbing;
}

.task-card.is-dragging {
  opacity: 0.45;
  transform: rotate(1.5deg) scale(0.99);
}

.task-card.is-starred {
  border-left: 3px solid var(--color-warning);
}

.task-card.is-urgent {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 1px var(--color-danger), 0 6px 16px -10px var(--color-danger);
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.card-title {
  flex: 1;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
  word-break: break-word;
}

.card-flags {
  display: flex;
  gap: 2px;
}

.icon-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.icon-btn:hover {
  background: var(--color-bg-soft);
  transform: scale(1.08);
}

.icon-btn.active {
  color: var(--color-warning);
}

.icon-btn.urgent.active {
  color: var(--color-danger);
}

.card-desc {
  margin: 6px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--color-text-muted);
  word-break: break-word;
  white-space: pre-wrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-text);
  font-size: 11px;
  line-height: 1.4;
}

.category-tag.muted {
  color: var(--color-text-muted);
  background: var(--color-bg-soft);
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.time {
  margin-left: auto;
  font-size: 11px;
  color: var(--color-text-muted);
}

.card-actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--color-border);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity var(--transition-fast), max-height var(--transition-fast);
}

.task-card:hover .card-actions,
.task-card:focus-within .card-actions {
  opacity: 1;
  max-height: 40px;
}

.text-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 7px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 11.5px;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.text-btn:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.text-btn.danger:hover {
  background: rgba(239, 68, 68, 0.12);
  color: var(--color-danger);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (hover: none) {
  .card-actions {
    opacity: 1;
    max-height: 40px;
  }
}
</style>