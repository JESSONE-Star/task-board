<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  tasks: {
    type: Array,
    default: () => []
  },
  active: {
    type: String,
    default: 'all'
  }
})

defineEmits(['select'])

const filterOptions = computed(() => {
  const items = [{ name: 'all', label: '全部分类', color: 'var(--color-text-muted)', count: props.tasks.length }]
  props.categories.forEach((category) => {
    items.push({
      name: category.name,
      label: category.name,
      color: category.color,
      count: props.tasks.filter((task) => task.category === category.name).length
    })
  })
  items.push({
    name: '__uncategorized__',
    label: '未分类',
    color: 'var(--color-text-muted)',
    count: props.tasks.filter((task) => !task.category).length
  })
  return items.filter((item) => item.name === 'all' || item.count > 0 || item.name === props.active)
})
</script>

<template>
  <div class="filter-bar" role="toolbar" aria-label="按分类筛选任务">
    <div class="filter-title">
      <span aria-hidden="true">🏷️</span>
      <span>分类筛选</span>
    </div>
    <div class="filter-chips">
      <button
        v-for="option in filterOptions"
        :key="option.name"
        type="button"
        class="filter-chip"
        :class="{ active: active === option.name }"
        @click="$emit('select', option.name)"
      >
        <span class="dot" :style="{ background: option.color }"></span>
        <span>{{ option.label }}</span>
        <span class="count">{{ option.count }}</span>
      </button>
    </div>
    <span v-if="active !== 'all'" class="filter-hint">
      仅显示「{{ active === '__uncategorized__' ? '未分类' : active }}」的任务
      <button type="button" class="clear-filter" @click="$emit('select', 'all')">清除筛选</button>
    </span>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.filter-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.filter-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
  transform: translateY(-1px);
}

.filter-chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 6px 14px -8px var(--color-primary);
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.filter-chip.active .dot {
  background: rgba(255, 255, 255, 0.9) !important;
}

.count {
  opacity: 0.75;
  font-size: 11px;
}

.filter-hint {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-muted);
}

.clear-filter {
  margin-left: 8px;
  border: none;
  background: none;
  padding: 0;
  color: var(--color-primary);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .filter-hint {
    margin-left: 0;
    width: 100%;
  }
}
</style>