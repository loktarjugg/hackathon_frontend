import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'iview'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

service.responseType = 'json'

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(function (response) {
  return response
}, function (error) {
  let response = error.response
  if (response.status === 422) {
    let firstError = ''
    for (let error in response.data.errors) {
      firstError = response.data.errors[error][0]
      break
    }
    Message.error(firstError)
    return Promise.reject(firstError)
  }
  return Promise.reject(response)
})

export default service
