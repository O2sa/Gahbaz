/**
 * Centralized Environment & URL Configuration
 * Single source of truth for Backend Host, API Base URL, and WebSocket URL (DRY principle).
 */

/**
 * Resolves the backend server root URL (e.g. "http://localhost:5000" or "https://api.yourdomain.com").
 * Evaluates runtime config, Vite build-time environment variables, and local environment fallbacks.
 */
export const getBackendHost = () => {
  const runtimeConfig = typeof window !== 'undefined' ? (window.__GAHBAZ_CONFIG__ || window.__ENV__) : null

  const envUrl =
    runtimeConfig?.VITE_BACKEND_URL ||
    runtimeConfig?.BACKEND_URL ||
    runtimeConfig?.VITE_API_URL ||
    runtimeConfig?.API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_URL

  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
  }

  // Localhost fallback: when running on local machine, automatically route to backend port 5000
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0'
    if (isLocalhost && window.location.port !== '5000') {
      return `${window.location.protocol}//${window.location.hostname}:5000`
    }
    return window.location.origin
  }

  return 'http://localhost:5000'
}

/**
 * Resolves the REST API Base URL (e.g. "http://localhost:5000/api/v1" or "/api/v1").
 */
export const getBaseUrl = () => {
  const runtimeConfig = typeof window !== 'undefined' ? (window.__GAHBAZ_CONFIG__ || window.__ENV__) : null
  const customApiUrl = runtimeConfig?.VITE_API_URL || runtimeConfig?.API_URL || import.meta.env.VITE_API_URL

  if (customApiUrl && typeof customApiUrl === 'string' && customApiUrl.trim().length > 0) {
    const clean = customApiUrl.trim().replace(/\/+$/, '')
    return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`
  }

  const host = getBackendHost()
  if (typeof window !== 'undefined' && host === window.location.origin) {
    return '/api/v1'
  }
  return `${host}/api/v1`
}

/**
 * Resolves the WebSocket / Socket.IO server URL.
 */
export const getSocketUrl = () => {
  const runtimeConfig = typeof window !== 'undefined' ? (window.__GAHBAZ_CONFIG__ || window.__ENV__) : null
  const socketUrl = runtimeConfig?.VITE_SOCKET_URL || runtimeConfig?.SOCKET_URL || import.meta.env.VITE_SOCKET_URL

  if (socketUrl && typeof socketUrl === 'string' && socketUrl.trim().length > 0) {
    return socketUrl.trim().replace(/\/+$/, '')
  }

  return getBackendHost()
}
