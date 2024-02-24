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

export default function AboutField({ collection, editModel, ...props }) {
  const dispatch = useDispatch()

  const { id } = useParams()
  useEffect(() => {
    dispatch(asyncCrudThunks.fields.getItemsThunk())
  }, [])

  const status = useSelector((state) => {
    return state.collagesManagement.status
  })

  const field = useSelector((state) => {
    return state.collagesManagement.fields.find((item) => item.id == id)
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
        addModel={AddField}
        itemData={field}
        opt={'edit'}
        label={'تعديل'}
        title={'معلومات الكلية'}
      />
      <div className='p-4'>
        {field && (
          <>
            <h5>{field.name}</h5>
            <p>{field.describtion}</p>
          </>
        )}
      </div>
    </>
  )
}
