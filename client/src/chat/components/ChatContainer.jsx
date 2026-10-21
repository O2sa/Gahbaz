import React, { useState } from 'react'
import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Text,
  Badge,
  Menu,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import {
  IconArrowRight,
  IconDotsVertical,
  IconBook,
  IconUsers,
  IconLogout,
  IconTrash,
} from '@tabler/icons-react'
import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderProfilePic, getSenderFull } from '../config/ChatLogics'
import SingleChat from './SingleChat'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'

function ChatContainer({ socket, fetchAgain, setFetchAgain }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const { setSelectedChat, selectedChat, user } = ChatState()

  if (!selectedChat) return null

  const isCourseChat = Boolean(selectedChat.course)
  const isGroup = selectedChat.isGroupChat || isCourseChat

  const chatTitle = selectedChat.chatName
    ? selectedChat.chatName
    : selectedChat.course?.name
    ? `مقرر ${selectedChat.course.name}`
    : selectedChat.users && selectedChat.users.length >= 2
    ? getSender(user, selectedChat.users)
    : 'المحادثة'

  const chatAvatar = selectedChat.course?.cover
    ? selectedChat.course.cover
    : selectedChat.isGroupChat
    ? selectedChat.groupPic
    : selectedChat.users && selectedChat.users.length >= 2
    ? getSenderProfilePic(user, selectedChat.users)
    : undefined

  const peerUser =
    !isGroup && selectedChat.users && selectedChat.users.length >= 2
      ? getSenderFull(user, selectedChat.users)
      : null

  const subtitle = isCourseChat
    ? `${selectedChat.course?.code ? selectedChat.course.code + ' • ' : ''}${
        selectedChat.users?.length || 0
      } مشارك في القناة`
    : selectedChat.isGroupChat
    ? `${selectedChat.users?.length || 0} عضو`
    : peerUser?.email || 'محادثة مباشرة'

  const handleLeaveOrClose = () => {
    setSelectedChat(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
      }}
    >
      {/* Top Header */}
      <Box
        p="sm"
        px="md"
        sx={{
          flexShrink: 0,
          borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
        }}
      >
        <Group position="apart">
          <Group spacing="sm">
            {/* Back button for mobile / tablet view */}
            <Tooltip label="الرجوع للقائمة">
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="md"
                onClick={handleLeaveOrClose}
                sx={{ display: 'none', '@media (max-width: 768px)': { display: 'inline-flex' } }}
              >
                <IconArrowRight size={20} />
              </ActionIcon>
            </Tooltip>

            {/* Avatar with indicator */}
            <Avatar
              src={chatAvatar}
              radius="xl"
              size={42}
              color={isCourseChat ? 'teal' : isGroup ? 'blue' : 'brand'}
              sx={{
                border: `2px solid ${
                  isCourseChat
                    ? theme.colors.teal[5]
                    : isDark
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
                }`,
              }}
            >
              {isCourseChat ? <IconBook size={20} /> : chatTitle.charAt(0).toUpperCase()}
            </Avatar>

            {/* Title & Subtitle */}
            <Box>
              <Group spacing={6} align="center">
                <Text size="sm" fw={700} lineClamp={1}>
                  {chatTitle}
                </Text>
                {isCourseChat && (
                  <Badge
                    size="xs"
                    color="teal"
                    variant="light"
                    leftSection={<IconBook size={10} />}
                  >
                    مقرر دراسي
                  </Badge>
                )}
                {!isCourseChat && isGroup && (
                  <Badge
                    size="xs"
                    color="blue"
                    variant="light"
                    leftSection={<IconUsers size={10} />}
                  >
                    مجموعة
                  </Badge>
                )}
              </Group>
              <Text size="xs" c="dimmed" lineClamp={1}>
                {subtitle}
              </Text>
            </Box>
          </Group>

          {/* Quick Actions Menu */}
          <Group spacing="xs">
            <Menu position="bottom-end" shadow="md" width={180}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" radius="md">
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconArrowRight size={14} />}
                  onClick={() => setSelectedChat(null)}
                >
                  إغلاق المحادثة
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Box>

      {/* Main Messages & Input Area */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <SingleChat
          fetchAgain={fetchAgain}
          socket={socket}
          setFetchAgain={setFetchAgain}
          selectedChat={selectedChat}
        />
      </Box>
    </Box>
  )
}

export default ChatContainer
