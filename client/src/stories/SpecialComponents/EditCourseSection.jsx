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
import avatar2 from 'src/assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import Model from '../components/Model'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useParams } from 'react-router-dom'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
export const EditCourseSection = ({
  section = {
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

  ...props
}) => {
  const { id } = useParams()

  const [formData, setFormData] = useState({
    name: section && section.name ? section.name : '',
    lessons: section && section.lessons ? section.lessons : [],
  })

  function handleSubmit(event) {
    event.preventDefault()
    console.log('formData', formData)
  }

  const updateArr = (arr, value, idx, name) => {
    console.log(arr)
    const index = parseInt(idx)
    arr[index][name] = value
    return arr
  }
  const addItemToArr = (arr) => {
    console.log(arr)
    arr.push('')
    return arr
  }

  function handlChange(event) {
    let { name, type, checked, value, id } = event.target
    console.log('event', name, type, checked, value, id)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name !== 'name' ? updateArr(prevFormData.lessons, value, id, name) : value,
    }))
    // console.log(formData)
  }

  function addElement(event) {
    let { name, type, checked, value, id } = event.target
    console.log('event', name, type, checked, value, id)
    const itemsArr = formData[name]
    // updatedSallybals[idx] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: addItemToArr(prevFormData[name]),
    }))
    console.log(formData)
  }
  const saveData = () => {
    console.log(formData)
  }

  return (
    <>
      <CListGroup className="bg-primary bg-opacity-10 m-2 ">
        <CListGroupItem className="m-2 bg-transparent border-0">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <TbMenuOrder size={'32'} className="me-3" />
              <div>
                <h4 className={''}>{`القسم 0${0 + 1}: ${section.name}`}</h4>
              </div>{' '}
            </div>
            <div className="d-flex align-items-center">
              <IoMdAdd onClick={addElement} size={'32'} className="me-2 text-secondary" />
              <Link to={`editSectionTitle/${id}`}>
                <div>
                  <CiEdit
                    name="editSectionTitle"
                    id="editSectionTitle"
                    key="editSectionTitle"
                    size={'32'}
                    className="me-2 text-secondary"
                  />
                </div>
              </Link>
              <AiTwotoneDelete name="deleteSection" size={'32'} className=" text-secondary" />
            </div>
          </div>
        </CListGroupItem>
        {formData.lessons.map((lesson, index) => (
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
                    <Link to={`uploadLessonVideo/${id}`}>
                      <CDropdownItem name="editLessonVideo" id={'editLessonVideo'}>
                        فيديو
                      </CDropdownItem>
                    </Link>
                    <Link to={`addLessonDescription/${id}`}>
                      <CDropdownItem name="editLessonFile" id={'editLessonFile'}>
                        رفع ملف
                      </CDropdownItem>
                    </Link>

                    <CDropdownItem name="editLessonDscription" id={'editLessonDscription'}>
                      وصف الدرس
                    </CDropdownItem>
                    <CDropdownItem name="editLessonNotes" id="editLessonNotes">
                      الملاحظات
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <CiEdit
                  name="editLessonTitle"
                  id={'editLessonTitle'}
                  size={'32'}
                  className="me-2 text-secondary"
                />
                <AiTwotoneDelete
                  name="deleteLesson"
                  id={'deleteLesson'}
                  size={'32'}
                  className=" text-secondary"
                />
              </div>
            </div>
          </CListGroupItem>
        ))}
      </CListGroup>
      <Outlet />
    </>
  )
}
