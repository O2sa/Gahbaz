import React, { useEffect } from 'react'

import { TabsLinks } from '../../components/TabsLinks'
 
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


export default function CollageInfo({ queryClient }) {
  const tabs = [
    {
      name: 'معلومات الكلية',
      icon: GrInfo,
      to: '.',
    },
    {
      name: 'التخصصات والأقسام',
      icon: FaLandmarkDome,
      to: 'majors',
    },
    {
      name: 'المواد الأكاديمية',
      icon: GoBook,
      to: 'subjects',
    },
  ]
  
  return <TabsLinks tabs={tabs} />
}
