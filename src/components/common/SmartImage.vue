<script setup lang="ts">
import { Picture } from '@element-plus/icons-vue'

withDefaults(
  defineProps<{
    src: string
    alt?: string
    lazy?: boolean
  }>(),
  { alt: '', lazy: true },
)
</script>

<template>
  <el-image class="smart-image" :src="src" :alt="alt" fit="cover" :lazy="lazy">
    <template #placeholder>
      <div class="smart-image__state">
        <el-icon><Picture /></el-icon>
      </div>
    </template>
    <template #error>
      <div class="smart-image__state">
        <el-icon><Picture /></el-icon>
        <span>图片暂不可用</span>
      </div>
    </template>
  </el-image>
</template>

<style scoped>
.smart-image {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(140deg, #1c2230 0%, #151519 45%, #0f0f12 100%);
}

.smart-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.smart-image__state {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(140deg, #1c2230 0%, #121216 70%);
  color: rgba(255, 255, 255, 0.36);
  font-size: 12px;
}

.smart-image__state .el-icon {
  font-size: 22px;
}
</style>
