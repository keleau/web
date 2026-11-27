<script setup lang="ts">
import { Grid, List } from '@element-plus/icons-vue'
import TextSelect from '@/components/common/TextSelect.vue'
import { getProductCategories } from '@/services/catalog'
import type { SelectOption } from '@/types/select'
import type {
  AvailabilityFilter,
  PriceBand,
  ProductFilter,
  SortKey,
  ViewMode,
} from '@/types/catalog'

const props = defineProps<{
  category: ProductFilter
  availability: AvailabilityFilter
  priceBand: PriceBand
  sort: SortKey
  view: ViewMode
  count: number
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  (e: 'update:category', value: ProductFilter): void
  (e: 'update:availability', value: AvailabilityFilter): void
  (e: 'update:priceBand', value: PriceBand): void
  (e: 'update:sort', value: SortKey): void
  (e: 'update:view', value: ViewMode): void
  (e: 'reset'): void
}>()

const categoryOptions: SelectOption<ProductFilter>[] = getProductCategories().map((category) => ({
  label: category,
  value: category,
}))

const availabilityOptions: SelectOption<AvailabilityFilter>[] = [
  { label: '全部', value: 'all' },
  { label: '开放版现货', value: 'in-stock' },
  { label: '限量版', value: 'limited' },
]

const priceOptions: SelectOption<PriceBand>[] = [
  { label: '全部', value: 'all' },
  { label: '¥500 以下', value: 'under-500' },
  { label: '¥500 – 1,000', value: '500-1000' },
  { label: '¥1,000 以上', value: 'over-1000' },
]

const sortOptions: SelectOption<SortKey>[] = [
  { label: '推荐', value: 'recommended' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
  { label: '销量优先', value: 'popular' },
]
</script>

<template>
  <div class="store-toolbar">
    <div class="store-toolbar__filters">
      <TextSelect
        :model-value="props.category"
        :options="categoryOptions"
        label="品类"
        default-value="全部"
        @update:model-value="emit('update:category', $event)"
      />

      <TextSelect
        :model-value="props.availability"
        :options="availabilityOptions"
        label="可用性"
        default-value="all"
        @update:model-value="emit('update:availability', $event)"
      />

      <TextSelect
        :model-value="props.priceBand"
        :options="priceOptions"
        label="价格"
        default-value="all"
        @update:model-value="emit('update:priceBand', $event)"
      />

      <button
        v-if="props.hasActiveFilters"
        class="store-toolbar__reset"
        type="button"
        @click="emit('reset')"
      >
        重置
      </button>
    </div>

    <div class="store-toolbar__right">
      <span class="store-toolbar__count">{{ props.count }} 件商品</span>

      <span class="store-toolbar__divider" aria-hidden="true"></span>

      <TextSelect
        :model-value="props.sort"
        :options="sortOptions"
        label="排序"
        default-value="recommended"
        align="right"
        always-show-value
        @update:model-value="emit('update:sort', $event)"
      />

      <div class="view-switch" role="group" aria-label="切换商品展示方式">
        <button
          class="view-switch__button"
          :class="{ 'is-active': props.view === 'grid' }"
          type="button"
          aria-label="网格视图"
          :aria-pressed="props.view === 'grid'"
          @click="emit('update:view', 'grid')"
        >
          <el-icon :size="15"><Grid /></el-icon>
        </button>
        <button
          class="view-switch__button"
          :class="{ 'is-active': props.view === 'list' }"
          type="button"
          aria-label="列表视图"
          :aria-pressed="props.view === 'list'"
          @click="emit('update:view', 'list')"
        >
          <el-icon :size="15"><List /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-toolbar {
  position: sticky;
  top: var(--header-height);
  z-index: 50;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 28px;
  padding: 10px 0;
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  background: rgba(9, 9, 11, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.store-toolbar__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 22px;
}

.store-toolbar__reset {
  padding: 0 2px;
  color: var(--text-dim);
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.store-toolbar__reset:hover {
  color: var(--sand);
}

.store-toolbar__right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-left: auto;
}

.store-toolbar__count {
  color: var(--text-dim);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

.store-toolbar__divider {
  width: 1px;
  height: 14px;
  background: var(--hairline);
}

.view-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.view-switch__button {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: var(--text-dim);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.view-switch__button:hover {
  color: var(--text-secondary);
}

.view-switch__button.is-active {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text-primary);
}

@media (max-width: 560px) {
  .store-toolbar {
    gap: 6px;
  }

  .store-toolbar__filters {
    width: 100%;
    gap: 2px 18px;
  }

  .store-toolbar__right {
    width: 100%;
    justify-content: flex-start;
    border-top: 1px solid var(--hairline);
    padding-top: 8px;
  }

  .store-toolbar__divider {
    display: none;
  }

  .store-toolbar__count {
    margin-right: auto;
  }
}
</style>
