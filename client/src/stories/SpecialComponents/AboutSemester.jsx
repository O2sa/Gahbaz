import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SpecialCard } from './Specialcard'
import { CCol, CRow } from '@coreui/react'
import { getCollages } from 'src/apis/apis.mjs'
import { Link, useLoaderData, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { AddCollage } from '../screens/AddCollage'
import { AddField } from '../screens/AddField'
import { TabsBody } from '../Tabs/TabsBody'
import { SemesterTemplateDetails } from './SemesterTemplateDetails'
import { SemesterDetails } from './SemesterDetails'

export default function AboutSemester({ collection, editModel, ...props }) {
  const dispatch = useDispatch()

  const { id } = useParams()
  useEffect(() => {
    dispatch(asyncCrudThunks.semesters.getItemsThunk())
  }, [])

  const status = useSelector((state) => {
    return state.collagesManagement.status
  })

  const field = useSelector((state) => {
    return state.collagesManagement.semesters.find((item) => item.id == id)
  })

  // console.log(collage)

  if (status === 'loading') {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }

  return (
    <>
      <div className="p-4 row pb-5">
        <div className="col-md-6">
          {field && (
            <>
              <div>
                <h5 className={''}>
                  {' '}
                  {field.name}
                  <span className={`text-secondary fs-6`}>{' (خريف 2023)'} </span>{' '}
                </h5>
                <span className={`text-secondary`}> {`${field.field}، ${field.level}`}</span>{' '}
              </div>{' '}
              <p>
                {field.describtion}
                <div></div>
              </p>
            </>
          )}
        </div>
        <div className="col-md-6">
          <SemesterDetails />
        </div>
      </div>
    </>
  )
}
