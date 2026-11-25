<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TabOption {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string
  options: TabOption[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemRefs = ref<(HTMLButtonElement | null)[]>([])
const indicator = ref({ left: 0, width: 0 })
let resizeObserver: ResizeObserver | null = null

function setItemRef(el: unknown, index: number) {
  itemRefs.value[index] = el instanceof HTMLButtonElement ? el : null
}

function updateIndicator() {
  const index = props.options.findIndex((option) => option.value === props.modelValue)
  const el = itemRefs.value[index]
  if (!el) return
  indicator.value = { left: el.offsetLeft, width: el.offsetWidth }
}

function select(value: string) {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
  }
}

onMounted(async () => {
  await nextTick()
  updateIndicator()
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => updateIndicator())
    resizeObserver.observe(containerRef.value)
  }
})

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    updateIndicator()
  },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="section-tabs" role="tablist">
    <span
      class="section-tabs__indicator"
      aria-hidden="true"
      :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
    />
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => setItemRef(el, index)"
      class="section-tabs__item"
      :class="{ 'is-active': modelValue === option.value }"
      type="button"
      role="tab"
      :aria-selected="modelValue === option.value"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.section-tabs {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
  padding: 4px;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  background: var(--surface-1);
  scrollbar-width: none;
}

.section-tabs::-webkit-scrollbar {
  display: none;
}

.section-tabs__indicator {
  position: absolute;
  top: 4px;
  left: 0;
  height: 30px;
  border: 1px solid var(--brand-border);
  border-radius: 8px;
  background: var(--brand-soft);
  pointer-events: none;
  transition:
    transform 0.3s ease,
    width 0.3s ease;
}

.section-tabs__item {
  position: relative;
  z-index: 1;
  height: 30px;
  flex-shrink: 0;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 13px;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.section-tabs__item:hover,
.section-tabs__item.is-active {
  color: var(--text-primary);
}
</style>
