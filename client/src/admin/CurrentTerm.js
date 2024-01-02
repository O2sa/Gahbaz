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
    subject: { src: avatar2, status: 'success' },
    SubjectName: 'تحليل وتصميم',
    type: 'متطلب',
    id: '12d',
    teacher: ' صالح قاسم',
    field: 'CS/ الفصل السابع',
    action: { color: 'primary', name: 'تغيير المعلم' },
    duration: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
  },
  {
    subject: { src: avatar2, status: 'success' },
    SubjectName: 'تحليل وتصميم',
    type: 'متطلب',
    id: '12d',
    teacher: ' صالح قاسم',
    field: 'CS/ الفصل السابع',
    action: { color: 'primary', name: 'تغيير المعلم' },
    duration: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
  },
  {
    subject: { src: avatar2, status: 'success' },
    SubjectName: 'تحليل وتصميم',
    type: 'متطلب',
    id: '12d',
    teacher: ' صالح قاسم',
    field: 'CS/ الفصل السابع',
    action: { color: 'primary', name: 'تغيير المعلم' },
    duration: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
  },
  {
    subject: { src: avatar2, status: 'success' },
    SubjectName: 'تحليل وتصميم',
    type: 'متطلب',
    id: '12d',
    teacher: ' صالح قاسم',
    field: 'CS/ الفصل السابع',
    action: { color: 'primary', name: 'تغيير المعلم' },
    duration: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
  },
  {
    subject: { src: avatar2, status: 'success' },
    SubjectName: 'تحليل وتصميم',
    type: 'متطلب',
    id: '12d',
    teacher: ' صالح قاسم',
    field: 'CS/ الفصل السابع',
    action: { color: 'primary', name: 'تغيير المعلم' },
    duration: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
  },
  {
    subject: { src: avatar2, status: 'success' },
    SubjectName: 'تحليل وتصميم',
    type: 'متطلب',
    id: '12d',
    teacher: ' صالح قاسم',
    field: 'CS/ الفصل السابع',
    action: { color: 'primary', name: 'تغيير المعلم' },
    duration: {
      value: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      color: 'success',
    },
  },
]

const Colors = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          الدورات الحالية
          {/* <DocsLink href="https://coreui.io/docs/utilities/colors/" /> */}
        </CCardHeader>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">
                <CIcon icon={cifPl} />
              </CTableHeaderCell>
              <CTableHeaderCell>الدورة</CTableHeaderCell>
              <CTableHeaderCell className="text-center">المعرف الرقمي</CTableHeaderCell>
              <CTableHeaderCell> المعلم</CTableHeaderCell>
              <CTableHeaderCell className="text-center">تغيير المعلم</CTableHeaderCell>
              <CTableHeaderCell>النشاظ</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tableExample.map((item, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="md" src={item.subject.src} status={item.subject.status} />
                </CTableDataCell>
                <CTableDataCell>
                  <div>{item.SubjectName}</div>
                  <div className="small text-medium-emphasis">
                    <span>{item.type}</span>
                  </div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {/* <CIcon size="xl" icon={item.country.flag} title={item.country.name} /> */}
                  {item.id}
                </CTableDataCell>
                <CTableDataCell>{item.teacher}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton color={item.action.color}>{item.action.name}</CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="clearfix">
                    <div className="float-start">
                      <strong>{item.duration.value}%</strong>
                    </div>
                    <div className="float-end">
                      <small className="text-medium-emphasis">{item.duration.period}</small>
                    </div>
                  </div>
                  <CProgress thin color={item.duration.color} value={item.duration.value} />
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
