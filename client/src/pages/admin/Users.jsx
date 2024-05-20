import React, { useEffect } from 'react'

import { TabsLinks } from '../../stories/Tabs/Tabs'

import { BsStack } from 'react-icons/bs'
import { IconAdjustmentsMinus, IconSchoolBell, IconUserBolt } from '@tabler/icons-react'

export default function Users({ queryClient }) {
  const tabs = [
    {
      name: 'المدراء',
      icon: IconAdjustmentsMinus,
      to: '.',
    },
    {
      name: 'المعلمون',
      icon: IconSchoolBell,
      to: 'teachers',
    },
    {
      name: 'الطلاب',
      icon: IconUserBolt,
      to: 'students',
    },

  ]

  return <TabsLinks tabs={tabs} />
}
