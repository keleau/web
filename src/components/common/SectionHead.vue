<script setup lang="ts">
/** 统一的分区标题：kicker + 标题 + 右侧说明，支持 actions 插槽扩展操作入口 */
withDefaults(
  defineProps<{
    kicker: string
    title: string
    note?: string
  }>(),
  { note: '' },
)
</script>

<template>
  <div class="section-head">
    <div class="section-head__title">
      <span class="kicker">{{ kicker }}</span>
      <div class="section-head__heading">
        <h2>{{ title }}</h2>
        <slot name="actions" />
      </div>
    </div>
    <p v-if="note" class="section-head__note">{{ note }}</p>
  </div>
</template>

<style scoped>
.section-head__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
</style>
