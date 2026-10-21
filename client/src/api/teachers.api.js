import apiClient from './client.js'

export const teachersApi = {
  getTeachers: async (params = {}) => {
    return apiClient.get('/teachers', { params })
  },
  getTeacherById: async (id) => {
    return apiClient.get(`/teachers/${id}`)
  },
  createTeacher: async (data) => {
    return apiClient.post('/teachers', data)
  },
  updateTeacher: async (id, data) => {
    return apiClient.patch(`/teachers/${id}`, data)
  },
  deleteTeacher: async (id) => {
    return apiClient.delete(`/teachers/${id}`)
  },
}

export default teachersApi
