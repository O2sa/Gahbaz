import React, { useEffect } from 'react'


import { TabsLinks } from '../../components/TabsLinks'

import { BsStack } from 'react-icons/bs'

import { useParams } from 'react-router-dom'
import { Tabs } from '@mantine/core'
import { AboutMajor, SemestersTemplate } from './index'
import { IconFileAnalytics, IconInfoOctagon } from '@tabler/icons-react'

export default function MajorInfo({ queryClient }) {
  const tabs = [
    {
      name: 'معلومات التخصص',
      icon: IconInfoOctagon,
      to: '.',
    },
    {
      name: 'الخطة الدراسية (قوالب الفصول)',
      icon: IconFileAnalytics,
      to: 'semesterTemplates',
    },
  ]

  return <TabsLinks tabs={tabs} />
}
