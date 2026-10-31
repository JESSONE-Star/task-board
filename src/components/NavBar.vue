<script setup>
import { computed } from 'vue'
import ThemeSelector from './ThemeSelector.vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  visibleCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['add', 'reset'])

const progress = computed(() => {
  if (!props.stats.total) return 0
  return Math.round((props.stats.done / props.stats.total) * 100)
})
</script>

<template>
  <header class="navbar">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <div class="brand-text">
        <h1>任务看板</h1>
        <p>Task Flow · 让每件事都有归处</p>
      </div>
    </div>

    <div class="nav-stats">
      <div class="stat">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">全部</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ stats.pending }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat">
        <span class="stat-value accent">{{ stats.done }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-head">
          <span>完成度</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="nav-actions">
      <ThemeSelector />
      <button class="btn btn-ghost" type="button" @click="$emit('reset')">
        <span aria-hidden="true">↺</span>
        重置
      </button>
      <button class="btn btn-primary" type="button" @click="$emit('add')">
        <span aria-hidden="true">＋</span>
        新增任务
      </button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 18px 22px;
  background: var(--color-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.brand-mark {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 9px 10px;
  border-radius: 13px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  box-shadow: 0 8px 18px -8px var(--color-primary);
}

.brand-mark span {
  display: block;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
}

.brand-mark span:nth-child(2) {
  width: 78%;
}

.brand-mark span:nth-child(3) {
  width: 52%;
}

.brand-text h1 {
  margin: 0;
  font-size: 19px;
  letter-spacing: 0.4px;
}

.brand-text p {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.nav-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.stat-value {
  font-size: 19px;
  font-weight: 700;
}

.stat-value.accent {
  color: var(--color-success);
}

.stat-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.progress-wrap {
  min-width: 150px;
}

.progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 5px;
}

.progress-track {
  height: 6px;
  border-radius: 999px;
  background: var(--color-bg-soft);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  transition: width 0.35s ease;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 860px) {
  .nav-stats {
    order: 3;
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }

  .nav-actions {
    margin-left: auto;
  }
}

@media (max-width: 560px) {
  .navbar {
    padding: 14px;
    gap: 14px;
  }

  .brand {
    min-width: auto;
  }

  .brand-text p {
    display: none;
  }

  .nav-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>