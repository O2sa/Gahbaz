/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
// import { wordsData } from ''
import CIcon from '@coreui/icons-react'
import ReactDataGrid from 'react-data-grid'
// import { Editors } from 'react-data-grid-addons'



import {
  MyText,
  GradesTableDesktop,
  GradesTablePhone,
  FlexRaw,
  StatusBadge,
  TitleAndSub,
  DataGridDemo,
  UserAvatar,
} from '../../mycomponents/index'

import {
  CAvatar,
  CFormInput,
  CButton,
  CButtonGroup,
  CCardFooter,
  CProgress,
  CModal,
  CModalBody,
  CModalContent,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAccordion,
  CAccordionItem,
  CAccordionBody,
  CAccordionHeader,
  CListGroupItem,
  CListGroup,
  CBadge,
  CWidgetStatsF,
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
  cilChartPie,
} from '@coreui/icons'

// import EditableTable from 'src/mycomponents/editableTable'

// console.log(SumGrade(StudentData.grades[0].courses))
const Courses = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h3>الدورات</h3>
        </CCardHeader>
      </CCard>
      <div className="courses">
        <div onClick={() => setVisible(!visible)}>
          {/* <FlexRaw
            items={[
              TitleAndSub(
                { txt: wordsData.courses[0], classes: '' },
                { txt: wordsData.callages[0], classes: '' },
              ),
              TitleAndSub(
                { txt: wordsData.carrers.cs, classes: 'fs-5' },
                { txt: wordsData.levels.four },
              ),
              TitleAndSub(
                { txt: wordsData.seasons.first, classes: 'fs-5' },
                { txt: wordsData.dates[0] },
              ),
              <h5>عدد الطلاب: 343</h5>,
            ]}
          />{' '} */}
        </div>
      </div>
      <StudentGrades visible={visible} setVisibl={setVisible} />
    </>
  )
}

const columns = [
  { field: 'id', headerName: '#', width: 90 },
  {
    field: 'name',
    headerName: 'الطالب',
    width: 150,
    editable: false,
  },
  {
    field: 'present',
    headerName: 'الحضور',
    // width: 150,
    editable: true,
    type: 'number',
  },
  {
    field: 'assignments',
    headerName: 'التكاليف',
    type: 'number',
    // width: 110,
    editable: true,
  },
  {
    field: 'middleExam',
    headerName: 'الإختبار النصفي',
    type: 'number',
    // width: 110,
    editable: true,
  },
  {
    field: 'practice',
    headerName: 'العملي',
    type: 'number',
    // width: 110,
    editable: true,
  },
  {
    field: 'finalExam',
    headerName: 'الإختبار النهائي',
    type: 'number',
    // width: 110,
    editable: true,
  },

  {
    field: 'total',
    headerName: 'المجموع',
    type: 'number',
    width: 110,
    editable: false,
    valueGetter: (params) =>
      params.row.present +
      params.row.assignments +
      params.row.middleExam +
      params.row.practice +
      params.row.finalExam,
  },
]

const rows = [
  {
    id: 1,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
  {
    id: 2,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
  {
    id: 3,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
  {
    id: 4,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
  {
    id: 5,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
  {
    id: 6,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
  {
    id: 7,
    name: 'أحمد علي صالح قاسم',
    present: 0,
    assignments: 0,
    middleExam: 35,
    practice: 0,
    finalExam: 0,
  },
]

// const rows = [
//   { id: 1, name: 'John', age: 25, email: 'john@example.com' },
//   { id: 2, name: 'Jane', age: 30, email: 'jane@example.com' },
//   { id: 3, name: 'Bob', age: 40, email: 'bob@example.com' },
// ]

// const columns = [
//   { key: 'id', name: 'ID' },
//   { key: 'name', name: 'Name', editable: true },
//   { key: 'age', name: 'Age', editable: true },
//   { key: 'email', name: 'Email', editable: true },
// ]

function StudentGrades({ visible, setVisibl }) {
  const [updatedRows, setUpdatedRows] = useState(rows)
  function handleCellUpdate({ rowIdx, idx, value }) {
    const updatedRow = { ...updatedRows[rowIdx], [columns[idx].key]: value }
    const newRows = [...updatedRows]
    newRows[rowIdx] = updatedRow
    setUpdatedRows(newRows)
  }

  return (
    <>
      <CModal
        size="xl"
        // backdrop="static"
        // alignment="center"
        scrollable
        visible={visible}
        // fullscreen
        onClose={() => setVisibl(false)}
        aria-labelledby="StaticBackdropExampleLabel"
        className="mh-100"
      >
        <h4 className="m-3">درجات الطلاب</h4>
        <CModalBody>
          <CFormInput
            className="mb-3"
            type="text"
            size="lg"
            placeholder="بحث"
            aria-label="lg input example"
          />
          {/* <ReactDataGrid
            columns={columns}
            rows={updatedRows}
            onCellUpdated={handleCellUpdate}
            enableCellSelect={true}
          /> */}
          {/* <EditableTable columns={columns} rows={rows} />{' '} */}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" size="lg" onClick={() => setVisibl(false)}>
            إغلاق
          </CButton>
          <CButton color="primary" size="lg">
            حفظ
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

// function
export default Courses
