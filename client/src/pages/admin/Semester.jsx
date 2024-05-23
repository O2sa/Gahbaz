import React, { useEffect, useState } from 'react'

import { Link, useLoaderData, useParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import { SemesterDetails } from '../../stories/SpecialComponents/SemesterDetails'
import { CSpinner } from '@coreui/react'

export default function Semester({ queryClient, ...props }) {
  const { semesterId } = useParams()

  const {
    data: semester = {},
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['semesters', semesterId]))

  const {
    data: courses = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
  } = useQuery(useGetElements(['courses', 'semester-courses', semesterId]))

  // console.log(collage)

  if (isFetchingTeachers || isFetching) {
    return <CSpinner color="primary" />
  }

  return (
    <div className="bg-white">
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{' تفاصيل الفصل'} </h5>
      </div>{' '}
      <div className="m-4 mt-5">
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
      </div>
    </div>
  )
}
