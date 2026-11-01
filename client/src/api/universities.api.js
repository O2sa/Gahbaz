import apiClient from './client.js'

export const getUniversities = async (params = {}) => {
  return apiClient.get('/universities', { params })
}

export const getUniversity = async (id) => {
  return apiClient.get(`/universities/${id}`)
}

export const createUniversity = async (payload) => {
  return apiClient.post('/universities', payload)
}

export const updateUniversity = async (id, payload) => {
  return apiClient.patch(`/universities/${id}`, payload)
}

export const toggleUniversityStatus = async (id, active) => {
  return apiClient.patch(`/universities/${id}`, { active })
}

export const universitiesApi = {
  getUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  toggleUniversityStatus,
}

export default universitiesApi
