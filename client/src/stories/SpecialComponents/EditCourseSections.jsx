import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CListGroup,
  CButton,
  CListGroupItem,
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CRow,
  CFormInput,
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Model from '../components/Model'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { EditCourseSection } from './EditCourseSection'

export const EditCourseSections = ({ ...props }) => {
  const dispatch = useDispatch()
// const location=useLocation()
  const {id} = useParams()
  // console.log('courseId', id)

  useEffect(() => {
    dispatch(asyncCrudThunks.courses.getItemThunk(id))
  }, [])

  const course = useSelector((state) => state.collagesManagement.course)

  //   console.log('sections', cours)

  return (
    <>
      {course && (
        <div>
          {course.sections.map((item,idx) => (
            <EditCourseSection section={item}  />
          ))}
        </div>
      )}
      <Outlet />
    </>
  )
}




export const EditSectionTitle = ({opt='edit'}) => {
  const dispatch = useDispatch()

  const { id } = useParams()
  // console.log('courseId', id)
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

  function handleSubmit(event) {
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

  return (
    <Model
      title={'تعديل اسم القسم'}
      handleSubmit={handleSubmit}
      modelBody={
        <>
          <CFormInput
            type="text"
            name="name"
            value={'formData.name'}
            id={``}
            label={`اسم القسم`}
            placeholder="أضف اسم القسم"
            // onChange={handlChange}
            // required
          />
        </>
      }
    />
  )
}
