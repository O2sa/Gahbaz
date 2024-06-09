import { Avatar, Flex, Indicator, Stack, Text, UnstyledButton } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
// import classes from './ChatsList.module.css'

const ChatsList = ({ avatar, lastName, lastMessage, firstName, active, ...props }) => {
  const tablet_match = useMediaQuery('(max-width: 768px)')
  // console.log('active', active)
  return tablet_match ? (
    <UnstyledButton
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: theme.colors.brand[1],
          // transition: 'all ease 150ms',
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

        <Text size="sm">
          {firstName} {lastName}
        </Text>
      </Flex>
    </UnstyledButton>
  ) : (
    <UnstyledButton
      py={'xs'}
      px={'sm'}
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: theme.colors.brand[1],
          transition: 'all ease 150ms',
        },
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
      })}
      {...props}
    >
      <Flex align="center" gap="xs">
        <Indicator disabled={active} position="bottom-end" color="green" offset={5} size={9}>
          <Avatar size="md" radius="50%" src={avatar} />
        </Indicator>
        <Stack gap={1}>
          <Text size="sm" fw={600} lineClamp={1}>
            {firstName} {lastName}
          </Text>
          <Text lineClamp={1} size="xs" c="dimmed">
            {lastMessage}
          </Text>
        </Stack>
      </Flex>
    </UnstyledButton>
  )
}

export default ChatsList
