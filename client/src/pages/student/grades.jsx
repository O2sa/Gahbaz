/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  MyText,
  GradesTableDesktop,
  GradesTablePhone,
  FlexRaw,
  StatusBadge,
  TitleAndSub,
} from '../mycomponents/components'
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

import {
  CourseGradeW,
  StudentData,
  arWords,
  desktopTableData,
  phoneTableData,
  wordsData,
} from '../utils/Data'
var gradesTotal = []
// eslint-disable-next-line no-restricted-globals
const seasonsGrades = StudentData.grades.map(function (item, index) {
  gradesTotal.push({ seasonTatal: 0, coursesTotal: [] })
  return item.courses.map(function (course) {
    var currentCourse = Object.values(course.courseGrades)
    gradesTotal[index].seasonTatal += CourseGradesSum(currentCourse)
    gradesTotal[index].coursesTotal.push(CourseGradesSum(currentCourse))
    return [course.courseName, ...currentCourse, CourseGradesSum(currentCourse)]
  })
})
const seasonsGradesPhone = StudentData.grades.map(function (item, index) {
  return item.courses.map(function (course) {
    var currentCourse = Object.values(course.courseGrades)
    return [[course.courseName, CourseGradesSum(currentCourse)], currentCourse]
  })
})
// console.log(SumGrade(StudentData.grades[0].courses))
const Grades = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h3>{arWords.Grades}</h3>
          {/* <DocsLink href="https://coreui.io/docs/utilities/colors/" /> */}
        </CCardHeader>
      </CCard>
      {StudentData.grades.map((item, index) => (
        // eslint-disable-next-line react/jsx-key
        <div className="vstack gap-3 m-2">
          <FlexRaw
            items={[
              TitleAndSub({ txt: item.season }, { txt: 'عدد الدورات: ' + item.courses.length }),
              <>
                <h5>مجموع الدرجات: {gradesTotal[index].seasonTatal}</h5>
              </>,
              <>
                <CWidgetStatsF
                  className="border-0"
                  color="success"
                  icon={icon}
                  title="النسبة المئوية"
                  value={`${Math.trunc(
                    gradesTotal[index].seasonTatal / gradesTotal[index].coursesTotal.length,
                  )}%`}
                />
              </>,
            ]}
          />
          <div className="d-flex flex-wrap">
            {screenWidth > 768 ? (
              <GradesTableDesktop
                desktopTableData={{
                  header: Object.values(CourseGradeW),
                  body: seasonsGrades[index],
                }}
              />
            ) : (
              seasonsGradesPhone[index].map((course) => (
                <GradesTablePhone data={{ header: course[0], body: course[1] }} />
              ))
            )}
          </div>
        </div>
      ))}
    </>
  )
}

function CourseGradesSum(courseGrades) {
  var courseSum = courseGrades.reduce((acc, deg) => acc + deg, 0)
  return courseSum
}
var icon = <CIcon icon={cilChartPie} height="24" />

// function
export default Grades
