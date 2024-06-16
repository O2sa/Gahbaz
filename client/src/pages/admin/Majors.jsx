import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify';

import CardsGroup from '../../stories/SpecialComponents/CardsGroup'
import AddCollage from './AddCollage'
import { TabsBody } from '../../stories/Tabs/TabsBody'
import { useLocation, useParams } from 'react-router-dom'
import customFetch from '../../utils/customFetch'
import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import AddMajor from './AddMajor'
import EditMajor from './EditMajor'
import { CSpinner } from '@coreui/react'
import { CardLoader, NoData } from '../LoadingComponents'
import { Helmet } from 'react-helmet'

export default function Majors({ queryClient }) {
  const { id: collageId } = useParams()
  const {
    data: collages = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['majors', collageId]))

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
  if (collages.length==0) {
    return (
      <div className="bg-white h-100" style={{ minHeight: '50vh' }}>
        <div
          className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
        >
          <h5>{' الكليات'} </h5>
          <AddMajor queryClient={queryClient} />
        </div>
        <NoData />
      </div>
    )
  }

  return (
    <div className="bg-white h-100" style={{ minHeight: '50vh' }}>
                         <Helmet>
            <title>{ 'منصة جهبذ | التخصصات' }</title>
      </Helmet>
      <div
        className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
      >
        <h5>{'التخصصات '} </h5>
        <AddMajor queryClient={queryClient} />
        {/* Render the popover/modal */}
      </div>
      <div className="m-4 mt-5">
        <CardsGroup
          queryClient={queryClient}
          items={collages}
          collection={['majors', collageId]}
          EditComponent={EditMajor}
          // root={true}
        />
      </div>
    </div>
  )
}
