import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { TabsLinks } from '../../stories/Tabs/Tabs'

import { BsStack } from 'react-icons/bs'

import { useParams } from 'react-router-dom'
import { Tabs } from '@mantine/core'
import { AboutMajor, SemestersTemplate } from '..'
import { IconFileAnalytics, IconInfoOctagon } from '@tabler/icons-react'

export default function MajorInfo({}) {
  const tabs = [
    {
      name: 'معلومات التخصص',
      icon: IconInfoOctagon,
      to: '.',
    },
    {
      name: 'قوالب الفصول',
      icon: IconFileAnalytics,
      to: 'semesterTemplates',
    },
  ]
  const Panels = () => (
    <>
      <Tabs.Panel value="about" pt="xs">
        <AboutMajor queryClient={queryClient} />{' '}
      </Tabs.Panel>
      <Tabs.Panel value="semesterTemplates" pt="xs">
        <SemestersTemplate queryClient={queryClient} />{' '}
      </Tabs.Panel>
    </>
  )
  return <TabsLinks panels={Panels} tabs={tabs} />
}
