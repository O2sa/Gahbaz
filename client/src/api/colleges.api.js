import apiClient from './client.js'

export const collegesApi = {
  getColleges: async (params = {}) => {
    return apiClient.get('/colleges', { params })
  },
  getCollegeById: async (id) => {
    return apiClient.get(`/colleges/${id}`)
  },
  createCollege: async (data) => {
    return apiClient.post('/colleges', data)
  },
  updateCollege: async (id, data) => {
    return apiClient.patch(`/colleges/${id}`, data)
  },
  deleteCollege: async (id) => {
    return apiClient.delete(`/colleges/${id}`)
  },
}

export default collegesApi
