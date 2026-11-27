/**
 * 定制服务接口：参考图上传 → 建模任务 → 提交定制订单。
 *
 * 默认走 mock（VITE_USE_MOCK 未设为 'false' 时开启），便于无后端联调。
 * 接口路径与 docs/03-后端接口与功能文档.md 保持一致。
 */
import { http } from './request'
import { ApiError } from './error'
import { API_ERROR_CODES } from '@/types/api'

export const isMockMode = import.meta.env.VITE_USE_MOCK !== 'false'

export type UploadProgress = (percent: number) => void

export interface UploadedReference {
  id: string
  url: string
}

export interface CustomOrderPayload {
  productId?: string
  note?: string
  /** 已上传参考图的文件 ID（不是本地 File） */
  referenceIds: string[]
  customer: {
    name: string
    phone: string
    address: string
  }
}

export interface CustomOrderResult {
  orderId: string
  orderNo: string
  status: 'pending' | 'confirmed' | 'producing' | 'shipped' | 'completed' | 'cancelled'
}

export type ModelingStatus = 'queued' | 'processing' | 'succeeded' | 'failed'

export interface ModelingTask {
  taskId: string
  status: ModelingStatus
  /** 0–100 */
  progress: number
  /** 成功后的 .glb 地址；mock 模式不返回，前端退回本地浮雕预览 */
  modelUrl?: string
  previewUrl?: string
  errorMessage?: string
}

export interface CreateModelingTaskPayload {
  productId?: string
  referenceIds: string[]
  note?: string
}

/* ---------------- mock 工具 ---------------- */

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

let mockReferenceSeq = 0

interface MockTaskRecord {
  createdAt: number
  duration: number
}

const mockTasks = new Map<string, MockTaskRecord>()

/* ---------------- 参考图上传 ---------------- */

/** 上传单张参考图，返回文件 ID 与可访问地址 */
export async function uploadReferenceImage(
  file: File,
  onProgress?: UploadProgress,
): Promise<UploadedReference> {
  if (isMockMode) {
    onProgress?.(5)
    await wait(260)
    onProgress?.(48)
    await wait(280)
    onProgress?.(86)
    await wait(160)
    onProgress?.(100)
    mockReferenceSeq += 1
    return { id: `mock-ref-${Date.now()}-${mockReferenceSeq}`, url: '' }
  }

  const form = new FormData()
  form.append('file', file)
  return http.upload<UploadedReference>('/uploads/references', form, onProgress)
}

/* ---------------- 建模任务 ---------------- */

/** 创建建模任务：上传完成后调用，返回 taskId 供轮询 */
export async function createModelingTask(
  payload: CreateModelingTaskPayload,
): Promise<ModelingTask> {
  if (!payload.referenceIds.length) {
    throw new ApiError('请先上传至少一张参考图', API_ERROR_CODES.BAD_REQUEST)
  }

  if (isMockMode) {
    await wait(220)
    const taskId = `mock-task-${Date.now()}`
    mockTasks.set(taskId, {
      createdAt: Date.now(),
      // 2.4–3.6s，和后端真实建模耗时保持同一量级，便于调交互
      duration: 2400 + Math.round(Math.random() * 1200),
    })
    return { taskId, status: 'queued', progress: 0 }
  }

  return http.post<ModelingTask>('/custom/model-tasks', payload)
}

/** 查询建模任务状态（建议 1–2s 轮询一次） */
export async function getModelingTask(taskId: string): Promise<ModelingTask> {
  if (isMockMode) {
    const record = mockTasks.get(taskId)
    if (!record) {
      return {
        taskId,
        status: 'failed',
        progress: 0,
        errorMessage: '建模任务不存在或已过期',
      }
    }

    const elapsed = Date.now() - record.createdAt
    const progress = Math.min(96, Math.round((elapsed / record.duration) * 96))

    if (elapsed < 700) {
      return { taskId, status: 'queued', progress: Math.max(0, progress) }
    }
    if (elapsed < record.duration) {
      return { taskId, status: 'processing', progress }
    }
    // mock 不产出真实模型，前端自动退回「本地浮雕预览」
    mockTasks.delete(taskId)
    return { taskId, status: 'succeeded', progress: 100 }
  }

  return http.get<ModelingTask>(`/custom/model-tasks/${encodeURIComponent(taskId)}`)
}

/** 取消建模任务（后端可释放算力；失败不影响前端取消） */
export async function cancelModelingTask(taskId: string): Promise<void> {
  if (isMockMode) {
    mockTasks.delete(taskId)
    return
  }
  await http.delete<void>(`/custom/model-tasks/${encodeURIComponent(taskId)}`, {
    skipErrorMessage: true,
  })
}

/* ---------------- 定制订单 ---------------- */

/** 提交定制需求（参考图上传完成后调用） */
export async function submitCustomOrder(
  payload: CustomOrderPayload,
): Promise<CustomOrderResult> {
  if (isMockMode) {
    await wait(700)
    const stamp = Date.now()
    return {
      orderId: `MOCK-${stamp}`,
      orderNo: `CW${String(stamp).slice(-8)}`,
      status: 'pending',
    }
  }

  return http.post<CustomOrderResult>('/custom/orders', payload)
}
