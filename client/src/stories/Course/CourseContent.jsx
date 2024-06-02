import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CListGroup,
  CButton,
  CListGroupItem,
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCol,
  CFormInput,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'

import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { BiSolidVideos } from 'react-icons/bi'
import { IoIosPause } from 'react-icons/io'
import { PiPlayPauseFill } from 'react-icons/pi'
import { IoMdTime } from 'react-icons/io'
import { FaCheckSquare } from 'react-icons/fa'
import { MdBook, MdCheckCircleOutline } from 'react-icons/md'
import { Group, NavLink, Tabs, Text } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'
import { IconNotes } from '@tabler/icons-react'

export const CourseContent = ({ sections, setNextLesson, close, to, ...props }) => {
  const { lessonId } = useParams()

  console.log('lessonId', lessonId)

  const calCompeleted = (lessons) => {
    let time = 0

    lessons.map((item, idx) => {
      item.completed = false
      item.active = false
      time += item.video.duration + item.topic.readingTime

      if (lessonId == item._id) {
        const les = lessons[idx + 1]
        console.log('les', les)

        setNextLesson(les ? les._id : null)
      }
    })
    // return `(${completed}/${lessons.length})`
    return Math.floor(time)
  }

  return (
    <div>
      <CRow className=" m-2">
        <h4>محتويات الدورة</h4>
        {/* <CProgress height={16} className="p-0" color="success" value={25}>
          <CProgressBar>25%</CProgressBar>
        </CProgress> */}
      </CRow>
      <CRow>
        {sections.map((section, idx) => (
          // <CourseSection key={idx} section={section} />
          <CAccordion className="p-0" key={idx}>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>
                <div
                  className={`d-flex align-items-center flex-wrap justify-content-between w-100`}
                >
                  <Text>{`القسم ${idx + 1}: ${section.name}`}</Text>
                  <div>
                    <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
                    <span className={`me-3`}>{`${section.lessons.length} دروس`}</span>
                    <IoMdTime size={'20'} className={` me-2 text-warning`} />
                    <span className={`me-3`}>{calCompeleted(section.lessons)}</span>
                  </div>
                </div>{' '}
              </CAccordionHeader>
              <CAccordionBody className="p-0">
                {section.lessons.map((item, idx) => (
                  <Link
                    className="p-0"
                    onClick={() => (close ? close() : console.log('close'))}
                    to={`${to}${section._id}/${item._id}`}
                  >
                    <NavLink
                      p={'md'}
                      // component={Link}
                      // href={`/lessons/${section.course}/${section._id}/${item._id}`}
                      key={item._id}
                      active={item._id == lessonId}
                      label={item.name}
                      // description={item.description}
                      icon={<IconNotes />}
                      rightSection={
                        <Group>
                          <IoMdTime size={'20'} className={` me-2 text-warning`} />

                          <Text>
                            {Math.floor(item?.video?.duration) + item?.topic?.readingTime}د
                          </Text>
                        </Group>
                      }
                      // onClick={() => setActive(index)}
                      variant="light"
                    />
                  </Link>
                ))}
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        ))}
      </CRow>
    </div>
  )
}
