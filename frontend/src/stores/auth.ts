import {
  authApi,
  type IAuthResponse,
  type ILoginRequestData,
  type IRegisterRequestData,
} from '@/api/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(!!localStorage.getItem('accessToken'))

  const addToken = (data: IAuthResponse) => {
    const { accessToken, refreshToken } = data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    isAuthenticated.value = true
  }

  const login = async (data: ILoginRequestData) => {
    try {
      const response = await authApi.login(data)
      addToken(response.data)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: IRegisterRequestData) => {
    try {
      const response = await authApi.register(data)
      addToken(response.data)
    } catch (error) {
      throw error
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
