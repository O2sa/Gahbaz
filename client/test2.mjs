// // js
// import axios from 'axios';

// const BASE_URL = '/api';

// const createItem = async (resource, data) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/${resource}s`, data);
//     return response.data;
//   } catch (error) {
//     console.error(`Error creating item ${resource}:`, error);
//     throw error; // Re-throw the error to propagate it to the caller
//   }
// };

// const getItems = async (resource) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/${resource}s`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error getting items ${resource}:`, error);
//     throw error;
//   }
// };

// const getItemById = async (resource, id) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/${resource}s/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error getting item with id ${id}:`, error);
//     throw error;
//   }
// };

// const updateItem = async (resource, id, data) => {
//   try {
//     const response = await axios.put(`${BASE_URL}/${resource}s/${id}`, data);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating item with id ${id}:`, error);
//     throw error;
//   }
// };

// const deleteItem = async (resource, id) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/${resource}s/${id}`);
//     return id;
//   } catch (error) {
//     console.error(`Error deleting item with id ${id}:`, error);
//     throw error;
//   }
// };

// export { createItem, getItems, getItemById, updateItem, deleteItem };

// // apiWrapper.js
// // import * as api from './api';

// const createAsyncCrudFunctions = (resource) => ({
//   create: async (data) => createItem(resource, data),
//   getAll: async () => getItems(resource),
//   getById: async (id) => getItemById(resource, id),
//   update: async (id, data) => updateItem(resource, id, data),
//   delete: async (id) => deleteItem(resource, id),
// });

// const semestersApi = createAsyncCrudFunctions('semester');
// const collagesApi = createAsyncCrudFunctions('collage');
// const coursesApi = createAsyncCrudFunctions('course');
// const subjectsApi = createAsyncCrudFunctions('subject');
// const fieldsApi = createAsyncCrudFunctions('field');
// const semesterTemplatesApi = createAsyncCrudFunctions('semesterTemplate');

// export {
//   semestersApi,
//   collagesApi,
//   coursesApi,
//   subjectsApi,
//   fieldsApi,
//   semesterTemplatesApi,
// };
