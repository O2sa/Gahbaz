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
  CCol,
  CFormInput,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Model from '../components/Model'

import { AiTwotoneCheckSquare } from 'react-icons/ai'
import { MdCheckBoxOutlineBlank } from 'react-icons/md'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { BiSolidVideos } from 'react-icons/bi'
import { IoIosPause } from 'react-icons/io'
import { PiPlayPauseFill } from 'react-icons/pi'
import { IoMdTime } from 'react-icons/io'
import { Lecture } from './Lecture'

export const CourseSection = ({
  section = {
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
  ...props
}) => {
  const calCompeleted = (lectures) => {
    let completed = 0
    lectures.map((item) => {
      if (item.completed) completed++
    })
    return `(${completed}/${lectures.length})`
  }

  return (
    <CAccordion className='p-0' activeItemKey={2}>
      <CAccordionItem itemKey={1}>
        <CAccordionHeader>
          <div className={`d-flex align-items-center justify-content-between w-100`}>
            <div>{section.name}</div>
            <div>
              <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
              <span className={`me-3`}>{`${section.lectures.length} محاضرات`}</span>
              <IoMdTime size={'20'} className={` me-2 text-warning`} />
              <span className={`me-3`}>{section.time}</span>
              <IoCheckmarkDoneSharp size={'20'} className={` me-2 text-success`} />
              <span className={`me-3`}>
                {`%${section.completed} إكتمل `}
                <span className="text-secondary">{calCompeleted(section.lectures)}</span>
              </span>
            </div>
          </div>{' '}
        </CAccordionHeader>
        <CAccordionBody>
          {section.lectures.map((item, idx) => (
            <Lecture
              key={idx}
              name={item.anme}
              completed={item.completed}
              time={item.time}
              active={item.active}
            />
          ))}
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  )
}
