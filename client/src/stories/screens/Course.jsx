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

export const Course = ({ admin = true, opt, visible, setVisible, itemData, ...props }) => {
  return (
    <div className="bg-white">
      {admin && (
        <TabsBody opt={'edit'} addModel={AddCourse} label={'تعديل'} title={'الفصول الحالية'} />
      )}
      <div className="m-4 pt-5">
        <CourseInfo />
      </div>
    </div>
  )
}
