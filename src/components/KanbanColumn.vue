<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  },
  totalCount: {
    type: Number,
    default: 0
  },
  filtered: {
    type: Boolean,
    default: false
  },
  categoryColors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['move', 'edit', 'remove', 'toggle', 'add'])

const isOver = ref(false)

function onDragEnter(event) {
  event.preventDefault()
  isOver.value = true
}

function onDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  isOver.value = true
}

function onDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isOver.value = false
  }
}

function onDrop(event) {
  event.preventDefault()
  isOver.value = false
  const taskId =
    event.dataTransfer.getData('application/x-task-id') ||
    event.dataTransfer.getData('text/plain')
  if (taskId) emit('move', taskId, props.column.id)
}

function colorOf(category) {
  return props.categoryColors[category] || 'var(--color-primary)'
}
</script>

<template>
  <section
    class="kanban-column"
    :class="{ 'is-over': isOver }"
    :style="{ '--column-color': column.color }"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="column-head">
      <span class="column-icon" aria-hidden="true">{{ column.icon }}</span>
      <h2>{{ column.title }}</h2>
      <span class="column-count">
        {{ tasks.length }}<template v-if="filtered">/{{ totalCount }}</template>
      </span>
      <button
        type="button"
        class="column-add"
        title="在此列新增任务"
        aria-label="在此列新增任务"
        @click="emit('add', column.id)"
      >
        ＋
      </button>
    </header>

    <div class="column-body">
      <transition-group name="card" tag="div" class="card-list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :category-color="colorOf(task.category)"
          @edit="emit('edit', $event)"
          @remove="emit('remove', $event)"
          @toggle="(id, flag) => emit('toggle', id, flag)"
        />
      </transition-group>

      <EmptyState
        v-if="!tasks.length"
        :icon="filtered ? '🔍' : column.icon"
        :title="filtered ? '当前筛选下没有任务' : '这一列还是空的'"
        :hint="filtered ? '切换其他分类，或清除筛选' : '拖动卡片到这里，或点击右上角 ＋'"
        :action-text="filtered ? '' : '添加任务'"
        @action="emit('add', column.id)"
      />
    </div>

    <div v-if="isOver" class="drop-hint">释放即可移动到「{{ column.title }}」</div>
  </section>
</template>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  min-height: 320px;
  padding: 12px;
  background: var(--color-bg-soft);
  border: 1.5px solid transparent;
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-fast), background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.kanban-column.is-over {
  border-color: var(--column-color);
  background: var(--color-primary-soft);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--column-color) 18%, transparent);
}

.column-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 12px;
}

.column-icon {
  font-size: 16px;
}

.column-head h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.column-head h2::after {
  content: '';
  display: block;
  width: 22px;
  height: 3px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--column-color);
}

.column-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 7px;
  margin-left: 2px;
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
}

.column-add {
  margin-left: auto;
  width: 26px;
  height: 26px;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.column-add:hover {
  border-color: var(--column-color);
  color: var(--column-color);
  transform: rotate(90deg);
}

.column-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drop-hint {
  margin-top: 10px;
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px dashed var(--column-color);
  color: var(--color-text-muted);
  font-size: 11.5px;
  text-align: center;
  animation: hint-in 0.18s ease;
}

.card-enter-active,
.card-leave-active,
.card-move {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.card-leave-active {
  position: absolute;
  width: calc(100% - 24px);
}

@keyframes hint-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>