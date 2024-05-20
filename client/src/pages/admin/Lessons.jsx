import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../../stories/components/Model'
import {
  CCol,
  CRow,
  CForm,
  CFormControlValidation,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormFeedback,
  CFormCheck,
  CButton,
  CFormTextarea,
  CFormInput,
  CPopover,
  CSpinner,
} from '@coreui/react'

import { CourseContent } from '../../stories/Course/CourseContent'

import { MdFolderCopy } from 'react-icons/md'
import { FaArrowRight } from 'react-icons/fa'
import { AiTwotoneCheckSquare } from 'react-icons/ai'
import { MdCheckBoxOutlineBlank } from 'react-icons/md'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { BiSolidVideos } from 'react-icons/bi'
import { IoIosPause } from 'react-icons/io'
import { PiPlayPauseFill } from 'react-icons/pi'
import { IoMdTime } from 'react-icons/io'
import { Link, Outlet, useParams } from 'react-router-dom'
import { useGetElements } from '../crud'
import { useQuery } from '@tanstack/react-query'
import { TabsLinks } from '../../stories/Tabs/Tabs'
import { BsStack } from 'react-icons/bs'

export default function Lessons({ ...props }) {
  const { courseId, lessonId } = useParams()
  // console.log('courseId', courseId)
  // console.log('lessonId', lessonId)

  const {
    data: course = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['courses', courseId]))

  if (isFetching || isLoading) {
    return (
      <CSpinner color="primary" />

    )
  }

  const [nextLesson, setNextLesson] = useState(null)
  return (
    <>
      <div>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <Link to={`/courses/${courseId}`}>
              <div
                className="bg-white rounded-circle me-3 d-flex justify-content-center align-items-center"
                style={{ height: '50px', width: '50px' }}
              >
                <FaArrowRight size={'16'} />
              </div>
            </Link>
            <div>
              <h4> {course.name}</h4>
              <div>
                <div>
                  <MdFolderCopy size={'20'} className={` me-2 text-primary`} />
                  <span className={`me-3`}>{`${course.sections.length} أقسام `}</span>
                  {/* <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
                  <span className={`me-3`}>{`الدورات محاضرات`}</span>
                  <IoMdTime size={'20'} className={` me-2 text-warning`} />
                  <span className={`me-3`}>{`الدورات`}</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between g-2">
            {/* <CButton size="lg" className="d-none d-md-inline me-1   bg-white text-primary border-0">
              {' '}
              كتابة تعليق
            </CButton> */}
            {nextLesson ? (
              <Link to={nextLesson}>
                <CButton className="" size="lg">
                  الدرس التالي
                </CButton>
              </Link>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="p-4 row">
          <div className="bg-white col-sm-12 col-xl-8">
            {/* <CourseLesson lesson={course?.sections[0]?.lessons[0]} /> */}
            <Outlet context={course.sections} />
          </div>
          <div className="col d-sm-none d-xl-block ">
            {course.sections ? (
              <CourseContent setNextLesson={setNextLesson} sections={course.sections} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  )

  // const tabs = [
  //   {
  //     name: 'hhhh',
  //     icon: BsStack,
  //     to: '.',
  //   },
  //   {
  //     name: 'lessons',
  //     icon: BsStack,
  //     to: 'lessons',
  //   },
  //   {
  //     name: 'students',
  //     icon: BsStack,
  //     to: 'students',
  //   },
  // ]

  // return <TabsLinks tabs={tabs} />
}
