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

import { Comment } from './Comment'
export const Comments = ({
  comments = [
    {
      userName: ' أحمد قاسم ',
      profile: '',
      comment:
        ', بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهل',
      time: '2 أسبوع مضى ',
      replies: [
        {
          userName: ' أحمد قاسم ',
          profile: '',
          comment:
            ', بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهل',
          time: '2 أسبوع مضى ',
        },
        {
          userName: ' أحمد قاسم ',
          profile: '',
          comment:
            ', بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهل',
          time: '2 أسبوع مضى ',
        },
      ],
    },
    {
      userName: ' أحمد قاسم ',
      profile: '',
      comment:
        ', بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال ج بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال ج بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهل',
      time: '2 أسبوع مضى ',
    },
  ],
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
  const replies = (replies) => {
    return (
      <div className="ps-5">
        {' '}
        {replies.map((reply) => (
          <Comment comment={reply} />
        ))}{' '}
      </div>
    )
  }

  return (
    <CRow>
      <div>
        {comments.map((item, idx) => (
          <>
            <Comment comment={item} />
            {item.replies ? replies(item.replies) : ''}
          </>
        ))}
      </div>
      <div className={`d-flex align-items-center mb-4`}>
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
    </CRow>
  )
}
