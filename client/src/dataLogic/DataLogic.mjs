const studentData = {
  studentInfo: {
    name: '',
    id: '',
    academicID: '',
    phone: '',
    field: '',
    level: '',
    semester: '',
    status: '',
    email: '',
  },
  semestersGrades: [
    {
      title: '',
      id: '',
      total:'',
      grades:[
        {
            course:'',
            grade:[],


        }
      ]
    },
  ],
}


const semesterManagementData = {
  semesters: [
    {
      title: '',
      id: '',
      coursesNum: '',
      studentsNum: '',
      level: '',
      field: '',
      startDate: '',
      endDate: '',
      completed: '',
    },
  ],
}

const courseData = {
  courseInfo: {
    title: '',
    subtitle: '',
    id: '',
    describtion: '',
    image: '',
    secince: '',
    teachers: [],
    requirements: [],
    status: '',
  },
  courseSyllbus: [
    {
      title: '',
      id: '',
      lectures: [
        {
          title: '',
          id: '',
          expectedTime: '',
          describtion: '',
          video: vd,
          notes: '',
          file: '',
        },
      ],
    },
  ],
  studentsGrades: [
    {
      student: studentInfo,
      id: '',

      grade: 33,
    },
  ],
}








export const fetchDataThunk = () => async (dispatch) => {
  dispatch(fetchData())

  try {
    const response = await fetch('your-api-endpoint')
    const data = await response.json()
    dispatch(fetchDataSuccess(data))
  } catch (error) {
    dispatch(fetchDataError(error.message))
  }
}
