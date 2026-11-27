/**
 * 建模任务轮询：把「创建任务 → 轮询状态 → 成功/失败/取消」收敛成一套逻辑。
 * 页面只关心 phase / progress / modelUrl，不再手写 setInterval。
 */
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import {
  cancelModelingTask,
  createModelingTask,
  getModelingTask,
  type CreateModelingTaskPayload,
  type ModelingStatus,
  type ModelingTask,
} from '@/api/custom'
import { ApiError } from '@/api/error'

export type ModelingPhase = 'idle' | ModelingStatus

interface UseModelingTaskOptions {
    /** 轮询间隔（毫秒） */
  interval?: number
  /** 最长等待时间，超时判定失败 */
  maxWait?: number
  onError?: (message: string) => void
}

export function useModelingTask(options: UseModelingTaskOptions = {}) {
  const interval = options.interval ?? 1200
  const maxWait = options.maxWait ?? 10 * 60 * 1000

  const phase = ref<ModelingPhase>('idle')
  const progress = ref(0)
  const task = shallowRef<ModelingTask | null>(null)
  const errorMessage = ref('')

  const modelUrl = computed(() => task.value?.modelUrl ?? '')
  const previewUrl = computed(() => task.value?.previewUrl ?? '')
  const isBusy = computed(() => phase.value === 'queued' || phase.value === 'processing')

  let timer: number | undefined
  let requestToken = 0
  let startedAt = 0
  let disposed = false
  let lastPayload: CreateModelingTaskPayload | null = null

  function clearTimer() {
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timer = undefined
    }
  }

  function resetState() {
    phase.value = 'idle'
    progress.value = 0
    task.value = null
    errorMessage.value = ''
  }

  function applyTask(next: ModelingTask) {
    task.value = next
    phase.value = next.status
    progress.value = Math.min(100, Math.max(0, Math.round(next.progress)))
    if (next.status === 'failed') {
      errorMessage.value = next.errorMessage || '建模失败，请稍后重试'
      options.onError?.(errorMessage.value)
    }
    if (next.status === 'succeeded') {
      progress.value = 100
      errorMessage.value = ''
    }
  }

  function fail(error: unknown) {
    phase.value = 'failed'
    errorMessage.value = error instanceof ApiError ? error.message : '建模失败，请稍后重试'
    options.onError?.(errorMessage.value)
  }

  function schedule() {
    clearTimer()
    timer = window.setTimeout(() => void poll(), interval)
  }

  async function poll() {
    const current = task.value
    if (!current) return
    const token = requestToken

    if (Date.now() - startedAt > maxWait) {
      fail(new ApiError('建模超时，请重新上传后重试', -1))
      return
    }

    try {
      const next = await getModelingTask(current.taskId)
      if (disposed || token !== requestToken) return
      applyTask(next)
      if (next.status === 'queued' || next.status === 'processing') schedule()
    } catch (error) {
      if (disposed || token !== requestToken) return
      fail(error)
    }
  }

  /** 开始（或重启）一次建模任务 */
  async function start(payload: CreateModelingTaskPayload) {
    // 旧任务还在跑时先通知后端释放算力，避免切换参考图后留下孤儿任务
    const previousTaskId = isBusy.value ? task.value?.taskId : undefined
    if (previousTaskId) {
      void cancelModelingTask(previousTaskId).catch(() => {})
    }

    const token = ++requestToken
    clearTimer()
    lastPayload = payload
    resetState()
    phase.value = 'queued'
    startedAt = Date.now()

    try {
      const created = await createModelingTask(payload)
      if (disposed || token !== requestToken) return

      applyTask(created)
      if (created.status === 'queued' || created.status === 'processing') {
        schedule()
      }
    } catch (error) {
      if (disposed || token !== requestToken) return
      fail(error)
    }
  }

  /** 用上一次参数重试 */
  async function retry() {
    if (!lastPayload) return
    await start(lastPayload)
  }

  /** 前端取消：停止轮询并通知后端释放任务 */
  function cancel() {
    requestToken += 1
    clearTimer()
    const taskId = isBusy.value ? task.value?.taskId : undefined
    resetState()
    if (taskId) {
      void cancelModelingTask(taskId).catch(() => {
        // 取消失败不影响前端状态
      })
    }
  }

  onBeforeUnmount(() => {
    disposed = true
    requestToken += 1
    clearTimer()
    const taskId = isBusy.value ? task.value?.taskId : undefined
    if (taskId) {
      void cancelModelingTask(taskId).catch(() => {})
    }
  })

  return {
    phase,
    progress,
    task,
    errorMessage,
    modelUrl,
    previewUrl,
    isBusy,
    start,
    retry,
    cancel,
  }
}
