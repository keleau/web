<script setup lang="ts">
/**
 * QuantityStepper —— 受控数量步进器
 * 只通过 update:modelValue 通知父级，不直接修改 prop；边界值自动收敛。
 */
import { Minus, Plus } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    size?: 'sm' | 'md'
    disabled?: boolean
    label?: string
  }>(),
  {
    min: 1,
    max: 99,
    size: 'md',
    disabled: false,
    label: '数量',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

function clamp(value: number) {
  if (!Number.isFinite(value)) return props.min
  return Math.min(props.max, Math.max(props.min, Math.trunc(value)))
}

function setValue(next: number) {
  if (props.disabled) return
  const value = clamp(next)
  if (value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div
    class="quantity-stepper"
    :class="[`is-${props.size}`, { 'is-disabled': props.disabled }]"
    role="group"
    :aria-label="props.label"
  >
    <button
      type="button"
      :aria-label="`减少${props.label}`"
      :disabled="props.disabled || props.modelValue <= props.min"
      @click="setValue(props.modelValue - 1)"
    >
      <el-icon :size="13"><Minus /></el-icon>
    </button>

    <span aria-live="polite">{{ props.modelValue }}</span>

    <button
      type="button"
      :aria-label="`增加${props.label}`"
      :disabled="props.disabled || props.modelValue >= props.max"
      @click="setValue(props.modelValue + 1)"
    >
      <el-icon :size="13"><Plus /></el-icon>
    </button>
  </div>
</template>

<style scoped>
.quantity-stepper {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--hairline-strong);
  border-radius: var(--radius-pill);
}

.quantity-stepper button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.quantity-stepper button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.quantity-stepper button:disabled {
  color: var(--text-dim);
  cursor: not-allowed;
}

.quantity-stepper span {
  color: var(--text-primary);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  text-align: center;
}

.quantity-stepper.is-md button {
  width: 38px;
  height: 46px;
}

.quantity-stepper.is-md span {
  min-width: 40px;
}

.quantity-stepper.is-sm {
  border-radius: 8px;
}

.quantity-stepper.is-sm button {
  width: 26px;
  height: 26px;
}

.quantity-stepper.is-sm span {
  min-width: 26px;
  font-size: 11.5px;
}

.quantity-stepper.is-disabled {
  opacity: 0.6;
}
</style>
