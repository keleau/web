<script setup lang="ts">
/**
 * ReliefPreview —— 把上传的参考图转成可旋转的 2.9D 浮雕模型
 *
 * 复用 ThreeStage 渲染内核：读取图片亮度生成高度位移，
 * 叠在带厚度的底板上，形成类似全彩树脂浮雕的立体效果。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Shape,
  Texture,
} from 'three'
import ThreeStage from '@/components/common/ThreeStage.vue'

const props = defineProps<{
  /** 参考图地址（blob 或静态图） */
  src: string
}>()

const emit = defineEmits<{
  (e: 'ready'): void
  (e: 'error', message: string): void
}>()

type Phase = 'loading' | 'ready' | 'error'

const stage = ref<InstanceType<typeof ThreeStage> | null>(null)
const phase = ref<Phase>('loading')
const errorText = ref('')

const RELIEF_DEPTH = 0.26
const SEGMENTS = 160

let disposed = false
let loadToken = 0

function roundedRect(width: number, height: number, radius: number) {
  const shape = new Shape()
  const x = -width / 2
  const y = -height / 2
  const r = Math.min(radius, width / 2, height / 2)
  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + r)
  shape.lineTo(x + width, y + height - r)
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  shape.lineTo(x + r, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('参考图读取失败'))
    image.src = src
  })
}

/** 把图片缩到小尺寸后读取像素亮度，作为浮雕高度 */
function sampleLuminance(image: HTMLImageElement) {
  const width = 160
  const height = Math.max(48, Math.round(width * (image.naturalHeight / image.naturalWidth)))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null
  context.drawImage(image, 0, 0, width, height)
  return { data: context.getImageData(0, 0, width, height).data, width, height }
}

function createRelief(image: HTMLImageElement, texture: Texture) {
  const aspect = image.naturalWidth / image.naturalHeight
  const width = 3
  const height = width / aspect
  const segX = SEGMENTS
  const segY = Math.max(56, Math.round(SEGMENTS / aspect))

  const geometry = new PlaneGeometry(width, height, segX, segY)
  const sampling = sampleLuminance(image)

  if (sampling) {
    const positions = geometry.attributes.position
    const uvs = geometry.attributes.uv
    const { data, width: sw, height: sh } = sampling

    for (let i = 0; i < positions.count; i += 1) {
      const u = Math.min(1, Math.max(0, uvs.getX(i)))
      const v = Math.min(1, Math.max(0, uvs.getY(i)))
      const px = Math.min(sw - 1, Math.floor(u * sw))
      const py = Math.min(sh - 1, Math.floor((1 - v) * sh))
      const offset = (py * sw + px) * 4
      const luminance =
        (data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114) / 255
      // 压掉暗部背景，只让主体抬起，避免照片背景形成锯齿状浮雕
      const raw = Math.pow(luminance, 1.2)
      const t = Math.min(1, Math.max(0, (raw - 0.22) / 0.5))
      const eased = t * t * (3 - 2 * t)
      positions.setZ(i, eased * RELIEF_DEPTH)
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()
  }

  const relief = new Mesh(
    geometry,
    new MeshPhysicalMaterial({
      map: texture,
      roughness: 0.58,
      metalness: 0.03,
      clearcoat: 0.12,
      clearcoatRoughness: 0.62,
    }),
  )

  const plateShape = roundedRect(width + 0.16, height + 0.16, 0.14)
  const plateGeometry = new ExtrudeGeometry(plateShape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 8,
  })
  const plate = new Mesh(
    plateGeometry,
    new MeshPhysicalMaterial({
      color: 0x222227,
      roughness: 0.52,
      metalness: 0.18,
      clearcoat: 0.18,
      clearcoatRoughness: 0.6,
    }),
  )
  plate.position.z = -0.16

  const group = new Group()
  group.add(plate)
  group.add(relief)
  group.rotation.y = -0.08
  return group
}

/** 舞台挂载失败时手动回收几何体/材质/纹理，避免泄漏 */
function disposeRelief(object: Group, texture: Texture) {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return
    child.geometry.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => material.dispose())
  })
  texture.dispose()
}

async function build(src: string) {
  const token = Number(++loadToken)
  stage.value?.clearObject()
  phase.value = 'loading'
  errorText.value = ''

  try {
    const image = await loadImage(src)
    if (disposed || token !== loadToken) return

    const texture = new Texture(image)
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true

    const object = createRelief(image, texture)
    if (!stage.value?.setObject(object)) {
      disposeRelief(object, texture)
      throw new Error('3D 舞台未就绪')
    }

    phase.value = 'ready'
    emit('ready')
  } catch (error) {
    if (disposed || token !== loadToken) return
    phase.value = 'error'
    errorText.value = error instanceof Error ? error.message : '3D 模型生成失败'
    emit('error', errorText.value)
  }
}

function handleStageError(message: string) {
  phase.value = 'error'
  errorText.value = message
  emit('error', message)
}

onMounted(() => {
  if (props.src) void build(props.src)
})

watch(
  () => props.src,
  (src) => {
    if (src) {
      void build(src)
    } else {
      loadToken += 1
      stage.value?.clearObject()
      phase.value = 'loading'
      errorText.value = ''
    }
  },
)

onBeforeUnmount(() => {
  disposed = true
  loadToken += 1
})
</script>

<template>
  <div class="relief-preview" :class="`is-${phase}`">
    <ThreeStage ref="stage" :fit-padding="1.28" @error="handleStageError" />

    <div v-if="phase === 'loading'" class="relief-preview__state">
      <span class="relief-preview__spinner" aria-hidden="true"></span>
      <span>模型初始化中…</span>
    </div>

    <div v-else-if="phase === 'error'" class="relief-preview__state is-error">
      {{ errorText }}
    </div>

    <span v-if="phase === 'ready'" class="relief-preview__hint">拖拽旋转 · 滚轮缩放</span>
  </div>
</template>

<style scoped>
.relief-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 50% 18%, #1e2430 0%, #101116 58%, #0a0a0d 100%);
  cursor: grab;
}

.relief-preview:active {
  cursor: grabbing;
}

.relief-preview__state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  letter-spacing: 0.04em;
  pointer-events: none;
}

.relief-preview__state.is-error {
  max-width: 80%;
  margin: 0 auto;
  color: rgba(255, 160, 120, 0.85);
  text-align: center;
}

.relief-preview__spinner {
  width: 22px;
  height: 22px;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: relief-spin 0.8s linear infinite;
}

@keyframes relief-spin {
  to {
    transform: rotate(360deg);
  }
}

.relief-preview__hint {
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
