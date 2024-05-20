import React, { useEffect, useState } from 'react'

import { Link, useLoaderData, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'

import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import { SemesterDetails } from '../../stories/SpecialComponents/SemesterDetails'
import { CSpinner } from '@coreui/react'

export default function AboutSemester({ collection, editModel, ...props }) {
  const { id } = useParams()

  const {
    data: semester = {},
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['semesters', id]))

  const {
    data: courses = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['courses']))

  // console.log(collage)

  if (isFetchingTeachers || isFetching) {
    return (
      <CSpinner color="primary" />
    )
  }

  return (
    <>
      <div className="p-4 row pb-5">
        <div className="col-md-6">
          {semester && (
            <>
              <div>
                <h5 className={''}>
                  {' '}
                  {semester.name}
                  <span className={`text-secondary fs-6`}>{' (خريف 2023)'} </span>{' '}
                </h5>
                <span className={`text-secondary`}>
                  {' '}
                  {`${semester.semester}، ${semester.level}`}
                </span>{' '}
              </div>{' '}
              <p>
                {semester.describtion}
                <div></div>
              </p>
            </>
          )}
        </div>
        <div className="col-md-6">
          <SemesterDetails semester={semester} courses={courses} />
        </div>
      </div>
    </>
  )
}
