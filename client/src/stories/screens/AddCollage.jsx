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

export const AddCollage = ({ opt, visible, setVisible, itemData, ...props }) => {
  const [formData, setFormData] = useState({
    name: opt === 'edit' ? itemData.name : '',
    describtion: opt === 'edit' ? itemData.describtion : '',
  })

  const dispatch = useDispatch()
  const [validated, setValidated] = useState(false)

  function handleSubmit(event) {
    // event.preventDefault()
    // console.log('formData', formData)
    opt === 'edit'
      ? dispatch(
          asyncCrudThunks.collages.updateItemThunk({
            id: itemData.id,
            data: formData,
          }),
        )
      : dispatch(asyncCrudThunks.collages.createItemThunk(formData))
  }

  function handlChange(event) {
    let { name, type, checked, value } = event.target
    // console.log('event', name, type, checked, value)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
    // console.log(formData)
  }

  return (
    <>
      <Model
        // visible={visible}
        variant={'form'}
        handleSubmit={handleSubmit}
        title={'إضافة كلية'}
        modelBody={
          <>
            <CForm
              className="row g-3 needs-validation"
              // noValidate
              // validated={validated}
              // onSubmit={handleSubmit}
            >
              <CRow>
                <CFormInput
                  onChange={handlChange}
                  type="text"
                  name="name"
                  // defaultValue={formData.collage_name}
                  value={formData.name}
                  id="validationCustom01"
                  label="اسم الكلية"
                  // required
                />
              </CRow>
              <CRow className="mt-2">
                <CFormTextarea
                  type="text"
                  name="describtion"
                  value={formData.describtion}
                  id="validationCustom02"
                  label="وصف الكية"
                  onChange={handlChange}
                  // required
                />
              </CRow>
            </CForm>
          </>
        }
        // setVisible={setVisible}
      />
    </>
  )
}
