import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box,
  Center,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  SegmentedControl,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Carousel } from '@mantine/carousel'
import { IconBook, IconMessages, IconUser } from '@tabler/icons-react'
import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderProfilePic } from '../config/ChatLogics'
import customFetch from '../../utils/customFetch'
import ChatsList from '../NewChat/components/ChatsList/ChatsList'

const replaceHTML = (html) => (html ? String(html).replace(/<[^>]*>?/gm, '').trim() : '')

function formatChatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const now = new Date()
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString([], { month: 'numeric', day: 'numeric' })
}

function Contacts({ fetchAgain, selectedChat, socket }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const tabletMatch = useMediaQuery('(max-width: 768px)')

  const { setSelectedChat, chats, user, setChats } = ChatState()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true)
      const res = await customFetch.get('/chats/fetchChats')
      const items = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : []
      setChats(items)
    } catch (error) {
      console.error('Failed to load chats:', error)
    } finally {
      setLoading(false)
    }
  }, [setChats])

  useEffect(() => {
    fetchChats()
  }, [fetchChats, fetchAgain])

  useEffect(() => {
    if (!socket?.current) return

    const handleContactsUpdate = (data) => {
      if (!data?._id) return
      setChats((prev) => {
        if (!Array.isArray(prev) || prev.length === 0) return prev
        return prev.map((c) => {
          if (c._id === data._id) {
            return {
              ...c,
              latestMessage: data.latestMessage || c.latestMessage,
            }
          }
          return c
        })
      })
    }

    socket.current.on('contacts', handleContactsUpdate)
    return () => {
      socket.current?.off('contacts', handleContactsUpdate)
    }
  }, [socket, setChats])

  // Filter chats by selected tab
  const filteredChats = useMemo(() => {
    if (!Array.isArray(chats)) return []
    if (activeTab === 'courses') {
      return chats.filter((c) => Boolean(c.course) || (c.isGroupChat && c.course))
    }
    if (activeTab === 'direct') {
      return chats.filter((c) => !c.course && !c.isGroupChat)
    }
    return chats
  }, [chats, activeTab])

  const getChatTitle = (chat) => {
    if (chat.chatName) return chat.chatName
    if (chat.course?.name) return `مقرر ${chat.course.name}`
    if (chat.isGroupChat) return 'مجموعة مناقشة'
    if (Array.isArray(chat.users) && chat.users.length >= 2) {
      return getSender(user, chat.users)
    }
    return 'محادثة'
  }

  const getChatAvatar = (chat) => {
    if (chat.course?.cover) return chat.course.cover
    if (chat.isGroupChat) return chat.groupPic
    if (Array.isArray(chat.users) && chat.users.length >= 2) {
      return getSenderProfilePic(user, chat.users)
    }
    return undefined
  }

  const getChatBadge = (chat) => {
    if (chat.course) return 'مقرر دراسي'
    if (chat.isGroupChat) return 'مجموعة'
    return null
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab Filter SegmentedControl */}
      <Box p="xs" px="sm">
        <SegmentedControl
          value={activeTab}
          onChange={setActiveTab}
          fullWidth
          size="xs"
          radius="md"
          data={[
            { label: 'الكل', value: 'all' },
            { label: 'المقررات', value: 'courses' },
            { label: 'الخاص', value: 'direct' },
          ]}
          styles={{
            root: {
              backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
            },
            label: {
              fontWeight: 600,
            },
          }}
        />
      </Box>

      <Divider />

      {/* Contacts List */}
      {tabletMatch ? (
        <Box px="xs" py="xs">
          <Carousel
            height="100%"
            align="start"
            slidesToScroll={1}
            px={8}
            slideSize="35%"
            slideGap="xs"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Carousel.Slide key={`chat-carousel-list-${i}`}>
                  <Skeleton height={46} radius="md" />
                </Carousel.Slide>
              ))
            ) : filteredChats && filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <Carousel.Slide key={`carousel-${chat._id}`}>
                  <ChatsList
                    onClick={() => setSelectedChat(chat)}
                    isSelected={selectedChat?._id === chat._id}
                    avatar={getChatAvatar(chat)}
                    firstName={getChatTitle(chat)}
                    badge={getChatBadge(chat)}
                    timestamp={formatChatTime(chat.latestMessage?.createdAt)}
                    lastMessage={
                      chat.latestMessage ? replaceHTML(chat.latestMessage.content) : ''
                    }
                  />
                </Carousel.Slide>
              ))
            ) : (
              <Center p="md">
                <Text size="xs" c="dimmed">
                  لا توجد محادثات
                </Text>
              </Center>
            )}
          </Carousel>
        </Box>
      ) : (
        <ScrollArea sx={{ flex: 1 }} type="hover">
          <Stack spacing={0}>
            {loading ? (
              Array.from({ length: 7 }).map((_, i) => (
                <Box key={`chat-list-skel-${i}`} p="xs" px="sm">
                  <Skeleton height={46} radius="md" />
                </Box>
              ))
            ) : filteredChats && filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatsList
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  isSelected={selectedChat?._id === chat._id}
                  avatar={getChatAvatar(chat)}
                  firstName={getChatTitle(chat)}
                  badge={getChatBadge(chat)}
                  timestamp={formatChatTime(chat.latestMessage?.createdAt)}
                  lastMessage={
                    chat.latestMessage ? replaceHTML(chat.latestMessage.content) : ''
                  }
                />
              ))
            ) : (
              <Center py="3rem" sx={{ flexDirection: 'column' }}>
                <IconMessages size={36} color={theme.colors.gray[4]} />
                <Text size="sm" c="dimmed" mt="xs" fw={500}>
                  {activeTab === 'courses'
                    ? 'لا توجد مقررات دراسية بعد'
                    : activeTab === 'direct'
                    ? 'لا توجد محادثات خاصة بعد'
                    : 'لا توجد محادثات'}
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  ابدأ محادثة جديدة عبر البحث بالأعلى
                </Text>
              </Center>
            )}
          </Stack>
        </ScrollArea>
      )}
    </Box>
  )
}

export default Contacts
