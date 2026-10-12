import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Box, Paper, Group, Text, useMantineTheme, rem } from '@mantine/core'

export const TabsLinks = ({ tabs = [] }) => {
  const location = useLocation()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  if (!tabs.length) return <Outlet />

  const isTabActive = (tab) => {
    const to = (tab.to || '').trim()
    const currentPath = location.pathname.replace(/\/+$/, '')

    if (to === '.' || to === '') {
      // Check if current URL doesn't match any other sibling tab's specific path
      const otherTabs = tabs.filter(t => t.to && t.to !== '.' && t.to !== '')
      return !otherTabs.some(t => currentPath.endsWith('/' + t.to) || currentPath.includes('/' + t.to + '/'))
    }

    return currentPath.endsWith('/' + to) || currentPath.includes('/' + to + '/')
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        withBorder
        radius="lg"
        p={6}
        mb="lg"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(30, 64, 175, 0.04)',
        }}
      >
        <Group spacing={8} noWrap sx={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          {tabs.map((tab) => {
            const active = isTabActive(tab)
            const Icon = tab.icon

            return (
              <Link
                key={tab.to || tab.name}
                to={tab.to}
                style={{ textDecoration: 'none', flex: 1, minWidth: 140 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: `${rem(10)} ${rem(16)}`,
                    borderRadius: theme.radius.md,
                    transition: 'all 180ms ease',
                    cursor: 'pointer',
                    fontWeight: active ? 700 : 500,
                    fontSize: 14,
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.22)'
                        : 'rgba(30, 64, 175, 0.08)'
                      : 'transparent',
                    color: active
                      ? isDark
                        ? '#93c5fd'
                        : theme.colors.brand[7]
                      : isDark
                      ? theme.colors.dark[1]
                      : theme.colors.gray[7],
                    border: active
                      ? `1px solid ${isDark ? 'rgba(59, 130, 246, 0.45)' : theme.colors.brand[3]}`
                      : '1px solid transparent',
                    boxShadow: active
                      ? isDark
                        ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                        : '0 2px 8px rgba(30, 64, 175, 0.06)'
                      : 'none',
                    '&:hover': {
                      backgroundColor: active
                        ? undefined
                        : isDark
                        ? theme.colors.dark[5]
                        : theme.colors.gray[1],
                      color: isDark ? theme.colors.dark[0] : theme.colors.gray[9],
                    },
                  }}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      stroke={active ? 2 : 1.5}
                      color={
                        active
                          ? isDark
                            ? '#93c5fd'
                            : theme.colors.brand[6]
                          : 'currentColor'
                      }
                    />
                  )}
                  <Text size="sm">{tab.name}</Text>
                </Box>
              </Link>
            )
          })}
        </Group>
      </Paper>

      <Box>
        <Outlet />
      </Box>
    </Box>
  )
}

export default TabsLinks
