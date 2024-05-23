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


import CourseInfo from '../../stories/SpecialComponents/CourseInfo'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'

export default function Course({ admin = true, opt, visible, setVisible, itemData, ...props }) {
  const { courseId } = useParams()
  const {
    data: course = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['courses', courseId]))

  if (isFetching) {
    return (
      <CSpinner color="primary" />

    )
  }
  return (
    <div className="bg-white">
      {/* {admin && (
        <TabsBody  title={'الفصول الحالية'} />
      )} */}
      <div className="m-4 pt-5">
        <CourseInfo course={course} />
      </div>
    </div>
  )
}
