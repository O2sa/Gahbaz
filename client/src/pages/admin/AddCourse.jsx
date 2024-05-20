import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { AddTeacher } from '../../stories/SpecialComponents/AddTeacher'
import { useParams } from 'react-router-dom'

export default function AddCourse  ({ opt, visible, setVisible, itemData, ...props })  {
  const dispatch = useDispatch()

  const { id } = useParams()
  console.log('courseId', id)
  useEffect(() => {
    asyncCrudThunks.courses.getItemThunk(id)
  }, [])

  const course = useSelector((state) => state.collagesManagement.course)


  const [formData, setFormData] = useState({
    name: opt === 'edit' ? course.name : '',
    describtion: opt === 'edit' ? course.describtion : '',
    secince: opt === 'edit' ? course.secince : '',
    teachers: opt === 'edit' ? course.teachers : '',
  })

  // const [validated, setValidated] = useState(false)
  function handleSubmit(event) {
    // event.preventDefault()
    // console.log('formData', formData)
    opt === 'edit'
      ? dispatch(
          asyncCrudThunks.courses.updateItemThunk({
            id: course.id,
            data: { ...formData, teachers: selectedItems },
          }),
        )
      : dispatch(asyncCrudThunks.courses.createItemThunk({ ...formData, teachers: selectedItems }))

      
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

  let teachers = [
    { name: 'John Doe', id: '24234234', selected: false },
    { name: 'Jane Smith', id: '3434324', selected: false },
    { name: 'Jane bll', id: '97897', selected: false },
    { name: 'Jane hooo', id: '2432434', selected: true },
  ]
  const [selectedItems, setSelectedItems] = useState(teachers.filter((item) => item.selected))

  return (
    <>
      <Model
        // visible={visible}
        variant={'form'}
        handleSubmit={handleSubmit}
        title={'إضافة دورة'}
        modelBody={
          <>
            <CForm
              className="row g-3 needs-validation"
              // noValidate
              // validated={validated}
              // onSubmit={handleSubmit}
            >
              <CCol>
                <CRow>
                  <CFormInput
                    onChange={handlChange}
                    type="text"
                    name="name"
                    // defaultValue={formData.collage_name}
                    value={formData.name}
                    id="validationCustom01"
                    label="اسم الدورة"
                    // required
                  />
                </CRow>
                <CRow className="mt-2">
                  <CFormTextarea
                    type="text"
                    name="secince"
                    value={formData.secince}
                    id="validationCustom02"
                    label="مجال الدورة"
                    onChange={handlChange}
                    // required
                  />
                </CRow>{' '}
              </CCol>
              <CCol>
                <AddTeacher
                  teachers={teachers}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </CCol>
              <CRow className="mt-2">
                <CFormTextarea
                  type="text"
                  name="describtion"
                  value={formData.describtion}
                  id="validationCustom02"
                  label="وصف الدورة"
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
