import apiClient from './client.js'

export const getUniversities = async (params = {}) => {
  return apiClient.get('/universities', { params })
}

export const getUniversity = async (id) => {
  return apiClient.get(`/universities/${id}`)
}

export const getMyUniversity = async () => {
  return apiClient.get('/universities/my-university')
}

export const createUniversity = async (payload) => {
  return apiClient.post('/universities', payload)
}

export const updateUniversity = async (id, payload) => {
  return apiClient.patch(`/universities/${id}`, payload)
}

export const updateMyUniversity = async (payload) => {
  return apiClient.patch('/universities/my-university', payload)
}

export const toggleUniversityStatus = async (id, active) => {
  return apiClient.patch(`/universities/${id}`, { active })
}

export const universitiesApi = {
  getUniversities,
  getUniversity,
  getMyUniversity,
  createUniversity,
  updateUniversity,
  updateMyUniversity,
  toggleUniversityStatus,
}

export default universitiesApi
