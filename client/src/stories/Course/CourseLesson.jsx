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

import { MdOutlineChecklist } from 'react-icons/md'
export const CourseLesson = ({ ...props }) => {
  const courses = {
    name: 'برمجة المتحكمات',
    secince: 'البرمجة المتقدمة',
    semester: 'الفصل السابع',
    compeleted: false,
    teacher: 'علي قاسم',
  }
  return (
    <>
      <CRow>
        <CRow>
          <div>
            <CCardImage orientation="top" src={docsImg} />
          </div>
          <div>
            <h3 className="my-3">تصميم وتحليل النظم الادارية</h3>
          </div>
          <div className="d-flex align-items-center mb-1">
            <div className="position-relative">
              <CAvatar size="sm" className="" src={avatar2} />
              <CAvatar
                size="sm"
                className="position-absolute top-0"
                style={{ right: '15px' }}
                src={avatar2}
              />
            </div>
            <div style={{ fontSize: '12px' }} className="fw-light  ms-4 ">
              <span className="text-secondary">المحاضر</span>
              <p>أحمد قاسم * علي صالح</p>
            </div>
          </div>
        </CRow>
        <CRow>
          <div>
            <CNav variant="tabs" className="p-0" role="tablist">
              <Tab label={'المادة'} activeKey={1} />
              <Tab label={'المادة'} activeKey={2} />
              <Tab label={'المادة'} activeKey={3} />
              <Tab label={'المادة'} activeKey={4} />
            </CNav>
          </div>
        </CRow>
        <CRow>
          <div className="my-4">
            <h5>عن المحاضرة</h5>
            <p>
              معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
              نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
              جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون
              سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن
              يكون سهلاً جداً و نحققه.معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل
              أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,
              بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في
              تحقيقه, بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق
              في تحقيقه, بل أن يكون سهلاً جداً و نحققه.
            </p>
          </div>
          <div className="my-4 ">
            <div className="d-flex justify-content-between mb-2">
              <h5 className="mb-2"> متطلبات الدورة</h5>
              <CButton className="text-primary border-0 bg-primary bg-opacity-10">
                <BsUpload className="me-2" />
                تحميل
              </CButton>
            </div>{' '}
            <p>
              معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
              نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
              جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون
              سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن
              يكون سهلاً جداً و نحققه.معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل
              أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,
              بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في
              تحقيقه, بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق
              في تحقيقه, بل أن يكون سهلاً جداً و نحققه.
            </p>
          </div>
          <div className="p-4 d-flex bg-primary bg-opacity-10  justify-content-between align-items-center my-4">
            <div className="d-flex align-items-center">
              <FaFileAlt size={'48'} className="me-3" />
              <div>
                <h6 className={''}> البرمجة المرئية</h6>
                <span className={`text-secondary fw-light`}>البرمجة المتقدمة</span>{' '}
              </div>{' '}
            </div>{' '}
            <CButton color="primary" name="requirements">
              <IoMdAdd />
              إضافة عنصر
            </CButton>
          </div>
        </CRow>
      </CRow>
    </>
  )
}
