import apiClient from './client.js'

export const semestersApi = {
  getSemesters: async (params = {}) => {
    return apiClient.get('/semesters', { params })
  },
  getSemesterById: async (id) => {
    return apiClient.get(`/semesters/${id}`)
  },
  createSemester: async (data) => {
    return apiClient.post('/semesters', data)
  },
  updateSemester: async (id, data) => {
    return apiClient.patch(`/semesters/${id}`, data)
  },
  deleteSemester: async (id) => {
    return apiClient.delete(`/semesters/${id}`)
  },
  getTemplates: async (params = {}) => {
    return apiClient.get('/semesters/templates', { params })
  },
  startSemester: async (data) => {
    return apiClient.post('/semesters/startSemester', data)
  },
}

export default semestersApi
