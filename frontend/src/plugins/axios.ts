import { USER_REFRESH_TOKEN } from '@/constants/api'
import router from '@/router'
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await http.post(USER_REFRESH_TOKEN, { refreshToken })
        const { accessToken } = response.data

        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return http(originalRequest)
      } catch (error) {
        localStorage.clear()
        router.push({ name: 'Login' })
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default http
