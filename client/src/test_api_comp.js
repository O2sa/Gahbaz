// Your React component
import React, { useEffect, useState } from 'react'
import * as apiWrapper from './apis/apiWrapper.mjs'
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { asyncCrudThunks } from './dataLogic/CollageManagementSlice.mjs'
import { Provider, useDispatch, useSelector } from 'react-redux'

const testData = {
  collage: { name: 'Example Collage', fieldsNum: '5' },
  semester: {
    title: 'Fadll 2022',
    coursesNum: '33',
    studentsNum: '50',
    level: 'Undergraduate',
    field: 'Computer Science',
    startDate: '2022-09-01',
    endDate: '2022-12-20',
    completed: true,
  },
  course: {
    title: 'Introduction to Programming',
    subtitle: 'Learn the basics of programming',
    describtion: 'This course covers fundamental programming concepts.',
    image: 'course_image.jpg',
    secince: 'Computer Science',
    teachers: ['John Doe', 'Jane Smith'],
    requirements: ['Basic computer skills'],
    status: 'Active',
  },
  subject: {
    title: 'Mathematics',
    subtitle: 'Advanced Calculus',
  },
  field: {
    title: 'Computer Science',
    semestersNum: '8',
    describtion: 'Computer Science program description.',
    duration: 4,
  },

  semesterTemplate: { title: 'Standard Template', subjectsNum: '5', order: '1' },
}
const Testing = () => {
  const dispatch = useDispatch()

  const collages = useSelector((state) => state.collagesManagement.collages)
  // const semesters = useSelector((state) => state.collagesManagement.semesters)
  // const courses = useSelector((state) => state.collagesManagement.courses)
  // const subjects = useSelector((state) => state.collagesManagement.subjects)
  // const fields = useSelector((state) => state.collagesManagement.fields)
  // const semesterTemplates = useSelector((state) => state.collagesManagement.semesterTemplates)
  console.log('Collages Data:', collages)
  // console.log('Semesters Data:', semesters)
  // console.log('courses Data:', courses)
  // console.log('subjects Data:', subjects)
  // console.log('fields Data:', fields)
  // console.log('semestersTemplates Data:', semesterTemplates)

 
  const testCollages = async () => {
    dispatch(asyncCrudThunks.collages.getItemsThunk())
    console.log('All Collages:', collages)

    dispatch(
      asyncCrudThunks.collages.createItemThunk(testData.collage))
    

      console.log('Created Collage:', collages)
    dispatch(
      asyncCrudThunks.collages.updateItemThunk({
        id: '1',
        data: testData.collage
      }),
    )

    console.log('Updated Collage:', collages)

    dispatch(asyncCrudThunks.collages.deleteItemThunk('1'))
    console.log('Deleted Collage:', collages)
  }

  // testCollages()
  useEffect(() => {
    // testSemsters()
    testCollages()
    // testCourses()
    // testSemesterTemplates()
    // testSubjects()
    // testFields()
  }, [])
  return <div>Testing  </div>
}

export default Testing
