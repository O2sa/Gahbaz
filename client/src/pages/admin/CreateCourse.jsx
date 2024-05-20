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
} from '@coreui/react'

import { BsStack } from 'react-icons/bs'

import { useLocation, useParams } from 'react-router-dom'
import { TabsLinks } from '../../stories/Tabs/Tabs'

export default function CreateCourse ({ ...props })  {
  // const courseId = useLocation().search || ''
  const { id } = useParams()
  // console.log('courseId', id)

  const tabs = [
    {
      name: 'المعلومات الأساسية',
      icon: BsStack,
      to: '.',
    },
    // {
    //   name: 'المعلومات الثانوية',
    //   icon: BsStack,
    //   to: 'fields',
    // },
    {
      name: 'الدروس',
      icon: BsStack,
      to: `lessons`,
    },
    {
      name: 'درجات الطلاب',
      icon: BsStack,
      to: `grades`,
    },
  ]
  return <TabsLinks tabs={tabs} />
}
