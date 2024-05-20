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
import { Tabs } from '@mantine/core'
import { Link, NavLink, useParams } from 'react-router-dom'

export const CourseContent = ({ sections, setNextLesson, ...props }) => {
  const { lessonId } = useParams()
  const calCompeleted = (lessons) => {
    let time = 0

    lessons.map((item, idx) => {
      item.completed = false
      item.active = false
      time += item.video.duration + item.topic.readingTime

      if (lessonId == item._id) {
        const les = lessons[idx + 1]
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
          <CAccordion className="p-0" activeItemKey={idx}>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>
                <div
                  className={`d-flex align-items-center flex-wrap justify-content-between w-100`}
                >
                  <div className="mb-2">{section.name}</div>
                  <div>
                    <BiSolidVideos size={'20'} className={` me-2 text-primary`} />
                    <span className={`me-3`}>{`${section.lessons.length} محاضرات`}</span>
                    <IoMdTime size={'20'} className={` me-2 text-warning`} />
                    <span className={`me-3`}>{calCompeleted(section.lessons)}</span>
                    <IoCheckmarkDoneSharp size={'20'} className={` me-2 text-success`} />
                    {/* <span className={``}>
                      {`%${section.completed} إكتمل `}
                      <span className="text-secondary">{calCompeleted(section.lessons)}</span>
                    </span> */}
                  </div>
                </div>{' '}
              </CAccordionHeader>
              <CAccordionBody>
                {section.lessons.map((item, idx) => (
                  // <Tabs.Tab value={idx}>Second tab</Tabs.Tab>

                  <Link to={`/lessons/${section.course}/${section._id}/${item._id}`}>
                    <div
                      key={idx}
                      className={`d-flex align-items-center justify-content-between p-2 ${
                        item._id == lessonId ? 'bg-primary bg-opacity-25' : ''
                      }`}
                    >
                      <div>
                        <MdCheckCircleOutline
                          size={'16'}
                          className={`${
                            item._id == lessonId ? 'text-primary' : 'text-secondary'
                          } text-primary me-2`}
                        />
                        <span className={`${item._id == lessonId ? '' : 'text-secondary'} `}>
                          {item.name}{' '}
                        </span>
                      </div>
                      <div>
                        {/* <IoIosPause
                          size={'16'}
                          className={`${item._id == lessonId ? '' : 'text-secondary'} me-2`}
                        /> */}
                        <span className={`${item._id == lessonId ? '' : 'text-secondary'} `}>
                          {item.time}
                        </span>
                      </div>
                    </div>
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
