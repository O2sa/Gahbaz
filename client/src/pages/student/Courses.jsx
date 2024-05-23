import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../../stories/components/Model'
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
  CSpinner,
} from '@coreui/react'

import { useParams } from 'react-router-dom'
import { CourseCard } from '../../stories/SpecialComponents/CourseCard'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'

export default function Courses  ({  ...props }) {
  // var courses = [
  //   {
  //     name: ' تصميم وتحليل النظم الادارية',
  //     semester: '',
  //     secince: 'Computer Science',
  //     teacher: 'علي صالح',
  //     compeleted: false,
  //     id: 1,
  //   },
  //   {
  //     name: ' تصميم وتحليل النظم الادارية',
  //     semester: '',
  //     secince: 'Computer Science',
  //     teacher: 'علي صالح',
  //     compeleted: true,
  //     id: 1,
  //   },
  //   {
  //     name: ' تصميم وتحليل النظم الادارية',
  //     semester: '',
  //     secince: 'Computer Science',
  //     teacher: 'علي صالح',
  //     compeleted: false,
  //     id: 1,
  //   },
  //   {
  //     name: ' تصميم وتحليل النظم الادارية',
  //     semester: '',
  //     secince: 'Computer Science',
  //     teacher: 'علي صالح',
  //     compeleted: true,
  //     id: 1,
  //   },
  // ]


  const {
    data: courses = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['courses']))

  if (isFetchingTeachers) {
    return <CSpinner color="primary" />
  }

  if (courses.length == 0) {
    return (
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{'عن الكلية'} </h5>
      </div>
    )
  }
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
