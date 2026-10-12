import apiClient from './client.js'

export const studentsApi = {
  getStudents: async (params = {}) => {
    return apiClient.get('/students', { params })
  },
  getStudentById: async (id) => {
    return apiClient.get(`/students/${id}`)
  },
  createStudent: async (data) => {
    return apiClient.post('/students', data)
  },
  updateStudent: async (id, data) => {
    return apiClient.patch(`/students/${id}`, data)
  },
  deleteStudent: async (id) => {
    return apiClient.delete(`/students/${id}`)
  },
}

export default studentsApi
