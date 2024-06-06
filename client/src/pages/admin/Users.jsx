import React, { useEffect } from 'react'

import { TabsLinks } from '../../stories/Tabs/Tabs'

import { BsStack } from 'react-icons/bs'
import { IconAdjustmentsMinus, IconSchoolBell, IconUserBolt } from '@tabler/icons-react'
import { MdAdminPanelSettings } from 'react-icons/md'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { PiStudent } from 'react-icons/pi'
import { RiAdminLine } from 'react-icons/ri'

export default function Users({ queryClient }) {
  const tabs = [
    {
      name: 'المدراء',
      icon: RiAdminLine,
      to: '.',
    },
    {
      name: 'المعلمون',
      icon: FaChalkboardTeacher,
      to: 'teachers',
    },
    {
      name: 'الطلاب',
      icon: PiStudent,
      to: 'students',
    },

  ]

  return <TabsLinks tabs={tabs} />
}
