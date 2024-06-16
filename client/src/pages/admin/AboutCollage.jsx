import React, { useEffect, useState } from 'react'

import { Link, useLoaderData, useParams } from 'react-router-dom'

import { Button, Skeleton } from '@mantine/core'
import EditMajor from './EditMajor'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import EditCollage from './EditCollage'
import { Helmet } from 'react-helmet'

export default function AboutMajor({ queryClient, collection, editModel, ...props }) {
  const { id: collageId } = useParams()

  const {
    data: data = [],
    isError,
    isFetching,
    isLoading,
  } = useQuery(useGetElements(['collages', collageId]))

  const editCom = (
    <Button loading={isFetching} type="submit">
      تعديل
    </Button>
  )

  if (isFetching || isLoading) {
    return (
      <>
        <div
          className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
        >
          <h5>{'عن الكلية'} </h5>
          <EditCollage component={editCom} data={data} queryClient={queryClient} />
        </div>
        <div className="p-4">
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </div>
      </>
    )
  }
  return (
    <>
               <Helmet>
            <title>{ 'منصة جهبذ | تفاصيل الكلية' }</title>
      </Helmet>
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >

        <h5>{'عن الكلية'} </h5>
        <EditCollage component={editCom} data={data} queryClient={queryClient} />
      </div>
      <div className="p-4">
        {data && (
          <>
            <h5>{data.name}</h5>
            <p>{data.describtion}</p>
          </>
        )}
      </div>
    </>
  )
}



