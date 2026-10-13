import React, { useState } from 'react'
import PropTypes from 'prop-types'

import CourseContent from '../../components/CourseContent'

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
import { Box, Button, Drawer, Grid, Group, Text, Loader, Center, ActionIcon, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Helmet } from 'react-helmet'

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
  const courseId = useLoaderData()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: course = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['courses', courseId]))

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  const courseData = course?.data || course
  const sections = courseData?.sections || []

  const [nextLesson, setNextLesson] = useState(null)
  const [opened, { open, close }] = useDisclosure(false)

  const getLessonsNum = sections.reduce(
    (acc, section) => acc + (section?.lessons?.length || 0),
    0,
  )

  const courseSyllbus = (
    <CourseContent close={close} setNextLesson={setNextLesson} to={''} sections={sections} />
  )
  return (
    <>
      <Helmet>
        <title>{`منصة جهبذ | ${courseData?.name || 'الدروس'}`}</title>
      </Helmet>
      <div>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <Group align="center">
            <ActionIcon
              component={Link}
              to={`/courses/${courseId}`}
              size={48}
              radius="xl"
              variant="default"
              mr="md"
            >
              <FaArrowRight size={16} />
            </ActionIcon>
            <div>
              <h4 style={{ color: isDark ? '#ffffff' : '#0f172a' }}>{courseData?.name}</h4>
              <div>
                <div>
                  <MdFolderCopy size={'20'} className={` me-2 text-primary`} />
                  <span className={`me-3`}>{`${sections.length} أقسام `}</span>
                  <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
                  <span className={`me-3`}>{`${getLessonsNum} دروس`}</span>
                </div>
              </div>
            </div>
          </Group>

          <Group position="right">
            <div className="d-block d-xl-none">
              <Button onClick={open} variant="default" color="brand">
                محتويات المقرر
              </Button>
            </div>

            {nextLesson ? (
              <Link to={nextLesson}>
                <Button>الدرس التالي</Button>
              </Link>
            ) : null}
          </Group>
        </div>
        <Grid>
          <Grid.Col
            sx={{
              minHeight: '100vh',
              backgroundColor: isDark ? 'rgba(26, 27, 30, 0.7)' : '#ffffff',
              borderRadius: 12,
              border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            }}
            span={12}
            lg={9}
            gap={'md'}
            p={'md'}
          >
            {getLessonsNum > 0 ? (
              <Outlet context={sections} />
            ) : (
              <Text color="dimmed">لا توجد دروس بعد</Text>
            )}
          </Grid.Col>

          <Grid.Col span={12} lg={3}>
            {sections.length > 0 && getLessonsNum > 0 ? (
              <>
                <div className="d-none d-xl-block">{courseSyllbus}</div>
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
