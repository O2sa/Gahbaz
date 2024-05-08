import React, { useState } from 'react'
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
  CProgress,
  CProgressBar,
  CCol,
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Model from '../components/Model'
import { CourseSection } from './CourseSection'
export const CourseContent = ({
  sections = [
    {
      name: ' 1. الدرس الأول',
      time: '52د',
      completed: 25,
      lectures: [
        {
          name: ' 1. الدرس الأول',
          time: '07:31',
          completed: true,
          active: true,
        },
        {
          name: ' 1. الدرس الأول',
          time: '07:31',
          completed: false,
          active: false,
        },
        {
          name: ' 1. الدرس الأول',
          time: '07:31',
          completed: false,
          active: false,
        },
      ],
    },
    {
      name: ' 1. الدرس الأول',
      time: '52د',
      completed: 25,
      lectures: [
        {
          name: ' 1. الدرس الأول',
          time: '07:31',
          completed: true,
          active: true,
        },
        {
          name: ' 1. الدرس الأول',
          time: '07:31',
          completed: false,
          active: false,
        },
        {
          name: ' 1. الدرس الأول',
          time: '07:31',
          completed: false,
          active: false,
        },
      ],
    },
  ],
  ...props
}) => {
  return (
    <div>
      <CRow className='mb-4'>
        <h4>محتويات الدورة</h4>
        <CProgress height={16} className="p-0" color="success" value={25}>
          <CProgressBar>25%</CProgressBar>
        </CProgress>
      </CRow>
      <CRow>
        {sections.map((section, idx)=>(
          <CourseSection key={idx} section={section}/>

        ))}
        
      </CRow>
    </div>
  )
}
