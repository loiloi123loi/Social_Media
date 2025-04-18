import type { IAuthResponse, ILoginRequestData, IRegisterRequestData } from '@/api/auth'
import { authApi } from '@/api/auth'
import type { IApiErrorResponse } from '@/types/api'
import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface AuthResult {
  isSuccess: boolean
  message?: string
  errors?: Record<string, { msg: string }>
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(!!localStorage.getItem('accessToken'))

  const addToken = (data: IAuthResponse) => {
    const { accessToken, refreshToken } = data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    isAuthenticated.value = true
  }

  const login = async (data: ILoginRequestData): Promise<AuthResult> => {
    try {
      const response = await authApi.login(data)
      addToken(response.data.data!)
      return {
        isSuccess: true,
        message: response.data.message,
      }
    } catch (error) {
      const apiError = error as AxiosError<IApiErrorResponse>
      return {
        isSuccess: false,
        message: apiError.response?.data.message,
        errors: apiError.response?.data.errorInfo,
      }
    }
  }

  const register = async (data: IRegisterRequestData): Promise<AuthResult> => {
    try {
      const response = await authApi.register(data)
      addToken(response.data.data!)
      return {
        isSuccess: true,
        message: response.data.message,
      }
    } catch (error) {
      const apiError = error as AxiosError<IApiErrorResponse>
      return {
        isSuccess: false,
        message: apiError.response?.data.message,
        errors: apiError.response?.data.errorInfo,
      }
    }
  }

  const logout = () => {
    localStorage.clear()
    isAuthenticated.value = false
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
