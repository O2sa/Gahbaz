import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

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
  CFormTextarea,
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
import { AddCollage } from '../screens/AddCollage'
import { Input } from '@mui/material'

export const EditCourseSections = ({ ...props }) => {
  const dispatch = useDispatch()
  // const location=useLocation()
  const { id } = useParams()
  console.log('courseId', id)

  useEffect(() => {
    dispatch(asyncCrudThunks.courses.getItemThunk(id))
  }, [])

  const course = useSelector((state) => state.collagesManagement.course)

  return (
    <>
      {course && (
        <div>
          {course.sections.map((item, idx) => (
            <EditCourseSection section={item} />
          ))}
          <div className='mx-2'>
            <CButton size='lg' className="bg-primary bg-opacity-25 text-primary border-0  w-100">
              إضافة قسم
            </CButton>
          </div>
        </div>
      )}
      <Outlet />
    </>
  )
}

export const EditSectionTitle = ({ opt = 'edit' }) => {
  const dispatch = useDispatch()

  const { id } = useParams()
  // console.log('courseId', id)
  useEffect(() => {
    asyncCrudThunks.courses.getItemThunk(id)
  }, [])

  const course = useSelector((state) => state.collagesManagement.course)

  const [formData, setFormData] = useState({
    sectionTitle: course.sections[1].name,
  })

  function handleSubmit(event) {
    const sections = course.sections.map((item, idx) =>
      idx === 1 ? { ...item, name: formData.sectionTitle } : item,
    )
    const newCourse = { ...course, sections: sections }
    dispatch(
      asyncCrudThunks.courses.updateItemThunk({
        id: id,
        data: newCourse,
      }),
    )
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
    <div>
      <Model
        title={'تعديل اسم القسم'}
        handleSubmit={handleSubmit}
        to={'..'}
        modelBody={
          <>
            <CFormInput
              type="text"
              name="sectionTitle"
              value={formData.sectionTitle}
              id={``}
              label={`اسم القسم`}
              placeholder="أضف اسم القسم"
              onChange={handlChange}
              // required
            />
          </>
        }
      />
    </div>
  )
}

export const UploadLessonVideo = ({ opt = 'edit' }) => {
  const dispatch = useDispatch()

  const { id } = useParams()
  // console.log('courseId', id)
  useEffect(() => {
    asyncCrudThunks.courses.getItemThunk(id)
  }, [])

  const course = useSelector((state) => state.collagesManagement.course)

  const [formData, setFormData] = useState({
    sectionTitle: course ? course.sections[1].name : '',
  })

  // function handleSubmit(event) {
  //   const sections = course.sections.map((item, idx) =>
  //     idx === 1 ? { ...item, name: formData.sectionTitle } : item,
  //   )
  //   const newCourse={...course, sections: sections}
  //   dispatch(
  //     asyncCrudThunks.courses.updateItemThunk({
  //       id: id,
  //       data: newCourse,
  //     }),
  //   )
  // }

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
    <div>
      <Model
        title={'تعديل اسم القسم'}
        // handleSubmit={handleSubmit}
        to={'..'}
        modelBody={
          <div>
            <CFormInput
              type="file"
              name="lessonVideo"
              // value={'formData.sectionTitle'}
              id={``}
              label={`اسم القسم`}
              placeholder="أضف اسم القسم"
              onChange={handlChange}
              // required
            />
          </div>
        }
      />
    </div>
  )
}

export const AddLessonDescription = ({ opt = 'edit' }) => {
  const dispatch = useDispatch()

  const { id } = useParams()
  // console.log('courseId', id)
  useEffect(() => {
    asyncCrudThunks.courses.getItemThunk(id)
  }, [])
  const course = useSelector((state) => state.collagesManagement.course)
  const [formData, setFormData] = useState({
    sectionTitle: course ? course.sections[1].name : '',
  })

  // function handleSubmit(event) {
  //   const sections = course.sections.map((item, idx) =>
  //     idx === 1 ? { ...item, name: formData.sectionTitle } : item,
  //   )
  //   const newCourse={...course, sections: sections}
  //   dispatch(
  //     asyncCrudThunks.courses.updateItemThunk({
  //       id: id,
  //       data: newCourse,
  //     }),
  //   )
  // }

  function handlChange(event) {
    let { name, type, checked, value } = event.target
    // console.log('event', name, type, checked, value)

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
    // console.log(formData)
  }
  const [value, setValue] = useState('')
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  const onEditorStateChange = (newEditorState) => {
    // Get the content state
    const contentState = newEditorState.getCurrentContent()

    // Convert content state to raw JSON
    const rawContent = convertToRaw(contentState)
    console.log(rawContent)
    setEditorState(newEditorState)
  }

  return (
    <div>
      <Model
        variant={'form'}
        title={'تعديل اسم القسم'}
        // handleSubmit={handleSubmit}
        to={'..'}
        modelBody={<Editor editorState={editorState} onEditorStateChange={onEditorStateChange} />}
      />
    </div>
  )
}
