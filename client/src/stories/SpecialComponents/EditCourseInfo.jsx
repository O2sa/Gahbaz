import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CListGroup,
  CButton,
  CListGroupItem,
  CAvatar,
  CRow,
  CCard,
  CCardImage,
  CCardBody,
  CCardText,
  CCol,
  CFormTextarea,
  CFormInput,
} from '@coreui/react'
import { CiImageOn } from 'react-icons/ci'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { BsUpload } from 'react-icons/bs'
import { IoReorderFourOutline } from 'react-icons/io5'
import { Divider } from '@mui/material'
import { IoMdAdd } from 'react-icons/io'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'

export const EditCourseInfo = ({ ...props }) => {
  const dispatch = useDispatch()
  const { id } = useParams()
  // console.log(id)

  let course
  useEffect(() => {
    if (id !== 'new') dispatch(asyncCrudThunks.courses.getItemThunk(id))
  }, [])
 course = useSelector((state) => state.collagesManagement.course)

  // console.log(course)
  const [formData, setFormData] = useState({
    describtion: id !== 'new'? course.describtion : '',
    image: id !== 'new' ? course.image : '',
    willLearn: id !== 'new' ? course.willLearn : [],
    requirements: id !== 'new' ? course.requirements : [],
  })
  //   const dispatch = useDispatch()

  function handleSubmit(event) {
    event.preventDefault()
    console.log('formData', formData)
  }

  const updateArr = (arr, value, idx) => {
    const index = parseInt(idx)

    let newArr = arr.map((item, idxx) => item)
    // arr.map((item, idxx) => (idxx == index ? value : item))
    newArr[index] = value
    // console.log('value', value, 'arr', newArr)

    return newArr
  }

  const addItemToArr = (arr) => {
    // console.log(arr)
    arr.push('')
    return arr
  }

  function handlChange(event) {
    let { name, type, checked, value, id } = event.target
    // console.log('event', name, type, checked, value, id)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === 'willLearn' || name === 'requirements'
          ? updateArr(prevFormData[name], value, id)
          : value,
    }))
    // console.log(formData)
  }

  function addElement(event) {
    let { name, type, checked, value, id } = event.target
    console.log('event', name, type, checked, value, id)

    const itemsArr = formData[name]

    // updatedSallybals[idx] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: addItemToArr(prevFormData[name]),
    }))
    console.log(formData)
  }

  const saveData = () => {
    console.log('data', formData)
    if (id === 'new') {
      dispatch(asyncCrudThunks.courses.createItemThunk(formData))

     
    } else {
      dispatch(asyncCrudThunks.courses.updateItemThunk({ id: id, data: formData }))
    }
    console.log('newCourse', course)

  }

  return (
    <CRow className="m-4">
      <CRow>
        <h5 className="mb-2">غلاف الدورة</h5>
        <CCard className="mb-3 border-0" style={{ maxWidth: '540px' }}>
          <CRow className="g-0">
            <CCol md={4} className="bg-light">
              <CiImageOn c className="w-100 h-100 text-secondary" />{' '}
            </CCol>
            <CCol md={8}>
              <CCardBody>
                <CCardText>
                  This is a wider card with supporting text below as a natural lead-in to additional
                  content. This content is a little bit longer.
                </CCardText>
                <CCardText>
                  <CButton className="text-primary border-0 bg-primary bg-opacity-10">
                    <BsUpload className="me-2" />
                    تحميل
                  </CButton>
                </CCardText>
              </CCardBody>
            </CCol>
          </CRow>
        </CCard>
      </CRow>
      <hr className="border-1 w-100 h-auto my-4" />
      <CRow>
        <CFormTextarea
          type="text"
          name="describtion"
          value={formData.describtion}
          id="validationCustom02"
          label="وصف الكية"
          placeholder="إكتب وصف الدورة"
          onChange={handlChange}

          // required
        />
      </CRow>{' '}
      <hr className="border-1 w-100 h-auto my-4" />
      <CRow>
        <div className="d-flex justify-content-between">
          <h5 className="mb-2">أضف فصول الدورة</h5>
          <CButton onClick={addElement} color="primary" name="willLearn" variant="ghost">
            <IoMdAdd />
            إضافة عنصر
          </CButton>
        </div>
        {formData.willLearn.map((item, idx) => (
          <CFormInput
            type="text"
            name="willLearn"
            value={item}
            id={`${idx}`}
            label={`0${idx + 1}`}
            placeholder="أضف فصل للدورة"
            onChange={handlChange}
            // required
          />
        ))}
      </CRow>
      <hr className="border-1 w-100 h-auto my-4" />
      <CRow>
        <div className="d-flex justify-content-between">
          <h5 className="mb-2"> متطلبات الدورة</h5>
          <CButton onClick={addElement} color="primary" name="requirements" variant="ghost">
            <IoMdAdd />
            إضافة عنصر
          </CButton>
        </div>
        {formData.requirements.map((item, idx) => (
          <CFormInput
            type="text"
            name="requirements"
            value={item}
            id={`${idx}`}
            label={`0${idx + 1}`}
            placeholder="أضف متطلب للدورة"
            onChange={handlChange}
            // required
          />
        ))}
      </CRow>{' '}
      <hr className="border-1 w-100 h-auto my-4" />
      <div className="d-flex justify-content-end">
        <CButton onClick={saveData} color="primary" name="">
          حفظ
        </CButton>
      </div>
    </CRow>
  )
}
