import React, { useState } from 'react'
import {
  Header as MantineHeader,
  Container,
  Group,
  Button,
  Burger,
  Drawer,
  Text,
  ActionIcon,
  Box,
  useMantineTheme,
  Stack,
  Divider,
  Avatar,
  Badge,
  Menu,
  UnstyledButton,
  useMantineColorScheme,
  Tooltip,
} from '@mantine/core'
import {
  IconSchool,
  IconArrowLeft,
  IconLogin,
  IconDashboard,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconBook,
  IconMessageDots,
  IconSun,
  IconMoonStars,
} from '@tabler/icons-react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import customFetch from '../../../utils/customFetch'

const Header = () => {
  const [opened, setOpened] = useState(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Safely check if a token exists in localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Non-blocking background session query: Never blocks landing page rendering, never redirects on 401
  const { data: user } = useQuery({
    queryKey: ['landingCurrentUser'],
    queryFn: async () => {
      if (!token) return null
      try {
        const res = await customFetch.get('/users/current-user', {
          skipAuthRedirect: true,
          skipErrorNotification: true,
        })
        const u = res?.data?.user || res?.user || res?.data || res
        return u && (u.role || u._id) ? u : null
      } catch (err) {
        return null
      }
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  const handleLogout = async () => {
    try {
      await customFetch.get('/auth/logout', { skipAuthRedirect: true, skipErrorNotification: true })
    } catch (e) {
      // ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      queryClient.clear()
      queryClient.setQueryData(['landingCurrentUser'], null)
      queryClient.setQueryData(['currentUser'], null)
      setOpened(false)
    }
  }

  const scrollTo = (id) => {
    setOpened(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const roleLabels = {
    admin: 'مدير النظام',
    teacher: 'عضو هيئة التدريس',
    student: 'طالب جامعي',
  }

  const roleColors = {
    admin: 'violet',
    teacher: 'blue',
    student: 'teal',
  }

  const role = user?.role || 'admin'
  const userName = user?.name || user?.firstName || 'المستخدم'
  const userInitial = userName.trim().charAt(0).toUpperCase()

  return (
    <MantineHeader
      height={72}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: isDark
          ? 'rgba(26, 27, 30, 0.88)'
          : 'rgba(255, 255, 255, 0.88)',
        borderBottom: `1px solid ${
          isDark ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      }}
    >
      <Container size="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo & Name */}
        <Group spacing="xs" component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
          <ActionIcon
            size={40}
            radius="md"
            variant="gradient"
            gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
            sx={{
              boxShadow: isDark
                ? '0 0 16px rgba(59, 130, 246, 0.35)'
                : '0 4px 12px rgba(30, 64, 175, 0.25)',
            }}
          >
            <IconSchool size={24} color="white" />
          </ActionIcon>
          <Box>
            <Text
              weight={800}
              size="lg"
              sx={{
                lineHeight: 1.2,
                background: isDark
                  ? 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              منصة جَهْبَذ
            </Text>
            <Text size={10} color="dimmed" weight={600} sx={{ lineHeight: 1 }}>
              المنظومة الأكاديمية الذكية
            </Text>
          </Box>
        </Group>

        {/* Desktop Nav Anchors */}
        <Group spacing="xl" sx={{ '@media (max-width: 860px)': { display: 'none' } }}>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('about')} sx={{ fontWeight: 600 }}>
            عن المنصة
          </Button>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('section-one')} sx={{ fontWeight: 600 }}>
            الخدمات
          </Button>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('section-four')} sx={{ fontWeight: 600 }}>
            الميزات
          </Button>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('section-five')} sx={{ fontWeight: 600 }}>
            الأسئلة الشائعة
          </Button>
        </Group>

        {/* Desktop Dynamic User CTA Section */}
        <Group spacing="sm" sx={{ '@media (max-width: 860px)': { display: 'none' } }}>
          {user ? (
            /* Logged In View */
            <Group spacing="xs">
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="gradient"
                gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                radius="md"
                leftIcon={<IconDashboard size={18} />}
                sx={{
                  fontWeight: 700,
                  boxShadow: isDark
                    ? '0 4px 14px rgba(59, 130, 246, 0.35)'
                    : '0 4px 14px rgba(30, 64, 175, 0.25)',
                }}
              >
                لوحة التحكم
              </Button>

              <Menu position="bottom-end" shadow="md" radius="md" width={220}>
                <Menu.Target>
                  <UnstyledButton
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 8px',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                      transition: 'all 150ms ease',
                      '&:hover': {
                        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                      },
                    }}
                  >
                    <Avatar
                      size={34}
                      radius="xl"
                      color="brand"
                      src={user.avatar || undefined}
                      sx={{ fontWeight: 700 }}
                    >
                      {userInitial}
                    </Avatar>
                    <Box sx={{ textAlign: 'right', maxWidth: 110 }}>
                      <Text size="xs" weight={700} lineClamp={1}>
                        {userName}
                      </Text>
                      <Badge size="xs" variant="light" color={roleColors[role] || 'blue'} sx={{ height: 16, padding: '0 4px' }}>
                        {roleLabels[role] || role}
                      </Badge>
                    </Box>
                    <IconChevronDown size={14} opacity={0.6} />
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown sx={{ minWidth: 200, padding: 6 }}>
                  <Box px="xs" py={6}>
                    <Text size="xs" color="dimmed" weight={500} lineClamp={1}>
                      {user.email}
                    </Text>
                  </Box>
                  <Menu.Divider />

                  <Menu.Item icon={<IconDashboard size={16} stroke={1.6} />} onClick={() => navigate('/dashboard')}>
                    لوحة التحكم
                  </Menu.Item>
                  <Menu.Item icon={<IconBook size={16} stroke={1.6} />} onClick={() => navigate('/courses')}>
                    المقررات الدراسية
                  </Menu.Item>
                  <Menu.Item icon={<IconMessageDots size={16} stroke={1.6} />} onClick={() => navigate('/chat')}>
                    المحادثات الأكاديمية
                  </Menu.Item>
                  <Menu.Item icon={<IconUser size={16} stroke={1.6} />} onClick={() => navigate('/profile')}>
                    الملف الشخصي
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item color="red" icon={<IconLogout size={16} stroke={1.8} />} onClick={handleLogout}>
                    تسجيل الخروج
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            /* Visitor View: Login & Register */
            <>
              <Button
                component={RouterLink}
                to="/login"
                variant="default"
                radius="md"
                leftIcon={<IconLogin size={16} />}
                sx={{ fontWeight: 600 }}
              >
                تسجيل الدخول
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="gradient"
                gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                radius="md"
                leftIcon={<IconArrowLeft size={16} />}
                sx={{ fontWeight: 700 }}
              >
                إنشاء حساب
              </Button>
            </>
          )}

          {/* Desktop Theme Mode Toggle */}
          <Tooltip
            label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            withArrow
            position="bottom"
          >
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="md"
              onClick={() => toggleColorScheme()}
              aria-label="Toggle color scheme"
              sx={{
                color: isDark ? theme.colors.yellow[4] : theme.colors.brand[7],
                '&:hover': {
                  backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.brand[0],
                },
              }}
            >
              {isDark ? (
                <IconSun size={20} stroke={1.8} />
              ) : (
                <IconMoonStars size={20} stroke={1.8} />
              )}
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Mobile Header Controls: Theme Toggle & Burger */}
        <Group spacing="xs" sx={{ '@media (min-width: 861px)': { display: 'none' } }}>
          <ActionIcon
            variant="subtle"
            size="md"
            radius="md"
            onClick={() => toggleColorScheme()}
            aria-label="Toggle color scheme"
            sx={{
              color: isDark ? theme.colors.yellow[4] : theme.colors.brand[7],
            }}
          >
            {isDark ? <IconSun size={18} stroke={1.8} /> : <IconMoonStars size={18} stroke={1.8} />}
          </ActionIcon>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
          />
        </Group>

        {/* Mobile Drawer */}
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="lg"
          position="right"
          size="xs"
          title={
            <Group spacing="xs">
              <ActionIcon size={32} radius="md" variant="gradient" gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}>
                <IconSchool size={18} color="white" />
              </ActionIcon>
              <Text weight={700}>منصة جَهْبَذ</Text>
            </Group>
          }
        >
          <Stack spacing="md" mt="md">
            {user && (
              <Box
                p="sm"
                sx={{
                  borderRadius: theme.radius.md,
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                }}
              >
                <Group spacing="xs">
                  <Avatar size={40} radius="xl" color="brand" src={user.avatar || undefined}>
                    {userInitial}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Text size="sm" weight={700} lineClamp={1}>
                      {userName}
                    </Text>
                    <Badge size="xs" variant="light" color={roleColors[role] || 'blue'}>
                      {roleLabels[role] || role}
                    </Badge>
                  </Box>
                </Group>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  variant="gradient"
                  gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                  leftIcon={<IconDashboard size={16} />}
                  fullWidth
                  mt="sm"
                  onClick={() => setOpened(false)}
                >
                  الانتقال للوحة التحكم
                </Button>
              </Box>
            )}

            <Button variant="light" onClick={() => scrollTo('about')} fullWidth>
              عن المنصة
            </Button>
            <Button variant="light" onClick={() => scrollTo('section-one')} fullWidth>
              الخدمات
            </Button>
            <Button variant="light" onClick={() => scrollTo('section-four')} fullWidth>
              الميزات
            </Button>
            <Button variant="light" onClick={() => scrollTo('section-five')} fullWidth>
              الأسئلة الشائعة
            </Button>

            <Button
              variant="default"
              leftIcon={isDark ? <IconSun size={18} stroke={1.8} /> : <IconMoonStars size={18} stroke={1.8} />}
              fullWidth
              onClick={() => toggleColorScheme()}
            >
              {isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            </Button>

            <Divider my="sm" />

            {user ? (
              <>
                <Button component={RouterLink} to="/courses" variant="default" fullWidth onClick={() => setOpened(false)}>
                  المقررات الدراسية
                </Button>
                <Button component={RouterLink} to="/chat" variant="default" fullWidth onClick={() => setOpened(false)}>
                  المحادثات الأكاديمية
                </Button>
                <Button color="red" variant="subtle" leftIcon={<IconLogout size={16} />} fullWidth onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" variant="default" fullWidth onClick={() => setOpened(false)}>
                  تسجيل الدخول
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="gradient"
                  gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                  fullWidth
                  onClick={() => setOpened(false)}
                >
                  إنشاء حساب جديد
                </Button>
              </>
            )}
          </Stack>
        </Drawer>
      </Container>
    </MantineHeader>
  )
}

export default Header
