import React, { useEffect, useState } from 'react'
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
  CFormInput,
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from '../../assets/images/avatars/2.jpg'
import { IoAdd, IoReorderFourOutline } from 'react-icons/io5'
import Model from '../components/Model'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useParams } from 'react-router-dom'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { AddLesson, AddSection, DeleteLesson, DeleteSection } from './EditCourseSections'
import { IoMdAdd } from 'react-icons/io'
import { Menu, Button, Text, Popover } from '@mantine/core'
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconVideo,
  IconWriting,
  IconTextCaption,
} from '@tabler/icons-react'
import { AddTextContent } from './AddTextContent'
import UploadVideo from './UploadVideo'

export const EditCourseSection = ({
  section,
  queryClient,
  idx,

  ...props
}) => {
  const { courseId } = useParams()

  const [opened, setOpened] = useState(false)

  return (
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
            <AddLesson sectionId={section._id} queryClient={queryClient}>
              {' '}
              <IoMdAdd size={'32'} className="me-2 text-secondary" />
            </AddLesson>
            <AddSection queryClient={queryClient} edit={true} section={section}>
              <CiEdit
                name="editSectionTitle"
                id="editSectionTitle"
                key="editSectionTitle"
                size={'32'}
                className="me-2 text-secondary"
              />
            </AddSection>
            <DeleteSection queryClient={queryClient} sectionId={section._id}>
              <AiTwotoneDelete name="deleteSection" size={'32'} className=" text-secondary" />
            </DeleteSection>
          </div>
        </div>
      </CListGroupItem>
      {section.lessons.map((lesson, index) => (
        <CListGroupItem component="a" key={index} className="m-2 py-3 border-1 w-auto">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <IoReorderFourOutline size={'32'} className="me-3 text-secondary" />
              {/* <CAvatar size="md" className="me-3" src={avatar2} /> */}
              <div>
                <h5 className={''}> {lesson.name}</h5>
                {/* <span className={`text-secondary`}> {item.id}</span>{' '} */}
              </div>{' '}
            </div>
            <div className="d-flex align-items-center">
              <CDropdown className='me-2'>
                <CDropdownToggle color="secondary">المحتويات </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href="#">
                    {' '}
                    <UploadVideo lesson={lesson} queryClient={queryClient} sectionId={section._id}>
                      <Button variant="white" leftIcon={<IconVideo size={14} />}>
                        فيديو
                      </Button>
                    </UploadVideo>
                  </CDropdownItem>
                  <CDropdownItem href="#">
                    {' '}
                    <AddTextContent
                      lesson={lesson}
                      sectionId={section._id}
                      queryClient={queryClient}
                    >
                      <Button variant="white" leftIcon={<IconTextCaption size={14} />}>
                        نص
                      </Button>
                    </AddTextContent>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>

              <AddLesson
                sectionId={section._id}
                queryClient={queryClient}
                edit={true}
                lesson={lesson}
              >
                {' '}
                <CiEdit
                  name="editLessonTitle"
                  id={'editLessonTitle'}
                  size={'32'}
                  className="me-2 text-secondary"
                />{' '}
              </AddLesson>
              <DeleteLesson sectionId={section._id} queryClient={queryClient} lessonId={lesson._id}>
                <AiTwotoneDelete
                  name="deleteLesson"
                  id={'deleteLesson'}
                  size={'32'}
                  className=" text-secondary"
                />{' '}
              </DeleteLesson>
            </div>
          </div>
        </CListGroupItem>
      ))}
    </CListGroup>
  )
}
