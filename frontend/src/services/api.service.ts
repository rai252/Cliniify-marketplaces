import axios from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL } from '@/lib/utils'

export abstract class APIService {
  protected baseURL: string
  protected headers: any = {}

  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost:8000'
  }

  setRefreshToken(token: string) {
    Cookies.set('refreshToken', token, { expires: 30 })
  }

  getRefreshToken() {
    return Cookies.get('refreshToken')
  }

  purgeRefreshToken() {
    Cookies.remove('refreshToken', { path: '/' })
  }

  setAccessToken(token: string) {
    Cookies.set('accessToken', token, { expires: 30 })
  }

  getAccessToken() {
    return Cookies.get('accessToken')
  }

  purgeAccessToken() {
    Cookies.remove('accessToken', { path: '/' })
  }

  getHeaders(config: any) {
    const headers: any = config?.headers || {}
    if (this.getAccessToken()) {
      headers['Authorization'] = `Bearer ${this.getAccessToken()}`
    }

    return headers
  }

  get(url: string, config = {}): Promise<any> {
    return axios({
      method: 'get',
      url: this.baseURL + url,
      headers: this.getHeaders(config),
      ...config,
    })
  }

  post(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: 'post',
      url: this.baseURL + url,
      data,
      headers: this.getHeaders(config),
      ...config,
    })
  }

  put(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: 'put',
      url: this.baseURL + url,
      data,
      headers: this.getHeaders(config),
      ...config,
    })
  }

  patch(url: string, data = {}, config = {}): Promise<any> {
    return axios({
      method: 'patch',
      url: this.baseURL + url,
      data,
      headers: this.getHeaders(config),
      ...config,
    })
  }

  delete(url: string, data?: any, config = {}): Promise<any> {
    return axios({
      method: 'delete',
      url: this.baseURL + url,
      data: data,
      headers: this.getHeaders(config),
      ...config,
    })
  }

  request(config = {}) {
    return axios(config)
  }
}
