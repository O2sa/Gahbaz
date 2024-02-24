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

export const AddField = ({ opt, visible, setVisible, itemData, ...props }) => {
  const dispatch = useDispatch()
  // const filed = useSelector((state) => {
  //   return state.collagesManagement.fields.find(item => item.id === );
  // })
  // useEffect(() => {
  //   dispatch(asyncCrudThunks[`${collection}`].getItemsThunk())
  // }, [])
  // const { error } = useSelector((state) => state.collagesManagement.fields);

  const [formData, setFormData] = useState({
    name: opt === 'edit'  ? itemData.name : '',
    describtion:  opt === 'edit'  ? itemData.describtion : '',
    duration:  opt === 'edit'  ? itemData.duration : '',
    semestersNum:  opt === 'edit'  ? itemData.semestersNum : '',
  })
  const [validated, setValidated] = useState(false)
  function handleSubmit(event) {
    // event.preventDefault()
    console.log('formData', formData)
    opt === 'edit'
      ? dispatch(
          asyncCrudThunks.fields.updateItemThunk({
            id: itemData.id,
            data: formData,
          }),
        )
      : dispatch(asyncCrudThunks.fields.createItemThunk(formData))
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
        variant={'form'}
        handleSubmit={handleSubmit}
        title={'إضافة كلية'}
        {...props}
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
              <CRow>
                <CCol md={6}>
                  <CFormInput
                    onChange={handlChange}
                    type="text"
                    name="duration"
                    // defaultValue={formData.collage_name}
                    value={formData.duration}
                    id="validationCustom01"
                    label="اسم الكلية"
                  />
                </CCol>{' '}
                <CCol md={6}>
                  <CFormInput
                    onChange={handlChange}
                    type="text"
                    name="semestersNum"
                    // defaultValue={formData.collage_name}
                    value={formData.semestersNum}
                    id="validationCustom01"
                    label="اسم الكلية"
                  />
                </CCol>
              </CRow>
            </CForm>
          </>
        }
        // setVisible={setVisible}
      />
    </>
  )
}
