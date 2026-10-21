import apiClient from './client.js'

export const authApi = {
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials)
  },
  logout: async () => {
    return apiClient.get('/auth/logout')
  },
  getCurrentUser: async () => {
    return apiClient.get('/users/current-user')
  },
}

export default authApi
