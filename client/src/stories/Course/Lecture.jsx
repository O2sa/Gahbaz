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
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Model from '../components/Model'

import { FaCheckSquare } from "react-icons/fa";
import { MdCheckBoxOutlineBlank } from 'react-icons/md'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { BiSolidVideos } from 'react-icons/bi'
import { IoIosPause } from 'react-icons/io'
import { PiPlayPauseFill } from 'react-icons/pi'
import { IoMdTime } from 'react-icons/io'

export const Lecture = ({
  name = ' 1. الدرس الأول',
  time = '07:31',
  completed = false,
  active = false,
  ...props
}) => {
  return (
    <>
      <div
        className={`d-flex align-items-center justify-content-between p-2 ${
          active ? 'bg-primary bg-opacity-25' : ''
        }`}
      >
        <div>
          {completed ? (
            <FaCheckSquare

              size={'16'}
              className={`${active ? 'text-primary' : 'text-secondary'} me-2`}
            />
          ) : (
            <MdCheckBoxOutlineBlank
              size={'16'}
              className={`${active ? 'text-primary' : 'text-secondary'} me-2`}
            />
          )}
          <span className={`${active ? '' : 'text-secondary'}`}>{name} </span>
        </div>
        <div>
          <IoIosPause size={'16'} className={`${active ? '' : 'text-secondary'} me-2`} />
          <span className={`${active ? '' : 'text-secondary'} `}>{time}</span>
        </div>
      </div>
    </>
  )
}
