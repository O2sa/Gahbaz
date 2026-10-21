import React from 'react'
import { Avatar, Flex, Indicator, Stack, Text, UnstyledButton, Group, Badge } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBook } from '@tabler/icons-react'

const ChatsList = ({
  avatar,
  lastName,
  lastMessage,
  firstName,
  active,
  badge,
  isSelected = false,
  ...props
}) => {
  const tabletMatch = useMediaQuery('(max-width: 768px)')

  return tabletMatch ? (
    <UnstyledButton
      sx={(theme) => ({
        backgroundColor: isSelected
          ? theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.brand[1]
          : 'transparent',
        '&:hover': {
          backgroundColor: theme.colors.brand[1],
        },
        borderRadius: theme.radius.md,
      })}
      p={'xs'}
      {...props}
    >
      <Flex align="center" gap="xs">
        <Indicator disabled={active} position="bottom-end" color="green" offset={5} size={9}>
          <Avatar size="md" radius="50%" src={avatar} />
        </Indicator>

        <Stack spacing={2}>
          <Group spacing={4} noWrap>
            <Text size="sm" lineClamp={1}>
              {firstName} {lastName || ''}
            </Text>
            {badge && (
              <Badge size="xs" color="teal" variant="light" leftSection={<IconBook size={10} />}>
                {badge}
              </Badge>
            )}
          </Group>
        </Stack>
      </Flex>
    </UnstyledButton>
  ) : (
    <UnstyledButton
      py={'xs'}
      px={'sm'}
      sx={(theme) => ({
        backgroundColor: isSelected
          ? theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.brand[0]
          : 'transparent',
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.brand[1],
          transition: 'all ease 150ms',
        },
        borderBottom: `1px solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]
        }`,
      })}
      {...props}
    >
      <Flex align="center" gap="xs">
        <Indicator disabled={active} position="bottom-end" color="green" offset={5} size={9}>
          <Avatar size="md" radius="50%" src={avatar} />
        </Indicator>
        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Group position="apart" noWrap spacing={4}>
            <Text size="sm" fw={600} lineClamp={1} sx={{ flex: 1 }}>
              {firstName} {lastName || ''}
            </Text>
            {badge && (
              <Badge size="xs" color="teal" variant="light" leftSection={<IconBook size={10} />}>
                {badge}
              </Badge>
            )}
          </Group>
          <Text lineClamp={1} size="xs" c="dimmed">
            {lastMessage}
          </Text>
        </Stack>
      </Flex>
    </UnstyledButton>
  )
}

export default ChatsList
