<script setup>
import { computed, ref } from 'vue'
import NavBar from './components/NavBar.vue'
import CategoryFilter from './components/CategoryFilter.vue'
import KanbanColumn from './components/KanbanColumn.vue'
import AddTaskModal from './components/AddTaskModal.vue'
import FunToast from './components/FunToast.vue'
import Celebration from './components/Celebration.vue'
import { useKanban } from './composables/useKanban.js'
import { useToast } from './composables/useToast.ts'
import { randomMessage } from './config/toastMessages.ts'

const {
  columns,
  tasks,
  categories,
  categoryNames,
  filterCategory,
  filteredTasks,
  stats,
  tasksOf,
  countOf,
  addTask,
  updateTask,
  removeTask,
  moveTask,
  toggleFlag,
  resetBoard,
  setFilter
} = useKanban()

const { success, error } = useToast()

const modalOpen = ref(false)
const editingTask = ref(null)
const defaultColumnId = ref('todo')
const celebrationVisible = ref(false)

const categoryColors = computed(() =>
  categories.value.reduce((map, category) => {
    map[category.name] = category.color
    return map
  }, {})
)

const visibleCount = computed(() => filteredTasks.value.length)

function openCreate(columnId = 'todo') {
  editingTask.value = null
  defaultColumnId.value = columnId || 'todo'
  modalOpen.value = true
}

function openEdit(task) {
  editingTask.value = task
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingTask.value = null
}

function handleSubmit(payload) {
  if (editingTask.value) {
    const updated = updateTask(editingTask.value.id, payload)
    if (updated) {
      success(randomMessage('update'), 'update')
    } else {
      error('保存失败：任务标题不能为空')
      return
    }
  } else {
    const created = addTask(payload)
    if (created) {
      success(randomMessage('create'), 'create')
    } else {
      error('创建失败：任务标题不能为空')
      return
    }
  }
  closeModal()
}

function handleRemove(task) {
  const confirmed = window.confirm(`确定删除任务「${task.title}」吗？删除后不可恢复。`)
  if (!confirmed) return
  const removed = removeTask(task.id)
  if (removed) success(randomMessage('delete'), 'delete')
}

function handleMove(taskId, columnId) {
  const before = tasks.value.find((task) => task.id === taskId)
  const wasDone = before?.columnId === 'done'
  const moved = moveTask(taskId, columnId)
  if (!moved) return

  success(randomMessage('move'), 'move')
  if (columnId === 'done' && !wasDone) {
    celebrationVisible.value = true
  }
}

function handleToggle(id, flag) {
  const changed = toggleFlag(id, flag)
  if (!changed) return
  success(randomMessage(flag === 'starred' ? 'star' : 'urgent'), flag)
}

function handleFilter(name) {
  setFilter(name)
  success(randomMessage('filter'), 'filter')
}

function handleReset() {
  if (!tasks.value.length) {
    error('看板已经是空的，无需重置')
    return
  }
  const confirmed = window.confirm('确定要清空全部任务并恢复默认分类吗？此操作不可撤销。')
  if (!confirmed) return
  resetBoard()
  success(randomMessage('reset'), 'reset')
}
</script>

<template>
  <div class="app-shell">
    <NavBar :stats="stats" :visible-count="visibleCount" @add="openCreate()" @reset="handleReset" />

    <CategoryFilter
      :categories="categories"
      :tasks="tasks"
      :active="filterCategory"
      @select="handleFilter"
    />

    <main class="board" aria-label="任务看板">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :tasks="tasksOf(column.id)"
        :total-count="countOf(column.id)"
        :filtered="filterCategory !== 'all'"
        :category-colors="categoryColors"
        @move="handleMove"
        @edit="openEdit"
        @remove="handleRemove"
        @toggle="handleToggle"
        @add="openCreate"
      />
    </main>

    <footer class="app-footer">
      <span>💾 数据自动保存在本机浏览器 localStorage 中，刷新页面不会丢失</span>
      <span class="footer-dot">·</span>
      <span>拖动卡片即可切换状态</span>
    </footer>

    <AddTaskModal
      v-if="modalOpen"
      :columns="columns"
      :existing-categories="categoryNames"
      :task="editingTask"
      :default-column-id="defaultColumnId"
      @submit="handleSubmit"
      @close="closeModal"
    />

    <FunToast />
    <Celebration :visible="celebrationVisible" @complete="celebrationVisible = false" />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(1320px, 100%);
  margin: 0 auto;
  padding: 22px clamp(14px, 3vw, 30px) 30px;
  min-height: 100vh;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  align-items: start;
}

.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px 6px 2px;
  font-size: 11.5px;
  color: var(--color-text-muted);
  text-align: center;
}

.footer-dot {
  opacity: 0.5;
}

@media (max-width: 960px) {
  .board {
    grid-template-columns: 1fr;
  }

  .app-shell {
    padding-top: 14px;
  }
}
</style>