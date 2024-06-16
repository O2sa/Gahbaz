import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify';

import CardsGroup from '../../stories/SpecialComponents/CardsGroup'
import AddCollage from './AddCollage'
import { TabsBody } from '../../stories/Tabs/TabsBody'
import { redirect, useLoaderData } from 'react-router-dom'
import customFetch from '../../utils/customFetch'
import { Button, Group, Skeleton, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import EditCollage from './EditCollage'
import { CSpinner } from '@coreui/react'
import { CardLoader, NoData } from '../LoadingComponents'
import { Helmet } from 'react-helmet'

const collagesQuery = () => ({
  queryKey: ['collages'],
  queryFn: async () => {
    const { data } = await customFetch.get('/collages')
    return data
  },
})

export const loader = (queryClient) => async () => {
  try {
    await queryClient.ensureQueryData(useGetElements(['collages']))
    return null
  } catch (error) {
    return redirect('/')
  }
}

export default function Collages({ queryClient }) {
  const {
    data: collages = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['collages']))
  //console.log('isLoading', isLoadingTeachers)
  //console.log('isFetching', isFetchingTeachers)


  
  const loadingComponent = (
    <Group>
      <Skeleton height={50} mb="xl" />
    </Group>
  )
  if (isFetchingTeachers || isLoadingTeachers) {
    return (
      <div className="bg-white h-100" style={{ minHeight: '50vh' }}>
        <div
          className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
        >
          <h5>{' الكليات'} </h5>
          <AddCollage queryClient={queryClient} />
        </div>
        <CardLoader />
      </div>
    )
  }

  if (collages.length == 0) {
    return (
      <div className="bg-white h-100" style={{ minHeight: '50vh' }}>
                               <Helmet>
            <title>{ 'منصة جهبذ | الكليات' }</title>
      </Helmet>
        <div
          className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
        >
          <h5>{' الكليات'} </h5>
          <AddCollage queryClient={queryClient} />

          {/* Render the popover/modal */}
        </div>
        <NoData />
      </div>
    )
  }

  return (
    <div className="bg-white h-100" style={{ minHeight: '50vh' }}>
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{' الكليات'} </h5>
        <AddCollage queryClient={queryClient} />

        {/* Render the popover/modal */}
      </div>
      <div className="m-4 mt-5">
        <CardsGroup
          queryClient={queryClient}
          items={collages}
          collection={['collages']}
          EditComponent={EditCollage}
        />
      </div>
    </div>
  )
}
