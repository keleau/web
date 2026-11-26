<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Close, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

/** 参考图上传组件：本地预览 + 可插拔的后端上传，通过 v-model 输出 File[] */
type UploadStatus = 'local' | 'uploading' | 'done' | 'error'

interface UploadItem {
  file: File
  previewUrl: string
  status: UploadStatus
  progress: number
  remoteUrl?: string
}

type Uploader = (
  file: File,
  onProgress: (percent: number) => void,
) => Promise<string | { url: string }>

const props = withDefaults(
  defineProps<{
    /** 最多可选图片数量 */
    max?: number
    /** 单张图片大小上限（MB） */
    maxSize?: number
    /** 后端上传函数，不传则只保留本地预览 */
    uploader?: Uploader
  }>(),
  {
    max: 6,
    maxSize: 10,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', files: File[]): void
  (e: 'change', files: File[]): void
}>()

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const items = ref<UploadItem[]>([])
const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const dragDepth = ref(0)

const isFull = computed(() => items.value.length >= props.max)

function emitFiles() {
  const files = items.value.map((item) => item.file)
  emit('update:modelValue', files)
  emit('change', files)
}

function openPicker() {
  if (isFull.value) {
    ElMessage.warning(`最多上传 ${props.max} 张参考图`)
    return
  }
  inputRef.value?.click()
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) addFiles(target.files)
  // 重置 value，保证再次选择同一张图也能触发 change
  target.value = ''
}

function onDragEnter() {
  dragDepth.value += 1
  isDragging.value = true
}

function onDragLeave() {
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  isDragging.value = dragDepth.value > 0
}

function onDrop(event: DragEvent) {
  dragDepth.value = 0
  isDragging.value = false
  if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files)
}

function addFiles(input: FileList | File[]) {
  const incoming = Array.from(input)
  const room = props.max - items.value.length

  if (room <= 0) {
    ElMessage.warning(`最多上传 ${props.max} 张参考图`)
    return
  }

  const accepted: File[] = []
  for (const file of incoming) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      ElMessage.warning(`「${file.name}」不是支持的图片格式`)
      continue
    }
    if (file.size > props.maxSize * 1024 * 1024) {
      ElMessage.warning(`「${file.name}」超过 ${props.maxSize}MB`)
      continue
    }
    if (accepted.length >= room) {
      ElMessage.warning(`最多上传 ${props.max} 张参考图`)
      break
    }
    accepted.push(file)
  }

  accepted.forEach((file) => {
    items.value.push({
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'local',
      progress: 0,
    })
    const item = items.value[items.value.length - 1]
    if (props.uploader) void uploadItem(item)
  })

  if (accepted.length) emitFiles()
}

async function uploadItem(item: UploadItem) {
  const uploader = props.uploader
  if (!uploader) return

  item.status = 'uploading'
  item.progress = 0

  try {
    const result = await uploader(item.file, (percent) => {
      item.progress = Math.min(100, Math.max(0, Math.round(percent)))
    })
    item.remoteUrl = typeof result === 'string' ? result : result.url
    item.status = 'done'
    item.progress = 100
  } catch {
    item.status = 'error'
    ElMessage.error(`「${item.file.name}」上传失败，可点击重试`)
  }
}

function removeItem(item: UploadItem) {
  URL.revokeObjectURL(item.previewUrl)
  items.value = items.value.filter((current) => current !== item)
  emitFiles()
}

function clearAll() {
  items.value.forEach((item) => URL.revokeObjectURL(item.previewUrl))
  items.value = []
  emitFiles()
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function statusText(item: UploadItem) {
  if (item.status === 'uploading') return `${item.progress}%`
  if (item.status === 'done') return '已上传'
  if (item.status === 'error') return '上传失败'
  return '本地'
}

onBeforeUnmount(() => {
  items.value.forEach((item) => URL.revokeObjectURL(item.previewUrl))
})

defineExpose({ reset: clearAll, openPicker })
</script>

<template>
  <div class="reference-uploader">
    <input
      ref="inputRef"
      class="reference-uploader__input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple
      @change="onInputChange"
    />

    <div
      class="reference-uploader__zone"
      :class="{ 'is-dragging': isDragging, 'is-filled': items.length > 0 }"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <button
        v-if="!items.length"
        class="reference-uploader__empty"
        type="button"
        :aria-label="`上传参考图，最多 ${props.max} 张`"
        @click="openPicker"
      >
        <span class="format-icons" aria-hidden="true">
          <i class="format-icons__file is-png">PNG</i>
          <i class="format-icons__file is-jpg">JPG</i>
          <i class="format-icons__file is-webp">WebP</i>
          <i class="format-icons__plus">＋</i>
        </span>
        <span class="reference-uploader__title">点击上传，或拖拽图片到这里</span>
        <span class="reference-uploader__hint">
          JPG / PNG / WEBP · 单张 ≤ {{ props.maxSize }}MB · 最多 {{ props.max }} 张
        </span>
      </button>

      <template v-else>
        <ul class="reference-uploader__grid">
          <li v-for="item in items" :key="item.previewUrl" class="reference-item">
            <div class="reference-item__media">
              <img :src="item.previewUrl" :alt="item.file.name" />
              <span class="reference-item__badge" :class="`is-${item.status}`">
                {{ statusText(item) }}
              </span>
              <button
                class="reference-item__remove"
                type="button"
                :aria-label="`移除 ${item.file.name}`"
                @click="removeItem(item)"
              >
                <el-icon :size="10"><Close /></el-icon>
              </button>
              <span v-if="item.status === 'uploading'" class="reference-item__progress">
                <i :style="{ width: `${item.progress}%` }"></i>
              </span>
              <button
                v-if="item.status === 'error'"
                class="reference-item__retry"
                type="button"
                aria-label="重新上传"
                @click="uploadItem(item)"
              >
                <el-icon :size="10"><RefreshRight /></el-icon>
              </button>
            </div>
            <p class="reference-item__name" :title="item.file.name">{{ item.file.name }}</p>
            <span class="reference-item__size">{{ formatSize(item.file.size) }}</span>
          </li>

          <li v-if="!isFull" class="reference-item reference-item--add">
            <button
              class="reference-item__add"
              type="button"
              aria-label="继续添加参考图"
              @click="openPicker"
            >
              <span aria-hidden="true">＋</span>
              <small>继续添加丰富细节</small>
            </button>
          </li>
        </ul>

        <div class="reference-uploader__foot">
          <span>已选 {{ items.length }} / {{ props.max }} 张</span>
          <button type="button" @click="clearAll">清空</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.reference-uploader {
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
}

.reference-uploader__input {
  display: none;
}

.reference-uploader__zone {
  position: relative;
  display: flex;
  min-height: 188px;
  flex: 1;
  flex-direction: column;
  padding: 12px;
  border: 1px dashed var(--hairline-strong);
  background:
    radial-gradient(60% 90% at 50% 0%, rgba(2, 155, 254, 0.05), transparent 72%),
    rgba(255, 255, 255, 0.015);
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.reference-uploader__zone.is-dragging {
  border-color: var(--brand);
  background-color: var(--brand-soft);
}

.reference-uploader__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 16px 10px;
  text-align: center;
}

.reference-uploader__empty:focus-visible {
  outline: 1px solid var(--brand);
  outline-offset: 4px;
}

.format-icons {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  transform: rotate(-4deg);
}

.format-icons__file {
  position: relative;
  display: inline-flex;
  width: 30px;
  height: 37px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: linear-gradient(150deg, #3b3b42, #26262c);
  color: rgba(255, 255, 255, 0.7);
  font-size: 8px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.28);
}

.format-icons__file::after {
  position: absolute;
  top: 0;
  right: 0;
  border-width: 0 9px 9px 0;
  border-style: solid;
  border-color: transparent rgba(255, 255, 255, 0.16) transparent transparent;
  content: '';
}

.format-icons__file.is-png {
  transform: rotate(-8deg) translateY(2px);
}

.format-icons__file.is-jpg {
  transform: translateY(-3px);
}

.format-icons__file.is-webp {
  transform: rotate(8deg) translateY(2px);
}

.format-icons__plus {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  border: 1px solid var(--hairline-strong);
  border-radius: 50%;
  color: var(--text-muted);
  font-size: 11px;
  font-style: normal;
}

.reference-uploader__title {
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 600;
}

.reference-uploader__empty:hover .reference-uploader__title {
  color: var(--text-primary);
}

.reference-uploader__hint {
  color: var(--text-dim);
  font-size: 10px;
  line-height: 1.6;
}

.reference-uploader__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px 10px;
  align-items: start;
  list-style: none;
}

.reference-item {
  min-width: 0;
}

.reference-item__media {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
}

.reference-item__media img {
  display: block;
  width: 100%;
  height: auto;
}

.reference-item__badge {
  position: absolute;
  bottom: 5px;
  left: 5px;
  padding: 2px 6px;
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.78);
  color: rgba(255, 255, 255, 0.72);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  backdrop-filter: blur(6px);
}

.reference-item__badge.is-done {
  color: var(--brand-strong);
}

.reference-item__badge.is-error {
  color: #ff8a8a;
}

.reference-item__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  display: inline-flex;
  width: 19px;
  height: 19px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(9, 9, 11, 0.72);
  color: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(6px);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.reference-item__remove:hover {
  background: rgba(220, 60, 60, 0.85);
  color: #fff;
}

.reference-item__retry {
  position: absolute;
  right: 5px;
  bottom: 5px;
  display: inline-flex;
  width: 19px;
  height: 19px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(9, 9, 11, 0.78);
  color: var(--brand-strong);
  backdrop-filter: blur(6px);
}

.reference-item__progress {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.16);
}

.reference-item__progress i {
  display: block;
  height: 100%;
  background: var(--brand);
  transition: width 0.25s ease;
}

.reference-item__name {
  overflow: hidden;
  margin-top: 5px;
  color: var(--text-muted);
  font-size: 9.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reference-item__size {
  display: block;
  color: var(--text-dim);
  font-size: 8.5px;
}

.reference-item--add {
  display: flex;
}

.reference-item__add {
  display: flex;
  width: 100%;
  aspect-ratio: 1 / 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 1px dashed var(--hairline-strong);
  color: var(--text-dim);
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.reference-item__add:hover {
  border-color: var(--brand-border);
  color: var(--brand-strong);
}

.reference-item__add span {
  font-size: 16px;
  line-height: 1;
}

.reference-item__add small {
  font-size: 8.5px;
}

.reference-uploader__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
  color: var(--text-dim);
  font-size: 10px;
}

.reference-uploader__foot button {
  flex-shrink: 0;
  color: var(--text-muted);
  font-size: 10px;
  transition: color 0.2s ease;
}

.reference-uploader__foot button:hover {
  color: var(--text-primary);
}
</style>
