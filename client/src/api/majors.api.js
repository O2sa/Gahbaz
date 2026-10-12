import apiClient from './client.js'

export const majorsApi = {
  getMajors: async (params = {}) => {
    return apiClient.get('/majors', { params })
  },
  getMajorById: async (id) => {
    return apiClient.get(`/majors/${id}`)
  },
  createMajor: async (data) => {
    return apiClient.post('/majors', data)
  },
  updateMajor: async (id, data) => {
    return apiClient.patch(`/majors/${id}`, data)
  },
  deleteMajor: async (id) => {
    return apiClient.delete(`/majors/${id}`)
  },
}

export default majorsApi
