<script setup lang="ts">
/**
 * ThreeStage —— 通用 three.js 渲染舞台
 *
 * 只负责渲染内核：renderer / scene / camera / IBL 环境 / 轨道控制 /
 * 尺寸自适应 / 可见性调度 / 资源释放。
 * 业务组件负责准备 Object3D，通过 setObject() 交给舞台渲染。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ACESFilmicToneMapping,
  Box3,
  DirectionalLight,
  Material,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const props = withDefaults(
  defineProps<{
    /** 相机垂直视角 */
    fov?: number
    /** 色调映射曝光 */
    exposure?: number
    /** 相机适配留白系数：越小主体越大 */
    fitPadding?: number
  }>(),
  { fov: 35, exposure: 1.05, fitPadding: 1.55 },
)

const emit = defineEmits<{
  (e: 'error', message: string): void
}>()

const host = ref<HTMLDivElement | null>(null)

let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let envTexture: Texture | null = null
let currentObject: Object3D | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let playing = false
let onScreen = true
let disposed = false

/* ---------------- 资源释放 ---------------- */

function disposeMaterial(material: Material) {
  for (const value of Object.values(material)) {
    if (value && (value as Texture).isTexture) {
      ;(value as Texture).dispose()
    }
  }
  material.dispose()
}

function disposeObject(object: Object3D) {
  object.traverse((child) => {
    const mesh = child as Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const material = mesh.material as Material | Material[] | undefined
    if (Array.isArray(material)) material.forEach(disposeMaterial)
    else if (material) disposeMaterial(material)
  })
}

/* ---------------- 相机适配 ---------------- */

function fitCamera(object: Object3D) {
  if (!camera || !controls) return
  const box = new Box3().setFromObject(object)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const fov = (camera.fov * Math.PI) / 180
  const distance = ((maxDim / 2) / Math.tan(fov / 2)) * props.fitPadding

  camera.position.set(center.x + distance * 0.28, center.y + distance * 0.2, center.z + distance)
  camera.near = distance / 100
  camera.far = distance * 12
  camera.updateProjectionMatrix()

  controls.target.copy(center)
  controls.minDistance = distance * 0.55
  controls.maxDistance = distance * 2.2
  controls.update()
}

/* ---------------- 渲染调度 ---------------- */

function resize() {
  if (disposed) return
  const el = host.value
  if (!el || !renderer || !camera) return
  const width = el.clientWidth || 1
  const height = el.clientHeight || 1
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}

function startLoop() {
  if (!renderer || playing || disposed) return
  playing = true
  renderer.setAnimationLoop(() => {
    controls?.update()
    if (renderer && scene && camera) renderer.render(scene, camera)
  })
}

function stopLoop() {
  if (!renderer || !playing) return
  playing = false
  renderer.setAnimationLoop(null)
}

/** 只有「在视口内 + 页面可见」时才渲染，避免两个暂停信号互相覆盖 */
function syncLoop() {
  if (disposed || !renderer) return
  if (onScreen && !document.hidden) startLoop()
  else stopLoop()
}

function onVisibilityChange() {
  syncLoop()
}

/* ---------------- 对外 API ---------------- */

/** 挂载（替换）要展示的模型；返回是否挂载成功 */
function setObject(object: Object3D): boolean {
  if (!scene || disposed) return false
  if (currentObject) {
    scene.remove(currentObject)
    disposeObject(currentObject)
  }
  currentObject = object
  scene.add(object)
  fitCamera(object)
  return true
}

/** 清空当前模型 */
function clearObject() {
  if (!scene || !currentObject) return
  scene.remove(currentObject)
  disposeObject(currentObject)
  currentObject = null
}

defineExpose({ setObject, clearObject })

watch(
  () => props.exposure,
  (value) => {
    if (renderer) renderer.toneMappingExposure = value
  },
)

watch(
  () => props.fitPadding,
  () => {
    if (currentObject) fitCamera(currentObject)
  },
)

/* ---------------- 生命周期 ---------------- */

function setup(): boolean {
  const el = host.value
  if (!el) return false

  try {
    renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch {
    return false
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = props.exposure
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  el.appendChild(renderer.domElement)

  scene = new Scene()

  // 用 RoomEnvironment 生成 IBL，材质质感接近棚拍效果
  const pmrem = new PMREMGenerator(renderer)
  envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture
  pmrem.dispose()

  // 补一盏主光，压出金属高光
  const keyLight = new DirectionalLight(0xffffff, 1.6)
  keyLight.position.set(4, 6, 6)
  scene.add(keyLight)

  camera = new PerspectiveCamera(props.fov, 1, 0.1, 100)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.rotateSpeed = 0.7
  controls.zoomSpeed = 0.8

  resize()
  return true
}

onMounted(() => {
  const el = host.value
  if (!setup()) {
    emit('error', '当前浏览器不支持 WebGL')
    return
  }

  syncLoop()

  if (el) {
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(el)

    // 移出视口就暂停渲染
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onScreen = entry.isIntersecting
          syncLoop()
        })
      },
      { threshold: 0.05 },
    )
    intersectionObserver.observe(el)
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  disposed = true
  document.removeEventListener('visibilitychange', onVisibilityChange)
  resizeObserver?.disconnect()
  resizeObserver = null
  intersectionObserver?.disconnect()
  intersectionObserver = null

  stopLoop()
  controls?.dispose()
  controls = null

  if (currentObject) {
    disposeObject(currentObject)
    currentObject = null
  }

  envTexture?.dispose()
  envTexture = null

  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss?.()
    renderer.domElement.remove()
    renderer = null
  }

  scene = null
  camera = null
})
</script>

<template>
  <div ref="host" class="three-stage"></div>
</template>

<style scoped>
.three-stage {
  position: absolute;
  inset: 0;
}
</style>
