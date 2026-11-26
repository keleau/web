<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TabOption {
  label: string
  value: string
  count?: number
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
  <div ref="containerRef" class="index-tabs" role="tablist">
    <span
      class="index-tabs__indicator"
      aria-hidden="true"
      :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
    />
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => setItemRef(el, index)"
      class="index-tabs__item"
      :class="{ 'is-active': modelValue === option.value }"
      type="button"
      role="tab"
      :aria-selected="modelValue === option.value"
      @click="select(option.value)"
    >
      <span>{{ option.label }}</span>
      <span v-if="option.count !== undefined" class="index-tabs__count">{{ option.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.index-tabs {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  flex-wrap: nowrap;
  gap: 2px;
  overflow-x: auto;
  border-bottom: 1px solid var(--hairline);
  scrollbar-width: none;
}

.index-tabs::-webkit-scrollbar {
  display: none;
}

.index-tabs__indicator {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 1px;
  background: var(--brand);
  pointer-events: none;
  transition:
    transform 0.35s var(--ease-out),
    width 0.35s var(--ease-out);
}

.index-tabs__item {
  display: inline-flex;
  flex-shrink: 0;
  align-items: baseline;
  gap: 5px;
  padding: 2px 16px 10px;
  color: var(--text-muted);
  font-size: 12.5px;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.index-tabs__item:hover {
  color: var(--text-secondary);
}

.index-tabs__item.is-active {
  color: var(--text-primary);
}

.index-tabs__count {
  color: var(--text-dim);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.index-tabs__item.is-active .index-tabs__count {
  color: var(--sand);
}
</style>
