import React, { useEffect, useState } from 'react'
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

import avatar2 from '../../assets/images/avatars/2.jpg'

import { Tab } from '../Tabs/Tab'
import { MdOutlineChecklist } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { CourseContent } from '../Course/CourseContent'
import { Avatar, Center, Group, Image, Stack, Text, rem } from '@mantine/core'
import { CiImageOn } from 'react-icons/ci'
export default function CourseInfo({ course, ...props }) {
  return (
    course && (
      <CRow>
        <CRow>
          <div>
            <h3 className="mb-3">{course.name}</h3>
            <p>{course.subtitle}</p>
          </div>
          <Group mb={'md'}>
            <Avatar.Group>
              {course.teachers.map((val) => (
                <Avatar radius="xl" src={val.avatar} />
              ))}
            </Avatar.Group>

            <Stack sx={{ gap: '0' }}>
              <Text color="dimmed">االمعلم: </Text>
              <Text>
                {course.teacher ??
                  course?.teachers?.map(
                    (teacher, idx) =>
                      `${teacher.firstName} ${teacher.lastName} ${
                        idx + 1 !== course.teachers.length ? ' * ' : ''
                      }`,
                  )}
              </Text>
            </Stack>
          </Group>
          <Center>
            {course.cover && course.cover.length > 0 ? (
              <Image src={course.cover} />
            ) : (
              <CiImageOn className="w-50 h-100 text-secondary" />
              // <CiImageOn width={'100%'} height={'100%'} />
            )}
          </Center>
        </CRow>
        <CRow>
          {/* <div>
            <CNav variant="tabs" className="p-0" role="tablist">
              <Tab label={'المادة'} activeKey={1} />
              <Tab label={'المادة'} activeKey={2} />
              <Tab label={'المادة'} activeKey={3} />
              <Tab label={'المادة'} activeKey={4} />
            </CNav>
          </div> */}
        </CRow>
        <CRow>
          <div className="mt-4">
            <h5>عن الدورة</h5>
            <p>{course.describtion}</p>
          </div>
          <div className="mt-4 bg-success bg-opacity-10 p-4">
            <h5>ما الذي ستتععلمه في هذه الدورة؟</h5>
            <CRow className="">
              {course?.willLearn?.map((item) => (
                <CCol md={6} className="d-flex justify-content-top">
                  <div className="me-2">
                    <MdOutlineChecklist className="text-success" size={'32'} />
                  </div>
                  <p>{item}</p>
                </CCol>
              ))}
            </CRow>
          </div>
          <div className="mt-4">
            <h5>متطلبات الدورة</h5>
            <p>
              <ul>
                {course.requirements.map((item) => (
                  <li className="m-2">{item}</li>
                ))}
              </ul>
            </p>
          </div>

          <div className="my-4  ">
            <CourseContent to={'lessons/'} sections={course.sections} />
          </div>
        </CRow>
      </CRow>
    )
  )
}
