<script setup lang="ts">
/**
 * ModelViewer —— 与 deep-mesh.cn 同款的 3D 商品预览
 *
 * 加载链路（和对方一致）：
 *   glb 二进制 → ArrayBuffer 缓存 → URL.createObjectURL(blob) → GLTFLoader + DRACOLoader → WebGL
 *
 * 职责划分：
 *   本组件只负责“内容”：模型加载、进度、poster 淡出、状态提示
 *   three.js 渲染内核（renderer/scene/camera/控制/自适应/释放）由 ThreeStage 承载
 *
 * 性能要点：
 *   1. 组件通过 defineAsyncComponent 懒加载，three.js 单独分包，不进首屏
 *   2. GLB 按 URL 缓存 ArrayBuffer，重复打开秒开
 *   3. 页面不可见 / 元素移出视口时停掉渲染循环，省 GPU
 *   4. 卸载时逐项 dispose，避免显存泄漏
 */
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import ThreeStage from '@/components/common/ThreeStage.vue'

const props = withDefaults(
  defineProps<{
    /** .glb 模型地址；留空则展示内置占位浮雕 */
    src?: string
    /** 占位模型的配色种子（一般传商品 id） */
    variant?: string
    /** 加载期间铺底的商品图，模型就绪后淡出 */
    poster?: string
  }>(),
  { src: '', variant: '', poster: '' },
)

const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'error', message: string): void
}>()

type Phase = 'loading' | 'ready' | 'error'

const stage = ref<InstanceType<typeof ThreeStage> | null>(null)
const phase = ref<Phase>('loading')
const progress = ref(0)
const errorText = ref('')

/** GLB 二进制缓存：同 URL 只下载一次 */
const bufferCache = new Map<string, ArrayBuffer>()
const CACHE_LIMIT = 8

/** GLB 魔数 0x46546C67 = "glTF" */
const GLB_MAGIC = 0x46546c67

/* ---------------- 模型来源 ---------------- */

function isGLB(buffer: ArrayBuffer) {
  if (buffer.byteLength < 12) return false
  return new DataView(buffer).getUint32(0, true) === GLB_MAGIC
}

async function fetchModel(url: string): Promise<ArrayBuffer> {
  const cached = bufferCache.get(url)
  if (cached) {
    progress.value = 0.85
    return cached
  }

  const response = await fetch(url)
  if (!response.ok) throw new Error(`模型请求失败（${response.status}）`)

  const total = Number(response.headers.get('content-length') || 0)
  const reader = response.body?.getReader()
  let buffer: ArrayBuffer

  if (!reader || !total) {
    buffer = await response.arrayBuffer()
  } else {
    const chunks: Uint8Array[] = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      progress.value = Math.min(0.85, (received / total) * 0.85)
    }
    const merged = new Uint8Array(received)
    let offset = 0
    for (const chunk of chunks) {
      merged.set(chunk, offset)
      offset += chunk.length
    }
    buffer = merged.buffer
  }

  if (bufferCache.size >= CACHE_LIMIT) {
    const oldest = bufferCache.keys().next().value
    if (oldest) bufferCache.delete(oldest)
  }
  bufferCache.set(url, buffer)
  progress.value = 0.85
  return buffer
}

async function parseGLB(buffer: ArrayBuffer): Promise<THREE.Object3D> {
  if (!isGLB(buffer)) throw new Error('仅支持 .glb（GLTF Binary）模型')

  const loader = new GLTFLoader()
  const draco = new DRACOLoader()
  // 只有遇到 Draco 压缩的网格时才会真正去拉解码器
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  loader.setDRACOLoader(draco)

  const blobUrl = URL.createObjectURL(new Blob([buffer], { type: 'model/gltf-binary' }))
  try {
    const gltf = await loader.loadAsync(blobUrl, (event) => {
      if (!event.total) return
      progress.value = 0.85 + Math.min(0.15, (event.loaded / event.total) * 0.15)
    })
    return gltf.scene
  } finally {
    URL.revokeObjectURL(blobUrl)
    draco.dispose()
  }
}

/* ---------------- 占位浮雕模型（没有 glb 时兜底） ---------------- */

function roundedRect(width: number, height: number, radius: number) {
  const shape = new THREE.Shape()
  const x = -width / 2
  const y = -height / 2
  const w = width
  const h = height
  const r = radius
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

function createPlaceholder(variant: string): THREE.Object3D {
  const palettes = [
    { base: 0xe8d7bd, relief: 0xb98a5a, accent: 0x0f7bd1 },
    { base: 0xdccbb2, relief: 0x8d6b4a, accent: 0xdcae66 },
    { base: 0xe6e3db, relief: 0x9c9488, accent: 0x47586b },
  ]
  let hash = 0
  for (let i = 0; i < variant.length; i += 1) {
    hash = (hash * 31 + variant.charCodeAt(i)) >>> 0
  }
  const palette = palettes[hash % palettes.length]

  const group = new THREE.Group()

  const plateGeometry = new THREE.ExtrudeGeometry(roundedRect(3.1, 4.05, 0.34), {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 3,
    curveSegments: 14,
  })
  plateGeometry.center()
  const plate = new THREE.Mesh(
    plateGeometry,
    new THREE.MeshPhysicalMaterial({
      color: palette.base,
      roughness: 0.42,
      metalness: 0.14,
      clearcoat: 0.5,
      clearcoatRoughness: 0.36,
    }),
  )
  group.add(plate)

  const reliefGeometry = new THREE.ExtrudeGeometry(roundedRect(2.3, 3.1, 0.24), {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    curveSegments: 12,
  })
  reliefGeometry.center()
  const relief = new THREE.Mesh(
    reliefGeometry,
    new THREE.MeshPhysicalMaterial({
      color: palette.relief,
      roughness: 0.3,
      metalness: 0.55,
    }),
  )
  relief.position.z = 0.15
  group.add(relief)

  const gem = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.42, 2),
    new THREE.MeshPhysicalMaterial({
      color: palette.accent,
      roughness: 0.18,
      metalness: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    }),
  )
  gem.position.z = 0.46
  group.add(gem)

  group.rotation.y = -0.14
  return group
}

/* ---------------- 加载流程 ---------------- */

function mountObject(object: THREE.Object3D) {
  if (!stage.value?.setObject(object)) return
  phase.value = 'ready'
  progress.value = 1
  emit('ready')
}

function handleStageError(message: string) {
  phase.value = 'error'
  errorText.value = message
  emit('error', message)
}

async function boot() {
  if (phase.value === 'error') return

  try {
    const object = props.src ? await parseGLB(await fetchModel(props.src)) : createPlaceholder(props.variant)
    mountObject(object)
  } catch (error) {
    const message = error instanceof Error ? error.message : '模型加载失败'
    phase.value = 'error'
    errorText.value = message
    emit('error', message)
  }
}

onMounted(() => {
  void boot()
})
</script>

<template>
  <div class="model-viewer" :class="`is-${phase}`">
    <img
      v-if="poster"
      class="model-viewer__poster"
      :class="{ 'is-hidden': phase === 'ready' }"
      :src="poster"
      alt=""
      aria-hidden="true"
    />

    <ThreeStage ref="stage" @error="handleStageError" />

    <div v-if="phase !== 'ready'" class="model-viewer__loading">
      <template v-if="phase === 'loading'">
        <div class="model-viewer__chip">
          <span class="model-viewer__loading-text">模型极速加载中...</span>
          <span class="model-viewer__loading-sub">材质：高精全彩树脂</span>
        </div>
        <div class="model-viewer__bar">
          <i :style="{ transform: `scaleX(${progress})` }"></i>
        </div>
      </template>
      <span v-else class="model-viewer__loading-text is-error">{{ errorText }}</span>
    </div>

    <span v-if="phase === 'ready'" class="model-viewer__hint">拖拽旋转 · 滚轮缩放</span>
  </div>
</template>

<style scoped>
.model-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 50% 18%, #1e2430 0%, #101116 58%, #0a0a0d 100%);
  cursor: grab;
}

.model-viewer:active {
  cursor: grabbing;
}

.model-viewer__poster {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  pointer-events: none;
  transition: opacity 0.45s ease;
}

.model-viewer__poster.is-hidden {
  opacity: 0;
}

.model-viewer__loading {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  pointer-events: none;
}

.model-viewer__chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 9px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(9, 9, 11, 0.6);
  backdrop-filter: blur(8px);
}

.model-viewer__loading-text.is-error {
  max-width: 76%;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(9, 9, 11, 0.62);
  color: rgba(255, 160, 120, 0.85);
  line-height: 1.7;
  text-align: center;
}

.model-viewer__loading-sub {
  color: rgba(255, 255, 255, 0.26);
  font-size: 9.5px;
}

.model-viewer__bar {
  width: 96px;
  height: 2px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.model-viewer__bar i {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.25s ease;
}

.model-viewer__hint {
  position: absolute;
  right: 12px;
  bottom: 10px;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.55);
  color: rgba(255, 255, 255, 0.45);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  pointer-events: none;
  backdrop-filter: blur(6px);
}
</style>
