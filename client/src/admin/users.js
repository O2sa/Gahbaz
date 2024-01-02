import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import CIcon from '@coreui/icons-react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCardFooter,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

const tableExample = [
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
  {
    avatar: { src: avatar1, status: 'success' },
    user: {
      name: 'أحمد قاسم',
      new: true,
      registered: 'Jan 1, 2021',
    },
    id: '9485734753894',
    type: 'نوع المستخدم',
    action: { color: 'danger', name: 'حظر', icon: cibCcStripe },
    activity: 'منذ 10 ثوان مضت',
  },
]

const Colors = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          المستخدمون
          {/* <DocsLink href="https://coreui.io/docs/utilities/colors/" /> */}
        </CCardHeader>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">
                <CIcon icon={cilPeople} />
              </CTableHeaderCell>
              <CTableHeaderCell>مستخدم</CTableHeaderCell>
              <CTableHeaderCell className="text-center">المعرف الرقمي</CTableHeaderCell>
              <CTableHeaderCell>نوع المستخدم</CTableHeaderCell>
              <CTableHeaderCell className="text-center">حظر</CTableHeaderCell>
              <CTableHeaderCell>النشاظ</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tableExample.map((item, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                </CTableDataCell>
                <CTableDataCell>
                  <div>{item.user.name}</div>
                  <div className="small text-medium-emphasis">
                    <span>{item.user.new ? 'جديد' : 'قديم'}</span> | التسجيل: {item.user.registered}
                  </div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {/* <CIcon size="xl" icon={item.country.flag} title={item.country.name} /> */}
                  {item.id}
                </CTableDataCell>
                <CTableDataCell>{item.type}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton color={item.action.color}>{item.action.name}</CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="small text-medium-emphasis">آخر ظهور</div>
                  <strong>{item.activity}</strong>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCard>
    </>
  )
}

export default Colors
