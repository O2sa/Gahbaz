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
import { IconBook, IconDashboard, IconManualGearbox, IconSection, IconTimeline, IconUsers } from '@tabler/icons-react'
import { RiProfileFill } from 'react-icons/ri'
const adminNavs = [
  //admin
  // {
  //   component: CNavItem,
  //   name: 'لوحة التحكم',
  //   to: '.',
  //   icon: <IconDashboard className="me-4" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },
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
    to: 'users',
    icon: <IconUsers className="me-4" />,
  },
  {
    component: CNavItem,
    name: 'profile',
    to: 'profile',
    icon: <RiProfileFill className="me-4" />,
  },









]

const teacherNavs = [
  // {
  //   component: CNavItem,
  //   name: 'لوحة التحكم',
  //   to: '.',
  //   icon: <IconDashboard className="me-4" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },
  {
    component: CNavItem,
    name: 'الدورات',
    to: '/teacher/courses',
    icon: <IconBook className="me-4" />,
  },

  // {
  //   component: CNavItem,
  //   name: 'التقويم',
  //   to: '/schedules',
  //   icon: <IconTimeline className="me-4" />,
  // },
]

const studentNavs = [
  // {
  //   component: CNavItem,
  //   name: 'لوحة التحكم',
  //   to: '/student/dash',
  //   icon: <IconDashboard className="me-4" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },
  {
    component: CNavItem,
    name: ' الدورات',
    to: '/student/courses',
    icon: <IconManualGearbox className="me-4" />,
  },

  {
    component: CNavItem,
    name: ' الدرجات',
    to: '/student/grades',
    icon: <IconSection className="me-4" />,
  },
]


export default function getNavs(user) {
// console.log('user', user)
  if (user.__t == 'Admin') return adminNavs

  if (user.__t == 'Teacher') return teacherNavs

  if (user.__t == 'Student') return studentNavs
 
}
