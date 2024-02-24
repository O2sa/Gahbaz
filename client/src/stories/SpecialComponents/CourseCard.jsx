import React, { useState } from 'react'
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
  CFormInput,
  CCard,
  CCardImage,
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
export const CourseCard = ({ ...props }) => {

  return (
    <>
      <CCard style={{ width: '18rem' }}>
        <CCardImage orientation="top" src={docsImg} />
        <CCardBody>
            <div className="d-flex justify-content-between mb-2">
              <CBadge className="bg-primary text-primary bg-opacity-10 fw-light p-1">{courses.secince}</CBadge>
              <CBadge className="fw-light  text-primary">{courses.teacher}</CBadge>
            </div>{' '}
          <div className='my-3'>
            <h5 className={'mb-0'}>{courses.name}</h5>
            <span className={`text-secondary`}> {courses.semester}</span>{' '}
          </div>
          <div className='d-flex justify-content-between'>
            <div className="w-75 me-1">
            <CButton className={`w-100 ${courses.compeleted? '':'border-0 bg-primary bg-opacity-25 text-primary'}`} >
                {courses.compeleted? "دراسة":"مراجعة"}
                </CButton>
            </div>
            <div className='m-auto'>
            <CBadge  shape="rounded-pill" className={`${courses.compeleted?'text-success bg-success':'text-info bg-info'} h-auto fw-light  bg-opacity-10 p-2`}>
              {courses.compeleted? 'مكتمل':'ما زال'}
            </CBadge>
            </div>
    
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}
