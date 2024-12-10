import { APIService } from '../services/api.service'

import {
  IRegisterResponse,
  IOTPResponse,
  IForgotPassword,
  IForgotPasswordEmailVerify,
  IresetPassword,
  Ilogin,
  IRefreshToken,
  IresendOTP,
} from '../types/auth/auth'

class AuthService extends APIService {
  async register(data: {
    full_name: string
    phone: string
    register_type: 'patient' | 'doctor'
  }): Promise<IRegisterResponse> {
    return this.post('/api/users/register/', data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async resendOTP(data: { email: string }): Promise<IresendOTP> {
    return this.post('/api/users/resend-otp/', data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async verifyOTP(data: {
    email: string
    email_verification_code: string
  }): Promise<IOTPResponse> {
    return this.post('/api/users/verify-email/', data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async forgotPassword(data: { email: string }): Promise<IForgotPassword> {
    return this.post('/api/users/forgot_password/', data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async emailVerifyForgotPassword(data: {
    email: string
    code: string
  }): Promise<IForgotPasswordEmailVerify> {
    return this.post('/api/users/verify_email_for_forgot_password/', data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async resetPassword(data: {
    email: string
    code: string
    password: string
  }): Promise<IresetPassword> {
    return this.post('/api/users/change_password_for_forgot_password/', data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async login(data: {
    phone: string
    otp: string
    login_type: string
  }): Promise<Ilogin> {
    return this.post('/api/users/auth/login/', data)
      .then((response) => {
        this.setAccessToken(response?.data?.access_token)
        this.setRefreshToken(response?.data?.refresh_token)
        return response?.data
      })
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async sendOtp(data: { phone: string }): Promise<Object> {
    return this.post('/api/users/auth/send-otp/', data)
      .then((response) => {
        return response?.data
      })
      .catch((error) => {
        throw error?.response?.data
      })
  }

  async refreshToken(data: { refresh: string }): Promise<IRefreshToken> {
    return this.post('/api/token/refresh/', data)
      .then((response) => {
        this.setAccessToken(response?.data?.access_token)
        return response?.data
      })
      .catch((error) => {
        throw error?.response?.data
      })
  }
}

export const authService = new AuthService()
