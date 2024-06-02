import React from 'react'

import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilInstitution,
  cilFeaturedPlaylist,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import {
  IconBook,
  IconDashboard,
  IconManualGearbox,
  IconSection,
  IconTimeline,
  IconUsers,
} from '@tabler/icons-react'
import { RiProfileFill } from 'react-icons/ri'
import { BsChatDots } from 'react-icons/bs'

const publicNavs = [
  {
    component: CNavItem,
    name: 'لوحة التحكم',
    to: '.',
    icon: <IconDashboard className="me-4" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'الملف الشخصي',
    to: 'profile',
    icon: <RiProfileFill className="me-4" />,
  },
  {
    component: CNavItem,
    name: 'المحادثات',
    to: 'chat',
    icon: <BsChatDots className="me-4" />,
  },
]
const adminNavs = [
  // admin

  {
    component: CNavItem,
    name: 'إدارة الكليات',
    to: '/collages',
    icon: <IconManualGearbox className="me-4" />,
  },

  {
    component: CNavItem,
    name: 'الفصول الدراسية',
    to: '/semesters',
    icon: <IconSection className="me-4" />,
  },
  {
    component: CNavItem,
    name: 'ادارة المستخدمين',
    to: '/users',
    icon: <IconUsers className="me-4" />,
  },
]

const teacherNavs = [
  {
    component: CNavItem,
    name: 'الدورات',
    to: 'courses',
    icon: <IconBook className="me-4" />,
  },
]

const studentNavs = [
  {
    component: CNavItem,
    name: ' الدورات',
    to: 'courses',
    icon: <IconManualGearbox className="me-4" />,
  },

  {
    component: CNavItem,
    name: ' الدرجات',
    to: 'grades',
    icon: <IconSection className="me-4" />,
  },
]

export default function getNavs(user) {
  // console.log('user', user)
  if (user.__t == 'Admin') return [...publicNavs, ...adminNavs]

  if (user.__t == 'Teacher') return [...publicNavs, ...teacherNavs]

  if (user.__t == 'Student') return [...publicNavs, ...studentNavs]
}
