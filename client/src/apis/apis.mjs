// js
import axios from 'axios'

const BASE_URL = '/api'

const createItem = async (resource, data) => {
  try {
    // console.log('create item api', data)

    const response = await axios.post(`${BASE_URL}/${resource}s`, data)
    return response.data
  } catch (error) {
    console.error(`Error creating item ${resource}:`, error)
    throw error // Re-throw the error to propagate it to the caller
  }
}

const getItems = async (resource) => {
  try {
    const response = await axios.get(`${BASE_URL}/${resource}s`)
    return response.data
  } catch (error) {
    console.error(`Error getting items ${resource}:`, error)
    throw error
  }
}

const getItemById = async (resource, id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${resource}s/${id}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(`Error getting item with id ${id}:`, error)
    throw error
  }
}

const updateItem = async (resource, id, data) => {
  try {
    // console.log('update collage api', id)

    const response = await axios.put(`${BASE_URL}/${resource}s/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating item with id ${id}:`, error)
    throw error
  }
}

const deleteItem = async (resource, id) => {
  try {
    console.log('delete item api', id)
    const response = await axios.delete(`${BASE_URL}/${resource}s/${id}`)
    return id
  } catch (error) {
    console.error(`Error deleting item with id ${id}:`, error)
    throw error
  }
}

export { createItem, getItems, getItemById, updateItem, deleteItem }
