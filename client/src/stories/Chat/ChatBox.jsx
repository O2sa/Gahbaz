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
import { FaFileAlt } from 'react-icons/fa'
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
import { BsUpload } from 'react-icons/bs'
import { TbPointFilled } from 'react-icons/tb'
import { MdOutlineChecklist } from 'react-icons/md'
import { TiMessages } from 'react-icons/ti'
import "react-chat-elements/dist/main.css"
import { MessageBox } from "react-chat-elements";
export const ChatBox = ({
 
  ...props
}) => {


  return (
    <MessageBox />
  )
}
