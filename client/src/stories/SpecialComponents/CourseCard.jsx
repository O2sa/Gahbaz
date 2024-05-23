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

import { Link } from 'react-router-dom'
export const CourseCard = ({ course, ...props }) => {
  return (
    <>
      <CCard style={{ width: '18rem' }} className="border-0 j-box-shadow p-0">
        <CCardImage orientation="top" src={docsImg} />
        <CCardBody>
          <Link to={`${course._id}`}>
           <div className="d-flex justify-content-between mb-2">
            <CBadge className="bg-primary text-primary bg-opacity-10 fw-light p-1">
              {course.secince}
            </CBadge>
            <CBadge className="fw-light  text-primary">{course.teacher}</CBadge>
          </div>{' '}
          <div className="my-3">
            <h5 className={'mb-0'}>{course.name}</h5>
            <span className={`text-secondary`}> {course.semester}</span>{' '}
          </div>
          </Link>
          <div className="d-flex justify-content-between">
            <div className="w-75 me-1">
              <Link to={`/course/study/${course.id}`}>
                <CButton
                  className={`w-100 ${
                    course.compeleted ? '' : 'border-0 bg-primary bg-opacity-25 text-primary'
                  }`}
                >
                  {course.compeleted ? 'دراسة' : 'مراجعة'}
                </CButton>
              </Link>
            </div>
            <div className="m-auto">
              <CBadge
                shape="rounded-pill"
                className={`${
                  course.compeleted ? 'text-success bg-success' : 'text-info bg-info'
                } h-auto fw-light  bg-opacity-10 p-2`}
              >
                {course.compeleted ? 'مكتمل' : 'ما زال'}
              </CBadge>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}
