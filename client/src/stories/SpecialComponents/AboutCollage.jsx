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

export default function AboutCollage({ collection, editModel, ...props }) {
  const dispatch = useDispatch()

  const { id } = useParams()
//   console.log('collage_id', id)
  useEffect(() => {
    dispatch(asyncCrudThunks.collages.getItemThunk(id))
  }, [])

  const status = useSelector((state) => {
    return state.collagesManagement.status
  })

  const collage = useSelector((state) => {
    // return state.collagesManagement.collages.find((item) => item.id == id)
    return state.collagesManagement.collage
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
      <TabsBody
        addModel={AddCollage}
        itemData={collage}
        opt={'edit'}
        label={'تعديل'}
        title={'معلومات الكلية'}
      />
      <div className='p-4'>
        {collage && (
          <>
            <h5>{collage.name}</h5>
            <p>{collage.describtion}</p>
          </>
        )}
      </div>
    </>
  )
}
