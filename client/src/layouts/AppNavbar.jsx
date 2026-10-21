import React from 'react'
import {
  Navbar,
  ScrollArea,
  Text,
  NavLink,
  Box,
  Divider,
  useMantineTheme,
  rem,
} from '@mantine/core'
import {
  IconDashboard,
  IconUser,
  IconBuildingSkyscraper,
  IconCertificate,
  IconBook,
  IconBooks,
  IconCalendarEvent,
  IconSchool,
  IconUserCheck,
  IconShieldCheck,
  IconMessageDots,
  IconArrowsExchange,
  IconReportAnalytics,
} from '@tabler/icons-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AppNavbar({ opened, setOpened, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const handleNav = (path) => {
    navigate(path)
    if (setOpened) {
      setOpened(false)
    }
  }

  const role = user?.role || 'admin'
  const isAdmin = role === 'admin'
  const isStudent = role === 'student'
  const isTeacher = role === 'teacher'

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === ''
    }
    return location.pathname.startsWith(path)
  }

  const navLinkStyle = (path) => {
    const active = isActive(path)
    return {
      borderRadius: theme.radius.md,
      margin: `${rem(3)} 0`,
      fontWeight: active ? 700 : 500,
      fontSize: 14,
      transition: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: active
        ? isDark
          ? 'rgba(59, 130, 246, 0.18)'
          : 'rgba(30, 64, 175, 0.08)'
        : 'transparent',
      color: active
        ? isDark
          ? '#93c5fd'
          : theme.colors.brand[8]
        : isDark
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
      borderRight: active
        ? `3px solid ${isDark ? '#3b82f6' : theme.colors.brand[6]}`
        : '3px solid transparent',
      '&:hover': {
        backgroundColor: isDark
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
        transform: 'translateX(-2px)',
      },
    }
  }

  return (
    <Navbar
      p="xs"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 260 }}
      sx={{
        backgroundColor: isDark
          ? 'rgba(26, 27, 30, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        borderLeft: `1px solid ${
          isDark ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
      }}
    >
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {/* Section: Overview */}
        <Box mb="xs">
          <Text
            size="xs"
            weight={700}
            color={isDark ? 'gray.5' : 'dimmed'}
            px="xs"
            mb={6}
            sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            الرئيسية
          </Text>
          <NavLink
            label="لوحة التحكم"
            icon={<IconDashboard size={19} stroke={1.6} />}
            active={isActive('/dashboard')}
            onClick={() => handleNav('/dashboard')}
            sx={navLinkStyle('/dashboard')}
          />
          <NavLink
            label="المقررات والدورات"
            icon={<IconBook size={19} stroke={1.6} />}
            active={isActive('/courses')}
            onClick={() => handleNav('/courses')}
            sx={navLinkStyle('/courses')}
          />
          <NavLink
            label="المحادثات الأكاديمية"
            icon={<IconMessageDots size={19} stroke={1.6} />}
            active={isActive('/chat')}
            onClick={() => handleNav('/chat')}
            sx={navLinkStyle('/chat')}
          />
          <NavLink
            label="الملف الشخصي"
            icon={<IconUser size={19} stroke={1.6} />}
            active={isActive('/profile')}
            onClick={() => handleNav('/profile')}
            sx={navLinkStyle('/profile')}
          />
        </Box>

        {/* Section: Academics (Admin) */}
        {isAdmin && (
          <>
            <Divider my="xs" color={isDark ? 'dark.5' : 'gray.2'} />
            <Box mb="xs">
              <Text
                size="xs"
                weight={700}
                color={isDark ? 'gray.5' : 'dimmed'}
                px="xs"
                mb={6}
                sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                الإدارة الأكاديمية
              </Text>
              <NavLink
                label="الكليات والأقسام"
                icon={<IconBuildingSkyscraper size={19} stroke={1.6} />}
                active={isActive('/collages')}
                onClick={() => handleNav('/collages')}
                sx={navLinkStyle('/collages')}
              />
              <NavLink
                label="التخصصات والبرامج"
                icon={<IconCertificate size={19} stroke={1.6} />}
                active={isActive('/majors')}
                onClick={() => handleNav('/majors')}
                sx={navLinkStyle('/majors')}
              />
              <NavLink
                label="دليل المواد الأكاديمية"
                icon={<IconBooks size={19} stroke={1.6} />}
                active={isActive('/subjects')}
                onClick={() => handleNav('/subjects')}
                sx={navLinkStyle('/subjects')}
              />
              <NavLink
                label="الفصول الدراسية"
                icon={<IconCalendarEvent size={19} stroke={1.6} />}
                active={isActive('/semesters')}
                onClick={() => handleNav('/semesters')}
                sx={navLinkStyle('/semesters')}
              />
              <NavLink
                label="المقررات المفتوحة"
                icon={<IconBook size={19} stroke={1.6} />}
                active={isActive('/courses')}
                onClick={() => handleNav('/courses')}
                sx={navLinkStyle('/courses')}
              />
            </Box>

            <Divider my="xs" color={isDark ? 'dark.5' : 'gray.2'} />
            {/* Section: Users (Admin) */}
            <Box mb="xs">
              <Text
                size="xs"
                weight={700}
                color={isDark ? 'gray.5' : 'dimmed'}
                px="xs"
                mb={6}
                sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                المستخدمون والصلاحيات
              </Text>
              <NavLink
                label="الطلاب"
                icon={<IconSchool size={19} stroke={1.6} />}
                active={isActive('/users/students')}
                onClick={() => handleNav('/users/students')}
                sx={navLinkStyle('/users/students')}
              />
              <NavLink
                label="أعضاء هيئة التدريس"
                icon={<IconUserCheck size={19} stroke={1.6} />}
                active={isActive('/users/teachers')}
                onClick={() => handleNav('/users/teachers')}
                sx={navLinkStyle('/users/teachers')}
              />
              <NavLink
                label="إداريو النظام"
                icon={<IconShieldCheck size={19} stroke={1.6} />}
                active={isActive('/users') && !isActive('/users/students') && !isActive('/users/teachers')}
                onClick={() => handleNav('/users')}
                sx={navLinkStyle('/users')}
              />
            </Box>
          </>
        )}

        {/* Section: Teacher specific */}
        {isTeacher && (
          <>
            <Divider my="xs" color={isDark ? 'dark.5' : 'gray.2'} />
            <Box mb="xs">
              <Text
                size="xs"
                weight={700}
                color={isDark ? 'gray.5' : 'dimmed'}
                px="xs"
                mb={6}
                sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                التدريس الأكاديمي
              </Text>
              <NavLink
                label="المقررات المسندة"
                icon={<IconBook size={19} stroke={1.6} />}
                active={isActive('/courses')}
                onClick={() => handleNav('/courses')}
                sx={navLinkStyle('/courses')}
              />
            </Box>
          </>
        )}

        {/* Section: Student specific */}
        {isStudent && (
          <>
            <Divider my="xs" color={isDark ? 'dark.5' : 'gray.2'} />
            <Box mb="xs">
              <Text
                size="xs"
                weight={700}
                color={isDark ? 'gray.5' : 'dimmed'}
                px="xs"
                mb={6}
                sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                الأكاديميا والتسجيل
              </Text>
              <NavLink
                label="مقرراتي الدراسية"
                icon={<IconBook size={19} stroke={1.6} />}
                active={isActive('/courses')}
                onClick={() => handleNav('/courses')}
                sx={navLinkStyle('/courses')}
              />
              <NavLink
                label="بوابة الحذف والإضافة"
                icon={<IconArrowsExchange size={19} stroke={1.6} />}
                active={isActive('/enrollment')}
                onClick={() => handleNav('/enrollment')}
                sx={navLinkStyle('/enrollment')}
              />
              <NavLink
                label="سجل الدرجات"
                icon={<IconCertificate size={19} stroke={1.6} />}
                active={isActive('/grades')}
                onClick={() => handleNav('/grades')}
                sx={navLinkStyle('/grades')}
              />
              <NavLink
                label="السجل الأكاديمي"
                icon={<IconReportAnalytics size={19} stroke={1.6} />}
                active={isActive('/transcript')}
                onClick={() => handleNav('/transcript')}
                sx={navLinkStyle('/transcript')}
              />
            </Box>
          </>
        )}
      </Navbar.Section>
    </Navbar>
  )
}
