import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CHeaderDivider } from '@coreui/react'
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
  CListGroup,
  CListGroupItem,
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
          <h2>الدورات والأقسام</h2>
          {/* <DocsLink href="https://coreui.io/docs/utilities/colors/" /> */}
        </CCardHeader>
        <CHeaderDivider />
        <CRow>
          <CCardHeader>
            <h4>الدورات والأقسام</h4>
            {/* <DocsLink href="https://coreui.io/docs/utilities/colors/" /> */}
          </CCardHeader>
          <CCol sm={3}>
            <CListGroup>
              <CListGroupItem active>Cras justo odio</CListGroupItem>
              <CListGroupItem>Dapibus ac facilisis in</CListGroupItem>
              <CListGroupItem>Morbi leo risus</CListGroupItem>
              <CListGroupItem>Porta ac consectetur ac</CListGroupItem>
              <CListGroupItem>Vestibulum at eros</CListGroupItem>
            </CListGroup>
          </CCol>
        </CRow>
      </CCard>
    </>
  )
}

export default Colors
