// // apiWrapper.js
// import * as api from './apis.mjs'

// const createSemester = async (data) => api.createItem('semesters', data)
// const getSemesters = async () => api.getItems('semesters')
// const getSemesterById = async (id) => api.getItemById('semesters', id)
// const updateSemester = async (id, data) => api.updateItem('semesters', id, data)
// const deleteSemester = async (id) => api.deleteItem('semesters', id)

// const createCollage = async (data) => api.createItem('collages', data)
// const getCollages = async () => api.getItems('collages')
// const getCollageById = async (id) => api.getItemById('collages', id)
// const updateCollage = async (id, data) => api.updateItem('collages', id, data)
// const deleteCollage = async (id) => api.deleteItem('collages', id)

// const createCourse = async (data) => api.createItem('courses', data)
// const getCourses = async () => api.getItems('courses')
// const getCourseById = async (id) => api.getItemById('courses', id)
// const updateCourse = async (id, data) => api.updateItem('courses', id, data)
// const deleteCourse = async (id) => api.deleteItem('courses', id)

// const createSubject = async (data) => api.createItem('subjects', data)
// const getSubjects = async () => api.getItems('subjects')
// const getSubjectById = async (id) => api.getItemById('subjects', id)
// const updateSubject = async (id, data) => api.updateItem('subjects', id, data)
// const deleteSubject = async (id) => api.deleteItem('subjects', id)

// const createField = async (data) => api.createItem('fields', data)
// const getFields = async () => api.getItems('fields')
// const getFieldById = async (id) => api.getItemById('fields', id)
// const updateField = async (id, data) => api.updateItem('fields', id, data)
// const deleteField = async (id) => api.deleteItem('fields', id)

// const createSemesterTemplate = async (data) => api.createItem('semesterTemplates', data)
// const getSemesterTemplates = async () => api.getItems('semesterTemplates')
// const getSemesterTemplateById = async (id) => api.getItemById('semesterTemplates', id)
// const updateSemesterTemplate = async (id, data) => api.updateItem('semesterTemplates', id, data)
// const deleteSemesterTemplate = async (id) => api.deleteItem('semesterTemplates', id)

// // Repeat the above pattern for other resources (courses, collages, subjects, fields, semesterTemplates)

// export {
//   createSemester,
//   getSemesters,
//   getSemesterById,
//   updateSemester,
//   deleteSemester,
//   createCollage,
//   getCollages,
//   getCollageById,
//   updateCollage,
//   deleteCollage,
//   createCourse,
//   getCourses,
//   getCourseById,
//   updateCourse,
//   deleteCourse,
//   createSubject,
//   getSubjects,
//   getSubjectById,
//   updateSubject,
//   deleteSubject,
//   createField,
//   getFields,
//   getFieldById,
//   updateField,
//   deleteField,
//   createSemesterTemplate,
//   getSemesterTemplates,
//   getSemesterTemplateById,
//   updateSemesterTemplate,
//   deleteSemesterTemplate,
  
//   // ... Repeat for other resources
// }



// // apiWrapper.js
import * as api from './apis.mjs';

const createAsyncCrudFunctions = (resource) => ({
  create: async (data) => api.createItem(resource, data),
  getAll: async () => api.getItems(resource),
  getById: async (id) => api.getItemById(resource, id),
  update: async (id, data) => api.updateItem(resource, id, data),
  delete: async (id) => api.deleteItem(resource, id),
});

const semestersApi = createAsyncCrudFunctions('semester');
const collagesApi = createAsyncCrudFunctions('collage');
const coursesApi = createAsyncCrudFunctions('course');
const subjectsApi = createAsyncCrudFunctions('subject');
const fieldsApi = createAsyncCrudFunctions('field');
const semesterTemplatesApi = createAsyncCrudFunctions('semesterTemplate');

export {
  semestersApi,
  collagesApi,
  coursesApi,
  subjectsApi,
  fieldsApi,
  semesterTemplatesApi,
};
