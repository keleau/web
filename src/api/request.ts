import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 统一的 axios 实例，baseURL 可通过 .env 文件配置
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 请求拦截器：自动携带 token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理错误提示
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  },
)

export function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  // 响应拦截器已解包 response.data，此处做类型断言
  return service.request(config) as Promise<T>
}

export default service
