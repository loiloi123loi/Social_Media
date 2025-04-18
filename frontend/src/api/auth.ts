import { USER_LOGIN, USER_REGISTER } from '@/constants/api'
import http from '@/plugins/axios'
import type { IApiResponse } from '@/types/api'

export interface ILoginRequestData {
  email: string
  password: string
}

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
}

export interface IRegisterRequestData extends ILoginRequestData {
  name: string
  confirmPassword: string
}

export const authApi = {
  login: (data: ILoginRequestData) => {
    return http.post<IApiResponse<IAuthResponse>>(USER_LOGIN, data)
  },

  register: (data: IRegisterRequestData) => {
    return http.post<IApiResponse<IAuthResponse>>(USER_REGISTER, data)
  },
}
