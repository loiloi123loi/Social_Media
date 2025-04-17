import { USER_LOGIN, USER_REGISTER } from '@/constants/api'
import http from '@/plugins/axios'

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

export interface IRegisterRequestData extends ILoginRequestData {
  name: string
  confirmPassword: string
}

export const authApi = {
  login: (data: ILoginRequestData) => {
    return http.post<IAuthResponse>(USER_LOGIN, data)
  },

  register: (data: IRegisterRequestData) => {
    return http.post<IAuthResponse>(USER_REGISTER, data)
  },
}
