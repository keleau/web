import { request } from './request'

/**
 * 定制服务相关接口。
 *
 * 后端就绪后把 USE_MOCK 改为 false，并按实际路由调整 url 即可；
 * 页面里的 <ReferenceUploader :uploader="uploadReferenceImage" /> 会自动
 * 在上传时展示进度与结果，无需改动组件内部逻辑。
 */
const USE_MOCK = true

export type UploadProgress = (percent: number) => void

export interface UploadedReference {
  id?: string
  url: string
}

export interface CustomOrderPayload {
  productId?: string
  note?: string
  files: File[]
  /** 收货与联系资料 */
  customer?: {
    name: string
    phone: string
    address: string
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** 上传单张参考图，返回后端可访问的图片地址 */
export async function uploadReferenceImage(
  file: File,
  onProgress?: UploadProgress,
): Promise<UploadedReference> {
  if (USE_MOCK) {
    // 模拟上传，便于在没有后端时预览交互；后端接入后删除这段即可
    onProgress?.(0)
    await wait(450)
    onProgress?.(100)
    return { url: URL.createObjectURL(file) }
  }

  const form = new FormData()
  form.append('file', file)

  return request<UploadedReference>({
    url: '/custom/reference',
    method: 'post',
    data: form,
    timeout: 60000,
    onUploadProgress: (event) => {
      if (!event.total) return
      onProgress?.(Math.round((event.loaded / event.total) * 100))
    },
  })
}

/** 提交定制需求（参考图 + 备注 + 关联作品） */
export async function submitCustomOrder(payload: CustomOrderPayload): Promise<{ orderId: string }> {
  if (USE_MOCK) {
    await wait(700)
    console.info('[custom] 定制需求（模拟提交）', payload)
    return { orderId: `MOCK-${Date.now()}` }
  }

  const form = new FormData()
  if (payload.productId) form.append('productId', payload.productId)
  if (payload.note) form.append('note', payload.note)
  payload.files.forEach((file) => form.append('files', file))
  if (payload.customer) {
    form.append('contactName', payload.customer.name)
    form.append('contactPhone', payload.customer.phone)
    form.append('address', payload.customer.address)
  }

  return request<{ orderId: string }>({
    url: '/custom/orders',
    method: 'post',
    data: form,
    timeout: 60000,
  })
}
