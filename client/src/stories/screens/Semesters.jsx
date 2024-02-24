import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { Tabs } from '../Tabs/Tabs'
import { TabsBody } from '../Tabs/TabsBody'
import stackIcon from '../assets/Stack.svg'

import CardsGroup from '../SpecialComponents/CardsGroup'
import { AddCollage } from './AddCollage'
import { AddField } from './AddField'
import { useParams } from 'react-router-dom'

export default function Semesters({}) {
  const dispatch = useDispatch()

  const { id } = useParams()
  useEffect(() => {
    dispatch(asyncCrudThunks.fields.getItemsThunk())
  }, [])

  const status = useSelector((state) => {
    return state.collagesManagement.status
  })

  const collage = useSelector((state) => {
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
  const tabs = [
    {
      name: 'معلومات الكلية',
      icon: stackIcon,
      to: '.',
    },
    {
      name: 'التخصصات',
      icon: stackIcon,
      to: 'semesterTemplates',
    },
  ]
  return <Tabs tabs={tabs} />
}
