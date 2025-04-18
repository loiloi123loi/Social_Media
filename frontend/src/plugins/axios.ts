import type { IAuthResponse } from '@/api/auth'
import { USER_REFRESH_TOKEN } from '@/constants/api'
import router from '@/router'
import type { IApiErrorResponse, IApiResponse } from '@/types/api'
import type {
  AxiosError,
  InternalAxiosRequestConfig as BaseInternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'

interface InternalAxiosRequestConfig extends BaseInternalAxiosRequestConfig {
  _retry?: boolean
}

interface QueueItem {
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

const refreshTokenAndRetry = async (failedRequest: InternalAxiosRequestConfig) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    const { data } = await http.post<IApiResponse<IAuthResponse>>(USER_REFRESH_TOKEN, {
      refreshToken,
    })

    const { accessToken } = data.data!
    localStorage.setItem('accessToken', accessToken)

    failedRequest.headers.Authorization = `Bearer ${accessToken}`
    return http(failedRequest)
  } catch (error) {
    localStorage.clear()
    router.push({ name: 'Login' })
    return Promise.reject(error)
  }
}

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<IApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => http(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      return refreshTokenAndRetry(originalRequest)
        .then((response) => {
          processQueue()
          return response
        })
        .catch((error) => {
          processQueue(error)
          return Promise.reject(error)
        })
        .finally(() => {
          isRefreshing = false
        })
    }

    return Promise.reject(error)
  },
)

export type { IApiErrorResponse, IApiResponse }
export default http
