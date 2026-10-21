import React from 'react'
import {
  Avatar,
  Box,
  Flex,
  Indicator,
  Stack,
  Text,
  UnstyledButton,
  Group,
  Badge,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBook, IconUsers } from '@tabler/icons-react'

const ChatsList = ({
  avatar,
  lastName,
  lastMessage,
  firstName,
  active,
  badge,
  timestamp,
  isSelected = false,
  ...props
}) => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const tabletMatch = useMediaQuery('(max-width: 768px)')

  return tabletMatch ? (
    <UnstyledButton
      sx={{
        backgroundColor: isSelected
          ? isDark
            ? theme.colors.dark[5]
            : theme.colors.brand[1]
          : 'transparent',
        '&:hover': {
          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.brand[0],
        },
        borderRadius: theme.radius.md,
        padding: '8px 10px',
        width: '100%',
      }}
      {...props}
    >
      <Flex align="center" gap="xs">
        <Indicator disabled={!active} position="bottom-end" color="green" offset={4} size={8}>
          <Avatar size={40} radius="xl" src={avatar} color="brand">
            {firstName?.charAt(0) || '?'}
          </Avatar>
        </Indicator>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Group spacing={4} position="apart" noWrap>
            <Text size="sm" fw={isSelected ? 700 : 500} lineClamp={1}>
              {firstName} {lastName || ''}
            </Text>
            {badge && (
              <Badge size="xs" color="teal" variant="light" leftSection={<IconBook size={9} />}>
                {badge}
              </Badge>
            )}
          </Group>
        </Box>
      </Flex>
    </UnstyledButton>
  ) : (
    <UnstyledButton
      py="xs"
      px="sm"
      sx={{
        width: '100%',
        backgroundColor: isSelected
          ? isDark
            ? 'rgba(34, 139, 230, 0.15)'
            : 'rgba(231, 245, 255, 0.9)'
          : 'transparent',
        borderRight: isSelected
          ? `3px solid ${theme.colors.brand[6]}`
          : '3px solid transparent',
        '&:hover': {
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(0, 0, 0, 0.02)',
          transition: 'all 0.15s ease',
        },
        borderBottom: `1px solid ${
          isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'
        }`,
      }}
      {...props}
    >
      <Flex align="center" gap="sm">
        <Indicator disabled={!active} position="bottom-end" color="green" offset={3} size={8}>
          <Avatar size={42} radius="xl" src={avatar} color="brand">
            {firstName?.charAt(0) || '?'}
          </Avatar>
        </Indicator>

        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Group position="apart" noWrap spacing={4}>
            <Text
              size="sm"
              fw={isSelected ? 700 : 600}
              lineClamp={1}
              color={isSelected ? theme.colors.brand[6] : undefined}
            >
              {firstName} {lastName || ''}
            </Text>
            {timestamp && (
              <Text size="10px" c="dimmed">
                {timestamp}
              </Text>
            )}
          </Group>

          <Group position="apart" noWrap spacing={4}>
            <Text lineClamp={1} size="xs" c="dimmed" sx={{ flex: 1 }}>
              {lastMessage || 'لا توجد رسائل سابقة'}
            </Text>
            {badge && (
              <Badge
                size="xs"
                color={badge.includes('مقرر') ? 'teal' : 'blue'}
                variant="light"
                leftSection={
                  badge.includes('مقرر') ? <IconBook size={9} /> : <IconUsers size={9} />
                }
              >
                {badge}
              </Badge>
            )}
          </Group>
        </Stack>
      </Flex>
    </UnstyledButton>
  )
}

export default ChatsList
