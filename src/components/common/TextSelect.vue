<script setup lang="ts" generic="T extends string">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowDown, Check } from '@element-plus/icons-vue'
import type { SelectOption } from '@/types/select'

const props = withDefaults(
  defineProps<{
    modelValue: T
    options: SelectOption<T>[]
    label: string
    defaultValue?: T
    align?: 'left' | 'right'
    alwaysShowValue?: boolean
  }>(),
  {
    align: 'left',
    alwaysShowValue: false,
    defaultValue: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)

const activeOption = computed(() => props.options.find((option) => option.value === props.modelValue))

const showsValue = computed(
  () =>
    props.alwaysShowValue ||
    (props.defaultValue !== undefined && props.modelValue !== props.defaultValue),
)

const displayText = computed(() => {
  if (!showsValue.value || !activeOption.value) return props.label
  return `${props.label} · ${activeOption.value.label}`
})

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function select(value: T) {
  emit('update:modelValue', value)
  close()
  nextTick(() => triggerRef.value?.focus())
}

function onPointerDown(event: PointerEvent) {
  if (!rootRef.value) return
  if (!rootRef.value.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    event.stopPropagation()
    close()
    triggerRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <div ref="rootRef" class="text-select" :class="`is-${align}`" @keydown="onKeydown">
    <button
      ref="triggerRef"
      class="text-select__trigger"
      :class="{ 'is-open': isOpen, 'is-set': showsValue }"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="`${label}筛选`"
      @click="toggle"
    >
      <span>{{ displayText }}</span>
      <el-icon class="text-select__chevron" :size="10"><ArrowDown /></el-icon>
    </button>

    <Transition name="select">
      <ul v-if="isOpen" class="text-select__panel" role="listbox" :aria-label="label">
        <li v-for="option in options" :key="option.value">
          <button
            class="text-select__option"
            :class="{ 'is-selected': option.value === modelValue }"
            type="button"
            role="option"
            :aria-selected="option.value === modelValue"
            @click="select(option.value)"
          >
            <span>{{ option.label }}</span>
            <el-icon v-if="option.value === modelValue" :size="12"><Check /></el-icon>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.text-select {
  position: relative;
  flex-shrink: 0;
}

.text-select.is-right {
  margin-left: auto;
}

.text-select__trigger {
  display: inline-flex;
  height: 32px;
  align-items: center;
  gap: 6px;
  padding: 0 2px;
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.text-select__trigger:hover,
.text-select__trigger.is-open {
  color: var(--text-primary);
}

.text-select__trigger.is-set {
  color: var(--sand);
}

.text-select__chevron {
  transition: transform 0.25s var(--ease-out);
}

.text-select__trigger.is-open .text-select__chevron {
  transform: rotate(180deg);
}

.text-select__panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 80;
  min-width: 178px;
  padding: 6px;
  border: 1px solid var(--hairline-strong);
  background: #121216;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
  list-style: none;
}

.text-select.is-right .text-select__panel {
  right: 0;
  left: auto;
}

.text-select__option {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 12px;
  text-align: left;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.text-select__option:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.text-select__option.is-selected {
  color: var(--text-primary);
}

.text-select__option.is-selected .el-icon {
  color: var(--sand);
}

.select-enter-active,
.select-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s var(--ease-out);
}

.select-enter-from,
.select-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
