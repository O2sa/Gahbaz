import React, {useState} from 'react'
import PropTypes from 'prop-types'
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
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'

export const CourseSyllabus = ({
  sections = [
    {
      name: 'تعلم أساسيات البرمجة',
      lessons: [
        {
          name: 'ما هي البرمجة',
          video: '',
          notes: '',
          description: '',
          file: '',
        },
        {
          name: 'ما هي البرمجة',
          video: '',
          notes: '',
          description: '',
          file: '',
        },
      ],
    },
    {
      name: 'تعلم أساسيات البرمجة',
      lessons: [
        {
          name: 'ما هي البرمجة',
          video: '',
          notes: '',
          description: '',
          file: '',
        },
        {
          name: 'ما هي البرمجة',
          video: '',
          notes: '',
          description: '',
          file: '',
        },
      ],
    },
  ],
  ...props
}) => {

  return (
    <CRow>
      {sections.map((section, idx) => (
        <CListGroup className="bg-primary bg-opacity-10 m-2 ">
          <CListGroupItem className="m-2 bg-transparent border-0">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <TbMenuOrder size={'32'} className="me-3" />
                <div>
                  <h4 className={''}>{`القسم 0${idx + 1}: ${section.name}`}</h4>
                </div>{' '}
              </div>
              <div className="d-flex align-items-center">
                <IoMdAdd size={'32'} className="me-2 text-secondary" />
                <CiEdit size={'32'} className="me-2 text-secondary" />
                <AiTwotoneDelete size={'32'} className=" text-secondary" />
              </div>
            </div>
          </CListGroupItem>

          {items.map((lesson, index) => (
            <CListGroupItem component="a" key={index} className="m-2 py-3 border-1 w-auto">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <IoReorderFourOutline size={'32'} className="me-3 text-secondary" />
                  <CAvatar size="md" className="me-3" src={avatar2} />
                  <div>
                    <h5 className={''}> {lesson.name}</h5>
                    {/* <span className={`text-secondary`}> {item.id}</span>{' '} */}
                  </div>{' '}
                </div>
                <div className="d-flex align-items-center">
                  <CDropdown className="me-2">
                    <CDropdownToggle color="primary" className="">
                      المحتويات
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#">فيديو</CDropdownItem>
                      <CDropdownItem href="#">رفع ملف</CDropdownItem>
                      <CDropdownItem href="#">وصف الدرس</CDropdownItem>
                      <CDropdownItem href="#">الملاحظات</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                  <CiEdit size={'32'} className="me-2 text-secondary" />
                  <AiTwotoneDelete size={'32'} className=" text-secondary" />
                </div>
              </div>
            </CListGroupItem>
          ))}
        </CListGroup>
      ))}

      <div className="d-flex align-items-center mt-4">
        <CButton className="w-100  p-2 bg-opacity-10 fs-4" color="primary">
          إضافة
        </CButton>
      </div>
    </CRow>
  )
}
