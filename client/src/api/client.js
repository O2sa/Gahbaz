import axios from 'axios'
import { notifications } from '@mantine/notifications'

export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const clean = envUrl.trim().replace(/\/+$/, '')
    return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`
  }
  return '/api/v1'
}

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token from localStorage for cross-domain requests (Netlify -> Render)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
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
      error?.response?.data?.error?.message ||
      'حدث خطأ غير متوقع'

    const publicPaths = ['/', '/landing', '/login', '/register', '/404', '/500']
    const isPublicPath = typeof window !== 'undefined' && publicPaths.includes(window.location.pathname)

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        if (!isPublicPath && !error?.config?.skipAuthRedirect) {
          window.location.href = '/login'
        }
      }
    } else if (status === 403) {
      notifications.show({
        id: 'forbidden-error',
        color: 'red',
        title: 'غير مصرح',
        message: 'ليس لديك الصلاحية لتنفيذ هذا الإجراء',
        autoClose: 4000,
      })
    } else if (status >= 400 && !error?.config?.skipErrorNotification) {
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
