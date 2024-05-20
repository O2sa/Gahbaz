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
import { IconDashboard, IconManualGearbox, IconSection, IconUsers } from '@tabler/icons-react'
const adminNavs = [
  //admin
  {
    component: CNavItem,
    name: 'لوحة التحكم',
    to: '.',
    icon: <IconDashboard className='me-4'/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'إدارة الكليات',
    to: '/collages',
    icon: <IconManualGearbox className='me-4'/>,
  },
  
  {
    component: CNavItem,
    name: 'الفصول الدراسية',
    to: '/semesters',
    icon: <IconSection className='me-4'/>,
  },
  {
    component: CNavItem,
    name: 'ادارة المستخدمين',
    to: 'users',
    icon: <IconUsers className='me-4'/>,
  },
  //student
  // {
  //   component: CNavItem,
  //   name: 'الدورات - الطالب',
  //   to: '/courses',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'الدرجات - الطالب',
  //   to: '/grades',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'الحساب - الطالب',
  //   to: '/profile',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavTitle,
  //   name: 'الدورات والأقسام',
  // },
  // {
  //   component: CNavItem,
  //   name: 'الدورات والأقسام',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Base',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'الإعدادات',
  //   to: '/admin/test',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
]

const teacherNavs = [
  {
    component: CNavItem,
    name: 'لوحة التحكم',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'الدورات',
    to: '/teacher/courses',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'ادارة المستخدمين',
  //   to: '/',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'ادارة المستخدمين',
  //   to: '/',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
]

const studentNavs = [
  {
    component: CNavItem,
    name: 'لوحة التحكم',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: ' الدورات',
    to: '/courses',
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: ' الدرجات',
    to: '/grades',
    icon: <CIcon icon={cilInstitution} customClassName="nav-icon" />,
  },
]
export default function getNavs() {
  // const UserRole = localStorage.getItem('user')
  const UserRole = 'admin'
  if (UserRole == 'admin') {
    return adminNavs
  } else if (UserRole == 'teacher') {
    return teacherNavs
  } else if (UserRole == 'student') {
    return studentNavs
  }
}
