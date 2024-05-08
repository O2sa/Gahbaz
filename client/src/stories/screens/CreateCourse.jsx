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
import { useLocation, useParams } from 'react-router-dom'
import { EditCourseInfo } from '../SpecialComponents/EditCourseInfo'
import { Tabs } from '../Tabs/Tabs'

export const CreateCourse = ({ ...props }) => {
  // const courseId = useLocation().search || ''
  const { id } = useParams()
  // console.log('courseId', id)

  const tabs = [
    {
      name: 'المعلومات الأساسية',
      // icon: stackIcon,
      to: '.',
    },
    {
      name: 'المعلومات الثانوية',
      // icon: stackIcon,
      to: 'fields',
    },
    {
      name: 'الدروس',
      // icon: stackIcon,
      to: `lessons`,
    },
    {
      name: 'درجات الطلاب',
      // icon: stackIcon,
      to: `grades`,
    },
  ]
  return <Tabs tabs={tabs} />
}
