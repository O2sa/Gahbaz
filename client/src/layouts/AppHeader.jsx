import React from 'react'
import {
  Header,
  Group,
  Burger,
  Text,
  ActionIcon,
  Indicator,
  Box,
  MediaQuery,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import { IconBell, IconSchool, IconSun, IconMoonStars } from '@tabler/icons-react'
import UserMenu from './UserMenu.jsx'

export default function AppHeader({ opened, setOpened, user }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'

  return (
    <Header
      height={64}
      px="md"
      sx={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: isDark
          ? 'rgba(26, 27, 30, 0.88)'
          : 'rgba(255, 255, 255, 0.92)',
        borderBottom: `1px solid ${
          isDark ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Group spacing="sm">
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={isDark ? theme.colors.gray[3] : theme.colors.gray[7]}
            />
          </MediaQuery>

          <Group spacing="xs" sx={{ cursor: 'pointer' }}>
            <ActionIcon
              size={38}
              radius="md"
              variant="gradient"
              gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              sx={{
                boxShadow: isDark
                  ? '0 0 16px rgba(59, 130, 246, 0.35)'
                  : '0 4px 12px rgba(30, 64, 175, 0.25)',
              }}
            >
              <IconSchool size={22} color="white" />
            </ActionIcon>
            <Box>
              <Text
                weight={800}
                size="md"
                sx={{
                  lineHeight: 1.2,
                  letterSpacing: '-0.3px',
                  background: isDark
                    ? 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                منصة جَهْبَذ
              </Text>
              <Text size={10} color="dimmed" weight={500} sx={{ lineHeight: 1 }}>
                النظام الأكاديمي الذكي
              </Text>
            </Box>
          </Group>
        </Group>

        <Group spacing="md">
          {/* Dark / Light Mode Toggle */}
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
                  backgroundColor: isDark
                    ? theme.colors.dark[5]
                    : theme.colors.brand[0],
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

          {/* Notifications Bell */}
          <Tooltip label="الإشعارات والتنبيهات" withArrow position="bottom">
            <Indicator
              inline
              size={9}
              offset={4}
              position="top-end"
              color="red"
              withBorder
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                radius="md"
                color="gray"
                sx={{
                  '&:hover': {
                    backgroundColor: isDark
                      ? theme.colors.dark[5]
                      : theme.colors.gray[1],
                  },
                }}
              >
                <IconBell size={20} stroke={1.6} />
              </ActionIcon>
            </Indicator>
          </Tooltip>

          {/* User Menu */}
          <UserMenu user={user} />
        </Group>
      </div>
    </Header>
  )
}
