import React from 'react'
import {
  Navbar,
  ScrollArea,
  Text,
  NavLink,
  Box,
  Divider,
} from '@mantine/core'
import {
  IconDashboard,
  IconUser,
  IconBuildingSkyscraper,
  IconCertificate,
  IconBook,
  IconCalendarEvent,
  IconTemplate,
  IconSchool,
  IconUserCheck,
  IconShieldCheck,
  IconMessageDots,
} from '@tabler/icons-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AppNavbar({ opened, setOpened, user }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (path) => {
    navigate(path)
    if (setOpened) {
      setOpened(false)
    }
  }

  const role = user?.role || 'admin'
  const isAdmin = role === 'admin'

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === ''
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Navbar
      p="xs"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 260 }}
    >
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {/* Section: Overview */}
        <Box mb="xs">
          <Text size="xs" weight={700} color="dimmed" px="xs" mb={4}>
            الرئيسية
          </Text>
          <NavLink
            label="لوحة التحكم"
            icon={<IconDashboard size={18} stroke={1.5} />}
            active={isActive('/')}
            onClick={() => handleNav('/')}
            variant="light"
          />
          <NavLink
            label="الملف الشخصي"
            icon={<IconUser size={18} stroke={1.5} />}
            active={isActive('/profile')}
            onClick={() => handleNav('/profile')}
            variant="light"
          />
          <NavLink
            label="المحادثات"
            icon={<IconMessageDots size={18} stroke={1.5} />}
            active={isActive('/chat')}
            onClick={() => handleNav('/chat')}
            variant="light"
          />
        </Box>

        <Divider my="xs" />

        {/* Section: Academics */}
        <Box mb="xs">
          <Text size="xs" weight={700} color="dimmed" px="xs" mb={4}>
            الأكاديميا
          </Text>
          {isAdmin && (
            <>
              <NavLink
                label="الكليات"
                icon={<IconBuildingSkyscraper size={18} stroke={1.5} />}
                active={isActive('/collages')}
                onClick={() => handleNav('/collages')}
                variant="light"
              />
              <NavLink
                label="التخصصات"
                icon={<IconCertificate size={18} stroke={1.5} />}
                active={isActive('/majors')}
                onClick={() => handleNav('/majors')}
                variant="light"
              />
              <NavLink
                label="المواد الدراسية"
                icon={<IconBook size={18} stroke={1.5} />}
                active={isActive('/subjects')}
                onClick={() => handleNav('/subjects')}
                variant="light"
              />
              <NavLink
                label="الفصول الدراسية"
                icon={<IconCalendarEvent size={18} stroke={1.5} />}
                active={isActive('/semesters')}
                onClick={() => handleNav('/semesters')}
                variant="light"
              />
              <NavLink
                label="خطط الفصول"
                icon={<IconTemplate size={18} stroke={1.5} />}
                active={isActive('/semestersTemplate')}
                onClick={() => handleNav('/semestersTemplate')}
                variant="light"
              />
            </>
          )}
        </Box>

        {isAdmin && (
          <>
            <Divider my="xs" />

            {/* Section: Users */}
            <Box mb="xs">
              <Text size="xs" weight={700} color="dimmed" px="xs" mb={4}>
                إدارة المستخدمين
              </Text>
              <NavLink
                label="الطلاب"
                icon={<IconSchool size={18} stroke={1.5} />}
                active={isActive('/students')}
                onClick={() => handleNav('/students')}
                variant="light"
              />
              <NavLink
                label="الأساتذة"
                icon={<IconUserCheck size={18} stroke={1.5} />}
                active={isActive('/teachers')}
                onClick={() => handleNav('/teachers')}
                variant="light"
              />
              <NavLink
                label="الإداريون"
                icon={<IconShieldCheck size={18} stroke={1.5} />}
                active={isActive('/admins')}
                onClick={() => handleNav('/admins')}
                variant="light"
              />
            </Box>
          </>
        )}
      </Navbar.Section>
    </Navbar>
  )
}
