import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import docsImg from '../assets/docs.png'
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
  CCol,
  CFormInput,
  CCard,
  CCardImage,
  CNav,
  CCardBody,
  CCardTitle,
  CCardText,
  CBadge,
} from '@coreui/react'
import { GiTeacher } from 'react-icons/gi'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Model from '../components/Model'
import { Tab } from '../Tabs/Tab'
import { MdOutlineChecklist } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
export const CourseInfo = ({ ...props }) => {
  const courses = {
    name: 'برمجة المتحكمات',
    secince: 'البرمجة المتقدمة',
    semester: 'الفصل السابع',
    compeleted: false,
    teacher: 'علي قاسم',
  }
  const dispatch = useDispatch()

  const { id } = useParams()
  useEffect(() => {
    dispatch(asyncCrudThunks.courses.getItemThunk(id))
  }, [])

  const course = useSelector((state) => {
    return state.collagesManagement.course
  })
  const status = useSelector((state) => {
    return state.collagesManagement.status
  })
  // console.log(collage)

  if (status === 'loading') {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }

  return (
    course && (
      <CRow>
        <CRow>
          <div>
            <h3 className="mb-3">{course.name}</h3>
            <p>{course.subtitle}</p>
          </div>
          <div className="d-flex align-items-center mb-1">
            <div className="position-relative">
              <CAvatar size="sm" className="" src={avatar2} />
              <CAvatar
                size="sm"
                className="position-absolute top-0"
                style={{ right: '15px' }}
                src={avatar2}
              />
            </div>
            <div style={{ fontSize: '12px' }} className="fw-light  ms-4 ">
              <span className="text-secondary">المحاضر</span>
              <p>
                {course.teachers.map(
                  (teacher, idx) =>
                    `${teacher.name} ${idx + 1 !== course.teachers.length ? ' * ' : ''}`,
                )}
              </p>
            </div>
          </div>
          <div>
            <CCardImage orientation="top" src={docsImg} />
          </div>
        </CRow>
        <CRow>
          <div>
            <CNav variant="tabs" className="p-0" role="tablist">
              <Tab label={'المادة'} activeKey={1} />
              <Tab label={'المادة'} activeKey={2} />
              <Tab label={'المادة'} activeKey={3} />
              <Tab label={'المادة'} activeKey={4} />
            </CNav>
          </div>
        </CRow>
        <CRow>
          <div className="mt-4">
            <h5>عن الدورة</h5>
            <p>{course.describtion}</p>
          </div>
          <div className="mt-4 bg-success bg-opacity-10 p-4">
            <h5>ما الذي ستتععلمه في هذه الدورة؟</h5>
            <CRow className="">
              {course.willLearn.map((item) => (
                <CCol md={6} className="d-flex justify-content-top">
                  <div className="me-2">
                    <MdOutlineChecklist className="text-success" size={'32'} />
                  </div>
                  <p>{item}</p>
                </CCol>
              ))}
            </CRow>
          </div>
          <div className="mt-4">
            <h5>متطلبات الدورة</h5>
            <p>
              <ul>
                {course.requirements.map((item) => (
                  <li className="m-2">{item}</li>
                ))}
              </ul>
            </p>
          </div>
        </CRow>
      </CRow>
    )
  )
}
