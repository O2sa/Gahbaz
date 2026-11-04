import axios from 'axios'
import { notifications } from '@mantine/notifications'
import i18n from '../i18n'

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

// Attach Bearer token and Accept-Language header from localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const activeUnivId = localStorage.getItem('gahbaz_active_university_id')
    if (activeUnivId && activeUnivId.trim() !== '') {
      config.headers['x-university-id'] = activeUnivId.trim()
    }

    const activeLanguage = localStorage.getItem('gahbaz-language') || 'ar'
    config.headers['Accept-Language'] = activeLanguage
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error?.response?.status
    const errorCode = error?.response?.data?.error?.code || error?.response?.data?.code

    let localizedMessage = ''
    if (errorCode && i18n.exists(`errors.codes.${errorCode}`)) {
      localizedMessage = i18n.t(`errors.codes.${errorCode}`)
    } else if (status === 401) {
      localizedMessage = i18n.t('errors.unauthorized')
    } else if (status === 403) {
      localizedMessage = i18n.t('errors.forbidden')
    } else if (status === 404) {
      localizedMessage = i18n.t('errors.notFound')
    } else {
      localizedMessage =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.response?.data?.error?.message ||
        i18n.t('errors.generic')
    }

    error.localizedMessage = localizedMessage

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
        title: i18n.t('errors.titles.forbidden'),
        message: localizedMessage,
        autoClose: 4000,
      })
    } else if (status >= 400 && !error?.config?.skipErrorNotification) {
      notifications.show({
        id: 'api-error',
        color: 'red',
        title: i18n.t('errors.titles.error'),
        message: localizedMessage,
        autoClose: 5000,
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient
