import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../components/Model'
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
} from '@coreui/react'

import { Input } from '../components/Input'
import { useDispatch } from 'react-redux'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { TabsBody } from '../Tabs/TabsBody'
import { AddCollage } from './AddCollage'
import AboutSemester from '../SpecialComponents/AboutSemester'
import { CourseInfo } from '../SpecialComponents/CourseInfo'
import { AddCourse } from '../SpecialComponents/AddCourse'
import { useParams } from 'react-router-dom'
import { CourseCard } from '../SpecialComponents/CourseCard'
import { CourseLesson } from '../Course/CourseLesson'
import { CourseContent } from '../Course/CourseContent'

import { MdFolderCopy } from 'react-icons/md'
import { FaArrowRight } from 'react-icons/fa'
import { AiTwotoneCheckSquare } from 'react-icons/ai'
import { MdCheckBoxOutlineBlank } from 'react-icons/md'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { BiSolidVideos } from 'react-icons/bi'
import { IoIosPause } from 'react-icons/io'
import { PiPlayPauseFill } from 'react-icons/pi'
import { IoMdTime } from 'react-icons/io'

export const Lesson = ({ ...props }) => {
  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div
            className="bg-white rounded-circle me-3 d-flex justify-content-center align-items-center"
            style={{ height: '50px', width: '50px' }}
          >
            <FaArrowRight size={'16'} />
          </div>
          <div>
            <h4>التصميم المستجيب</h4>
            <div>
              <div>
                <MdFolderCopy size={'20'} className={` me-2 text-primary`} />
                <span className={`me-3`}>{`الدورات`}</span>
                <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
                <span className={`me-3`}>{`الدورات محاضرات`}</span>
                <IoMdTime size={'20'} className={` me-2 text-warning`} />
                <span className={`me-3`}>{`الدورات`}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between g-2">
          <CButton size="lg" className="d-none d-md-inline   bg-white text-primary border-0">
            {' '}
            كتابة تعليق
          </CButton>
          <CButton className="" size="lg">
            الدرس التالي
          </CButton>
          <CPopover
            content={
              <CButton className="" size="lg">
                الدرس التالي
              </CButton>
            }
            placement="right"
            title="Custom popover"
            // style={customPopoverStyle}
          >
            <CButton color="secondary">Lessons</CButton>
          </CPopover>
        </div>
      </div>
      <div className="p-4 row">
        <div className="bg-white col-sm-12 col-xl-8">
          <CourseLesson />
        </div>
        <div className="col d-sm-none d-xl-block ">
          <CourseContent />
        </div>
      </div>
    </div>
  )
}
