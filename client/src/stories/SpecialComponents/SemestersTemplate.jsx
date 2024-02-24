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
import CardsGroup from '../SpecialComponents/CardsGroup'
import { SemesterTemplateDetails } from '../SpecialComponents/SemesterTemplateDetails'
import { Outlet } from 'react-router-dom'
import { AddField } from '../screens/AddField'

export const SemestersTemplate = ({ opt, visible, setVisible, itemData, ...props }) => {
  return (
    <CRow className='m-2'>
      <CCol sm className="p-0">
        <CardsGroup editModel={AddField} collection={'semesterTemplates'} />
      </CCol>
      <CCol sm='auto' className="p-0">
        <Outlet />
      </CCol>
    </CRow>
  )
}
