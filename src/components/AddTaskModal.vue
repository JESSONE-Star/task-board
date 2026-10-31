<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  existingCategories: {
    type: Array,
    default: () => []
  },
  task: {
    type: Object,
    default: null
  },
  defaultColumnId: {
    type: String,
    default: 'todo'
  }
})

const emit = defineEmits(['submit', 'close'])

const titleInput = ref(null)
const errorMessage = ref('')
const shaking = ref(false)

const form = reactive({
  title: props.task?.title || '',
  description: props.task?.description || '',
  category: props.task?.category || '',
  columnId: props.task?.columnId || props.defaultColumnId,
  starred: Boolean(props.task?.starred),
  urgent: Boolean(props.task?.urgent)
})

const isEdit = computed(() => Boolean(props.task))
const categoryOptions = computed(() => {
  const set = new Set(props.existingCategories)
  if (form.category.trim()) set.add(form.category.trim())
  return Array.from(set)
})

function validate() {
  if (!form.title.trim()) {
    errorMessage.value = '请填写任务标题'
    shaking.value = false
    requestAnimationFrame(() => {
      shaking.value = true
    })
    setTimeout(() => {
      shaking.value = false
    }, 420)
    return false
  }
  errorMessage.value = ''
  return true
}

function submit() {
  if (!validate()) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    columnId: form.columnId,
    starred: form.starred,
    urgent: form.urgent
  })
}

function close() {
  emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') submit()
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
  await nextTick()
  titleInput.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="modal-mask" @click.self="close">
    <div class="modal" :class="{ shaking }" role="dialog" aria-modal="true" :aria-label="isEdit ? '编辑任务' : '新增任务'">
      <header class="modal-head">
        <div>
          <h2>{{ isEdit ? '编辑任务' : '新增任务' }}</h2>
          <p>{{ isEdit ? '修改卡片信息，保存后立即生效' : '记录一件事，让看板帮你记住' }}</p>
        </div>
        <button type="button" class="modal-close" aria-label="关闭" @click="close">✕</button>
      </header>

      <form class="modal-body" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">标题 <em>*</em></span>
          <input
            ref="titleInput"
            v-model="form.title"
            type="text"
            maxlength="60"
            placeholder="例如：完成季度复盘报告"
            :class="{ invalid: errorMessage }"
            @input="errorMessage = ''"
          />
          <span v-if="errorMessage" class="field-error">{{ errorMessage }}</span>
        </label>

        <label class="field">
          <span class="field-label">描述</span>
          <textarea
            v-model="form.description"
            rows="3"
            maxlength="300"
            placeholder="补充一些细节，让未来的自己看得懂（选填）"
          ></textarea>
        </label>

        <div class="field">
          <span class="field-label">分类</span>
          <input
            v-model="form.category"
            type="text"
            maxlength="16"
            list="category-suggestions"
            placeholder="输入或选择分类，支持自定义"
          />
          <datalist id="category-suggestions">
            <option v-for="name in existingCategories" :key="name" :value="name"></option>
          </datalist>
          <div v-if="categoryOptions.length" class="category-presets">
            <button
              v-for="name in categoryOptions"
              :key="name"
              type="button"
              class="preset-chip"
              :class="{ active: form.category === name }"
              @click="form.category = name"
            >
              {{ name }}
            </button>
          </div>
        </div>

        <div class="field">
          <span class="field-label">所属列</span>
          <div class="column-options">
            <button
              v-for="column in columns"
              :key="column.id"
              type="button"
              class="column-option"
              :class="{ active: form.columnId === column.id }"
              @click="form.columnId = column.id"
            >
              <span>{{ column.icon }}</span>
              {{ column.title }}
            </button>
          </div>
        </div>

        <div class="toggles">
          <label class="toggle">
            <input v-model="form.starred" type="checkbox" />
            <span>⭐ 标记为重要</span>
          </label>
          <label class="toggle">
            <input v-model="form.urgent" type="checkbox" />
            <span>🔥 标记为紧急</span>
          </label>
        </div>

        <footer class="modal-foot">
          <span class="shortcut">Ctrl + Enter 快速保存</span>
          <div class="foot-actions">
            <button type="button" class="btn btn-ghost" @click="close">取消</button>
            <button type="submit" class="btn btn-primary">
              {{ isEdit ? '保存修改' : '创建任务' }}
            </button>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  animation: mask-in 0.18s ease;
}

.modal {
  width: min(560px, 100%);
  max-height: min(88vh, 720px);
  overflow-y: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 30px 70px -20px rgba(15, 23, 42, 0.5);
  animation: modal-in 0.22s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.modal.shaking {
  animation: shake 0.4s ease;
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 12px;
}

.modal-head h2 {
  margin: 0;
  font-size: 18px;
}

.modal-head p {
  margin: 5px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.modal-close {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 9px;
  background: var(--color-bg-soft);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.12);
  color: var(--color-danger);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 6px 22px 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.field-label em {
  color: var(--color-danger);
  font-style: normal;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: inherit;
  font-size: 13px;
  outline: none;
  resize: vertical;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.field input:focus,
.field textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent);
}

.field input.invalid {
  border-color: var(--color-danger);
}

.field-error {
  font-size: 11.5px;
  color: var(--color-danger);
}

.category-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.preset-chip {
  padding: 4px 9px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 11px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preset-chip:hover,
.preset-chip.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.column-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.column-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 36px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.column-option:hover,
.column-option.active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.toggles {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--color-text-muted);
  cursor: pointer;
}

.toggle input {
  width: 15px;
  height: 15px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.modal-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.shortcut {
  font-size: 11px;
  color: var(--color-text-muted);
}

.foot-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

@keyframes mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

@media (max-width: 520px) {
  .modal-head,
  .modal-body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .column-options {
    grid-template-columns: 1fr;
  }
}
</style>