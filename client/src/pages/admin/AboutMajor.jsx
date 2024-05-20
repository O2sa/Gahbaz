import React, { useEffect, useState } from 'react'

import { Link, useLoaderData, useParams } from 'react-router-dom'

import { Button } from '@mantine/core'
import EditMajor from './EditMajor'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'

export default function AboutMajor({ queryClient, ...props }) {
  const { id: majorId } = useParams()

  const {
    data: major = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['majors','major', majorId]))

  console.log(major)
  const editCom = <Button type="submit">{isFetchingTeachers ? 'Creating...' : 'إنشاء'}</Button>

  return (
    <>
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{'عن التخصص'} </h5>
        <EditMajor component={editCom} data={major} queryClient={queryClient} />
      </div>
      <div className="p-4">
        {major && (
          <>
            <h5>{major.name}</h5>
            <p>{major.describtion}</p>
          </>
        )}
      </div>
    </>
  )
}
