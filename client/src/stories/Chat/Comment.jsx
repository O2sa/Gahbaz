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

import avatar2 from '../../assets/images/avatars/2.jpg'

import { TbPointFilled } from 'react-icons/tb'
import { TiMessages } from 'react-icons/ti'
export const Comment = ({
  comment = {
    userName: ' أحمد قاسم ',
    profile: '',
    comment:
      ', بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهل',
    time: '2 أسبوع مضى ',
  },
  ...props
}) => {
  const [formData, setFormData] = useState({
    comment: '',
  })
  function handleSubmit(event) {
    event.preventDefault()
    console.log('formData', formData)
    setVisible(false)
  }
  function handlChange(event) {
    let { name, type, checked, value, id } = event.target
    // console.log('event', name, type, checked, value, id)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
    // console.log(formData)
  }
  const [visible, setVisible] = useState(false)

  return (
    <>
      <div className="d-flex align-items-top mb-4" {...props}>
        <div className="me-2">
          <CAvatar size="md" className="" src={avatar2} />
        </div>
        <div className="">
          <div style={{ fontSize: '12px' }} className="fw-light  ms-2 ">
            <span> {comment.userName}</span>
            <TbPointFilled className="mx-2" />
            <span className="text-secondary">{comment.time}</span>
          </div>
          <div className="mt-2 mb-1">{comment.comment}</div>
          <div onClick={() => setVisible(true)}>
            <TiMessages className="me-2" />
            <span>رد</span>
          </div>
        </div>
      </div>
      <div className={`${visible ? 'd-flex' : 'd-none'} align-items-center mb-4`}>
        <div className="flex-grow-1 me-2">
          <CFormInput
            type="text"
            name="comment"
            value={formData.comment}
            id={``}
            placeholder="أضف متطلب للدورة"
            onChange={handlChange}
            // required
          />{' '}
        </div>
        <div>
          <CButton onClick={handleSubmit} size="lg" className="">
            إضافة رد
          </CButton>
        </div>
      </div>{' '}
    </>
  )
}
