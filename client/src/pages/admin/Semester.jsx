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

import { Input } from '../../stories/components/Input'
import { useDispatch } from 'react-redux'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { TabsBody } from '../../stories/Tabs/TabsBody'
import AddCollage from './AddCollage'
import AboutSemester from './AboutSemester'

export default function Semester({ opt, visible, setVisible, itemData, ...props }) {
  return (
    <div className="bg-white">
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{' تفاصيل الفصل'} </h5>
      </div>{' '}
      <div className="m-4 mt-5">
        <AboutSemester />
      </div>
    </div>
  )
}
