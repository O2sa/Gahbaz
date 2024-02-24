import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CListGroup, CButton, CListGroupItem } from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { RiTable2 } from 'react-icons/ri'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, NavLink } from 'react-router-dom'
import Multiselect from 'multiselect-react-dropdown'
import { AddCourse } from './AddCourse'

export const SemesterDetails = ({
  title = 'البرمجة المرئية 01: الفصل الأول',
  k,
  clickHandller,
  activeKey,
  tabIcon,
  ...props
}) => {
  const { id } = useParams()
  // console.log(id)

  useEffect(() => {
    dispatch(asyncCrudThunks.semesters.getItemThunk(id))
    dispatch(asyncCrudThunks.courses.getItemsThunk())
  }, [])

  const onDelete = (value) => {
    // We're dispatching the Pinned event back to our store
    dispatch(asyncCrudThunks.courses.deleteItemThunk(value))
  }

  const items = useSelector((state) => {
    return state.collagesManagement.courses
  })

  const semsterTemp = useSelector((state) => {
    return state.collagesManagement.semester
  })

  const { status } = useSelector((state) => state.collagesManagement.status)
  const dispatch = useDispatch()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen)
  }

  const renderCards = () => {
    return items.map((item, idx) => (
      <CListGroupItem component="a" key={idx} className="m-2 w-auto border-1">
        <div className="d-flex justify-content-between">
          <NavLink to={`course/${item.id}`}>
            <div className="d-flex align-items-center">
              <RiTable2 size={'32'} className="me-3" />
              <div>
                <h5 className={''}> {item.name}</h5>
                <span className={`text-secondary`}> {item.secince}</span>{' '}
              </div>{' '}
            </div>
          </NavLink>
          <div className="d-flex align-items-center">
            <Link state={{ id: item.id }} to={`addCourse/${item.id}`}>
              <CiEdit size={'32'} />
            </Link>
            <AiTwotoneDelete onClick={() => onDelete(item.id)} size={'32'} className="me-2" />
          </div>
        </div>
      </CListGroupItem>
    ))
  }

  return (
    <CListGroup>
      <CListGroupItem className="m-2 border-0">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <RiTable2 size={'32'} className="me-3" />
            <div>
              <h4 className={''}>{semsterTemp && semsterTemp.name}</h4>
            </div>{' '}
          </div>
          <div className="d-flex align-items-center"></div>
        </div>
      </CListGroupItem>
      {renderCards()}
      <div className="d-flex flex-column ">
        <div className="mb-2">
          <Link to={'addCourse/new'}>
            <CButton className="w-100 fs-4" width={'auto'} color="primary">
              'إضافة'
            </CButton>
          </Link>
          {/* {isPopoverOpen && <AddCourse onClose={togglePopover} />} */}
        </div>
      </div>
    </CListGroup>
  )
}
