import apiClient from './client.js'

export const subjectsApi = {
  getSubjects: async (params = {}) => {
    return apiClient.get('/subjects', { params })
  },
  getSubjectById: async (id) => {
    return apiClient.get(`/subjects/${id}`)
  },
  createSubject: async (data) => {
    return apiClient.post('/subjects', data)
  },
  updateSubject: async (id, data) => {
    return apiClient.patch(`/subjects/${id}`, data)
  },
  deleteSubject: async (id) => {
    return apiClient.delete(`/subjects/${id}`)
  },
}

export default subjectsApi
