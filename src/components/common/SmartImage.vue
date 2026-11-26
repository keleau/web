<script setup lang="ts">
import { ref } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    lazy?: boolean
  }>(),
  { alt: '', lazy: true },
)

const loaded = ref(false)
const failed = ref(false)
</script>

<template>
  <div class="smart-image">
    <img
      v-show="!failed"
      class="smart-image__img"
      :class="{ 'is-loaded': loaded }"
      :src="props.src"
      :alt="props.alt"
      :loading="props.lazy ? 'lazy' : 'eager'"
      decoding="async"
      @load="loaded = true"
      @error="failed = true"
    />

    <div v-if="!loaded && !failed" class="smart-image__state">
      <el-icon><Picture /></el-icon>
    </div>

    <div v-if="failed" class="smart-image__state">
      <el-icon><Picture /></el-icon>
      <span>图片暂不可用</span>
    </div>
  </div>
</template>

<style scoped>
.smart-image {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(140deg, #1c2230 0%, #151519 45%, #0f0f12 100%);
}

.smart-image__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.smart-image__img.is-loaded {
  opacity: 1;
}

.smart-image__state {
  position: absolute;
  inset: 0;
  display: flex;
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
