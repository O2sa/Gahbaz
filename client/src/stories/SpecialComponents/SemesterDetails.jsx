import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CListGroup, CButton, CListGroupItem } from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { RiTable2 } from 'react-icons/ri'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, NavLink } from 'react-router-dom'
import Multiselect from 'multiselect-react-dropdown'

export const SemesterDetails = ({
courses,
semester,
  ...props
}) => {
  const { id } = useParams()






  const renderCards = () => {
    return courses.map((item, idx) => (
      <CListGroupItem component="a" key={idx} className="m-2 w-auto border-1">
        <div className="d-flex justify-content-between">
          <NavLink to={`/courses/${item._id}`}>
            <div className="d-flex align-courses-center">
              <RiTable2 size={'32'} className="me-3" />
              <div>
                <h5 className={''}> {item.name}</h5>
                <span className={`text-secondary`}> {item.category}</span>{' '}
              </div>{' '}
            </div>
          </NavLink>
          <div className="d-flex align-courses-center">
            <Link state={{ id: item.id }} to={`/courses/${item._id}/edit`}>
              <CiEdit size={'32'} />
            </Link>
            {/* <AiTwotoneDelete onClick={() => onDelete(item.id)} size={'32'} className="me-2" /> */}
          </div>
        </div>
      </CListGroupItem>
    ))
  }

  return (
    <CListGroup>
      <CListGroupItem className="m-2 border-0">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-courses-center">
            <RiTable2 size={'32'} className="me-3" />
            <div>
              <h4 className={''}>دورات الفصل</h4>
            </div>{' '}
          </div>
          <div className="d-flex align-courses-center"></div>
        </div>
      </CListGroupItem>
      {renderCards()}




      {/* <div className="d-flex flex-column ">
        <div className="mb-2">
          <Link to={'addCourse/new'}>
            <CButton className="w-100 fs-4" width={'auto'} color="primary">
              'إضافة'
            </CButton>
          </Link>
        </div>
      </div> */}
    </CListGroup>
  )
}
