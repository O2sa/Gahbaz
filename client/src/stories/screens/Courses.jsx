import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../components/Model'
import {
  CCol,
  CRow,
  CForm,
  CFormControlValidation,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormFeedback,
  CFormCheck,
  CButton,
  CFormTextarea,
  CFormInput,
} from '@coreui/react'

import { Input } from '../components/Input'
import { useDispatch } from 'react-redux'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { TabsBody } from '../Tabs/TabsBody'
import { AddCollage } from './AddCollage'
import AboutSemester from '../SpecialComponents/AboutSemester'
import { CourseInfo } from '../SpecialComponents/CourseInfo'
import { AddCourse } from '../SpecialComponents/AddCourse'
import { useParams } from 'react-router-dom'
import { CourseCard } from '../SpecialComponents/CourseCard'

export const Courses = ({ opt, visible, setVisible, itemData, ...props }) => {
  var courses = [
    {
      name: ' تصميم وتحليل النظم الادارية',
      semester: '',
      secince: 'Computer Science',
      teacher: 'علي صالح',
      compeleted: false,
      id: 1,
    },
    {
      name: ' تصميم وتحليل النظم الادارية',
      semester: '',
      secince: 'Computer Science',
      teacher: 'علي صالح',
      compeleted: true,
      id: 1,
    },
    {
      name: ' تصميم وتحليل النظم الادارية',
      semester: '',
      secince: 'Computer Science',
      teacher: 'علي صالح',
      compeleted: false,
      id: 1,
    },
    {
      name: ' تصميم وتحليل النظم الادارية',
      semester: '',
      secince: 'Computer Science',
      teacher: 'علي صالح',
      compeleted: true,
      id: 1,
    },
  ]

  return (
    <div className="bg-white p-4">
      <div className="filters">
        <div>
          <h4> الدورات</h4>{' '}
        </div>
      </div>
      <div className=" row row-cols-auto justify-content-center mt-5 ">
        {courses.map((course, idx) => (
          <div key={idx} className="mb-4">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  )
}
