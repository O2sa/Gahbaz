import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { TabsLinks } from '../../stories/Tabs/Tabs'
 
import { BsStack } from 'react-icons/bs'
import { Tabs } from '@mantine/core'
import { AboutCollage, Subjects } from '..'
import Majors from './Majors'
import { IconBathFilled, IconMoodAngry } from '@tabler/icons-react'
import { IconSubtask } from '@tabler/icons-react'

export default function CollageInfo({
queryClient
}) {
  const tabs = [
    {
      name: 'معلومات الكلية',
      icon: BsStack,
      to: '.',
    },
    {
      name: 'التخصصات',
      icon: IconBathFilled,
      to: 'majors',
    },
    {
      name: 'المواد',
      icon: IconSubtask,
      to: 'subjects',
    },
  ]
  const Panels = () => (
    <>
      <Tabs.Panel value="about" pt="xs">
        <AboutCollage queryClient={queryClient} />{' '}
      </Tabs.Panel>
      <Tabs.Panel value="Majors" pt="xs">
        <Majors queryClient={queryClient} />{' '}
      </Tabs.Panel>
      <Tabs.Panel value="subjects" pt="xs">
        <Subjects queryClient={queryClient} />{' '}
      </Tabs.Panel>
    </>
  )
  
  return <TabsLinks Panels={Panels} tabs={tabs} />
}
