import axios from 'axios'



const API_BASE_URL = 'http://localhost:3001/api'; // Replace with your API base URL

// CRUD Operations for Semesters
const getAllSemesters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/semesters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};

const getSemesterById = async (semesterId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/semesters/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching semester with id ${semesterId}:`, error);
    throw error;
  }
};

const createSemester = async (newSemester) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/semesters`, newSemester);
    return response.data;
  } catch (error) {
    console.error('Error creating semester:', error);
    throw error;
  }
};

const updateSemester = async (semesterId, updatedSemester) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/semesters/${semesterId}`, updatedSemester);
    return response.data;
  } catch (error) {
    console.error(`Error updating semester with id ${semesterId}:`, error);
    throw error;
  }
};

const deleteSemester = async (semesterId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/semesters/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting semester with id ${semesterId}:`, error);
    throw error;
  }
};

// Example usage
(async () => {
  try {
    // Create a new semester
    const newSemester = {
      title: 'Spring 2023',
      // ... other properties
    };
    const createdSemester = await createSemester(newSemester);
    console.log('Created Semester:', createdSemester);

    // Get all semesters
    const allSemesters = await getAllSemesters();
    console.log('All Semesters:', allSemesters);

    // Update a semester
    const semesterIdToUpdate = '1'; // Replace with an existing semester id
    const updatedSemester = {
      // Updated properties
    };
    const updatedSemesterResult = await updateSemester(semesterIdToUpdate, updatedSemester);
    console.log('Updated Semester:', updatedSemesterResult);

    // Get a specific semester by id
    const semesterIdToGet = '1'; // Replace with an existing semester id
    const specificSemester = await getSemesterById(semesterIdToGet);
    console.log('Specific Semester:', specificSemester);

    // Delete a semester
    const semesterIdToDelete = '1'; // Replace with an existing semester id
    const deletedSemesterResult = await deleteSemester(semesterIdToDelete);
    console.log('Deleted Semester Result:', deletedSemesterResult);
  } catch (error) {
    console.error('Error:', error);
  }
})();



