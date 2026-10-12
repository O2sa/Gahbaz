import apiClient from './client.js'

export const adminsApi = {
  getAdmins: async (params = {}) => {
    return apiClient.get('/admins', { params })
  },
  getAdminById: async (id) => {
    return apiClient.get(`/admins/${id}`)
  },
  createAdmin: async (data) => {
    return apiClient.post('/admins', data)
  },
  updateAdmin: async (id, data) => {
    return apiClient.patch(`/admins/${id}`, data)
  },
  deleteAdmin: async (id) => {
    return apiClient.delete(`/admins/${id}`)
  },
}

export default adminsApi
