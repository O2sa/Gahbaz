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
import { Link, Outlet, useLoaderData, useParams } from 'react-router-dom'
import { useGetElements } from '../crud'
import { useQuery } from '@tanstack/react-query'
import { TabsLinks } from '../../stories/Tabs/Tabs'
import { BsStack } from 'react-icons/bs'
import { Box, Button, Drawer, Grid, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(useGetElements([`courses`, params.courseId]))
      return params.courseId
    } catch (error) {
      console.error(error?.response?.data?.msg)
      // return redirect('/dashboard/all-jobs');
    }
  }

export default function Lessons({ ...props }) {
  // const { courseId } = useParams()
  // console.log('courseId', courseId)
  // console.log('lessonId', lessonId)

  const courseId = useLoaderData()
  const {
    data: course = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['courses', courseId]))

  if (isLoading) {
    return <CSpinner color="primary" />
  }

  const [nextLesson, setNextLesson] = useState(null)
  const [opened, { open, close }] = useDisclosure(false)
  // console.log('nextLesson', nextLesson)

  const getLessonsNum = course?.sections?.reduce(
    (acc, section) => acc + section?.lessons?.length,
    0,
  )

  const courseSyllbus = (
    <CourseContent close={close} setNextLesson={setNextLesson} to={''} sections={course.sections} />
  )
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
                  <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
                  <span className={`me-3`}>{`${getLessonsNum} دروس`}</span>
                  {/* <IoMdTime size={'20'} className={` me-2 text-warning`} />
                  <span className={`me-3`}>{`الدورات`}</span> */}
                </div>
              </div>
            </div>
          </div>

          <Group position='right' >
            <div className="d-block d-xl-none">
              <Button onClick={open} variant="default" color="brand">
                محتويات الدورة
              </Button>
            </div>

            {nextLesson ? (
              <Link to={nextLesson}>
                <Button className="" >
                  الدرس التالي
                </Button>
              </Link>
            ) : (
              ''
            )}
          </Group>
        </div>
        <Grid>
          <Grid.Col bg={'white'} sx={{ minHeight: '100vh' }} span={12} lg={9} gap={'md'} p={'md'}>
            {getLessonsNum > 0 ? (
              <Outlet context={course.sections} />
            ) : (
              <Text> لا يوجد دروس بعد</Text>
            )}
          </Grid.Col>

          <Grid.Col span={12} lg={3}>
            {course.sections && course.sections.length > 0 && getLessonsNum > 0 ? (
              <>
                {' '}
                <div className=" d-none d-xl-block ">{courseSyllbus} </div>
                <div className="d-block d-xl-none">
                  <Drawer
                    position="right"
                    opened={opened}
                    overlayProps={{ opacity: 0.5, blur: 4 }}
                    onClose={close}
                    title=""
                  >
                    {courseSyllbus}
                  </Drawer>
                </div>
              </>
            ) : null}
          </Grid.Col>
        </Grid>
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
