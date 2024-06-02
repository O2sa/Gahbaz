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
import { Menu, Button, Text, Popover, ActionIcon, Tooltip } from '@mantine/core'
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
  IconEdit,
  IconLetterSSmall,
  IconNotebook,
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
    <CListGroup className="bg-secondary bg-opacity-10 m-2 ">
      <CListGroupItem className="m-2 bg-transparent border-0">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <TbMenuOrder size={'32'} className="me-3" />
            <div>
              <Text size={'md'}>{`القسم 0${idx + 1}: ${section.name}`}</Text>
            </div>{' '}
          </div>
          <div className="d-flex align-items-center">
            <AddLesson sectionId={section._id} queryClient={queryClient}>
              <Tooltip label="add">
                <ActionIcon size={'xl'}>
                  <IoMdAdd style={{ width: '70%', height: '70%' }} />
                </ActionIcon>
              </Tooltip>
            </AddLesson>
            <AddSection queryClient={queryClient} edit={true} section={section}>
              <Tooltip label="add">
                <ActionIcon size={'xl'}>
                  <IconEdit style={{ width: '70%', height: '70%' }} />
                </ActionIcon>
              </Tooltip>
            </AddSection>
            <DeleteSection queryClient={queryClient} sectionId={section._id}>
              <Tooltip label="add">
                <ActionIcon size={'xl'}  >
                  <AiTwotoneDelete style={{ width: '70%', height: '70%' }} />
                </ActionIcon>
              </Tooltip>
            </DeleteSection>
          </div>
        </div>
      </CListGroupItem>
      {section?.lessons?.map((lesson, index) => (
        <CListGroupItem key={index} className="m-2 mx-4 py-3 border-1 w-auto">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <IconNotebook size={'32'} className="me-3 text-secondary" />
              {/* <CAvatar size="md" className="me-3" src={avatar2} /> */}
              <div>
                <Text > {lesson.name}</Text>
                {/* <span className={`text-secondary`}> {item.id}</span>{' '} */}
              </div>{' '}
            </div>
            <div className="d-flex align-items-center">
              <CDropdown className="me-2">
                <CDropdownToggle >المحتويات </CDropdownToggle>
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
                <Tooltip label="add">
                  <ActionIcon size={'xl'}>
                    <IconEdit style={{ width: '70%', height: '70%' }} />
                  </ActionIcon>
                </Tooltip>
              </AddLesson>
              <DeleteLesson sectionId={section._id} queryClient={queryClient} lessonId={lesson._id}>
                <Tooltip label="add">
                  <ActionIcon size={'xl'}>
                    <AiTwotoneDelete style={{ width: '70%', height: '70%' }} />
                  </ActionIcon>
                </Tooltip>
              </DeleteLesson>
            </div>
          </div>
        </CListGroupItem>
      ))}
    </CListGroup>
  )
}
