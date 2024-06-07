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
import { MdDashboard } from 'react-icons/md'
import { AiOutlineDashboard } from "react-icons/ai";
import { TbUserSquare } from "react-icons/tb";
import { IoChatbubblesOutline } from "react-icons/io5";

import { PiCardsThreeBold } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUsersGear } from "react-icons/fa6";
import { PiBooksThin } from "react-icons/pi";
import { FaLandmark } from "react-icons/fa6";
import { GiLevelEndFlag } from "react-icons/gi";
import { useDashboardContext } from './layout/DefaultLayout'

const publicNavs = [
  {
    component: CNavItem,
    name: 'لوحة التحكم',
    to: '.',
    icon: <AiOutlineDashboard className="me-4" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'الملف الشخصي',
    to: 'profile',
    icon: <TbUserSquare className="me-4" />,
  },
  {
    component: CNavItem,
    name: 'المحادثات',
    to: 'chat',
    icon: <IoChatbubblesOutline className="me-4" />,
  },
]
const adminNavs = [
  // admin

  {
    component: CNavItem,
    name: 'إدارة الكليات',
    to: '/collages',
    icon: <FaLandmark className="me-4" />,
  },

  {
    component: CNavItem,
    name: 'الفصول الدراسية',
    to: '/semesters',
    icon: <SiGoogleclassroom className="me-4" />,
  },
  {
    component: CNavItem,
    name: 'ادارة المستخدمين',
    to: '/users',
    icon: <FaUsersGear className="me-4" />,
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
    icon: <PiBooksThin className="me-4" />,
  },

  {
    component: CNavItem,
    name: ' الدرجات',
    to: 'grades',
    icon: <GiLevelEndFlag className="me-4" />,
  },
]

export default function getNavs() {
  const {user}=useDashboardContext()
  // console.log('user', user)
  if (user.__t == 'Admin') return [...publicNavs, ...adminNavs]

  if (user.__t == 'Teacher') return [...publicNavs, ...teacherNavs]

  if (user.__t == 'Student') return [...publicNavs, ...studentNavs]
}
