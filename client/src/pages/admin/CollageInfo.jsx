import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { TabsLinks } from '../../stories/Tabs/Tabs'
 
import { BsStack } from 'react-icons/bs'
import { Tabs } from '@mantine/core'
import { AboutCollage, Subjects } from './index'
import Majors from './Majors'
import { IconBathFilled, IconMoodAngry } from '@tabler/icons-react'
import { IconSubtask } from '@tabler/icons-react'
import { RiCollageFill, RiCollageLine, RiMoreLine } from 'react-icons/ri'
import { MdClass, MdKingBed, MdOutlineGolfCourse, MdSubject } from 'react-icons/md'
import { FaBookOpen } from 'react-icons/fa'
import { TbLayoutCollage } from 'react-icons/tb'
import { BiCategory } from 'react-icons/bi'
import { FiInfo } from 'react-icons/fi'
import { GrInfo } from 'react-icons/gr'
import { GoBook } from 'react-icons/go'
import { FaLandmarkDome } from "react-icons/fa6";


export default function CollageInfo({
queryClient
}) {
  const tabs = [
    {
      name: 'معلومات الكلية',
      icon: GrInfo,
      to: '.',
    },
    {
      name: 'التخصصات',
      icon: FaLandmarkDome,
      to: 'majors',
    },
    {
      name: 'المواد',
      icon: GoBook,
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
