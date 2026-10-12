import axios from 'axios'
import { notifications } from '@mantine/notifications'

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error?.response?.status
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      'حدث خطأ غير متوقع'

    if (status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      notifications.show({
        id: 'forbidden-error',
        color: 'red',
        title: 'غير مصرح',
        message: 'ليس لديك الصلاحية لتنفيذ هذا الإجراء',
        autoClose: 4000,
      })
    } else if (status >= 400) {
      notifications.show({
        id: 'api-error',
        color: 'red',
        title: 'خطأ',
        message: message,
        autoClose: 5000,
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient
