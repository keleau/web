/** 参考图上传域类型：组件、页面、接口层共用 */

export type UploadStatus = 'local' | 'uploading' | 'done' | 'error'

/**
 * 参考图条目。
 * - previewUrl 是本地 ObjectURL，由上传组件负责回收
 * - referenceId 是后端返回的文件 ID，用于建模任务与下单
 */
export interface ReferenceFile {
  /** 前端唯一标识，避免同名文件 key 冲突 */
  uid: string
  file: File
  previewUrl: string
  status: UploadStatus
  progress: number
  referenceId?: string
  remoteUrl?: string
  errorMessage?: string
}

export type ReferenceUploader = (
  file: File,
  onProgress?: (percent: number) => void,
) => Promise<{ id: string; url: string }>
