import React, { useState, useEffect, useCallback } from 'react'
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Carousel } from '@mantine/carousel'
import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderProfilePic } from '../config/ChatLogics'
import customFetch from '../../utils/customFetch'
import ChatsList from '../NewChat/components/ChatsList/ChatsList'

const replaceHTML = (html) => (html ? String(html).replace(/<[^>]*>?/gm, '') : '')

function Contacts({ fetchAgain, selectedChat, socket }) {
  const { setSelectedChat, chats, user, setChats } = ChatState()
  const [loading, setLoading] = useState(false)
  const tabletMatch = useMediaQuery('(max-width: 768px)')

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

  const getChatTitle = (chat) => {
    if (chat.chatName) return chat.chatName
    if (chat.course?.name) return `مقرر: ${chat.course.name}`
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
    <>
      {tabletMatch ? (
        <>
          <Carousel
            height="100%"
            align="start"
            slidesToScroll={1}
            px={16}
            slideSize={{
              base: '35%',
              sm: '30%',
              md: '25%',
            }}
            slideGap="sm"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Carousel.Slide key={`chat-carousel-list-${i}`}>
                  <Skeleton height={48} radius="md" />
                </Carousel.Slide>
              ))
            ) : chats && chats.length > 0 ? (
              chats.map((chat) => (
                <Carousel.Slide key={`carousel-${chat._id}`}>
                  <ChatsList
                    onClick={() => setSelectedChat(chat)}
                    isSelected={selectedChat?._id === chat._id}
                    avatar={getChatAvatar(chat)}
                    firstName={getChatTitle(chat)}
                    badge={getChatBadge(chat)}
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
          <Divider my="xs" />
        </>
      ) : (
        <ScrollArea sx={{ height: 480 }} type="hover">
          <Stack spacing={0}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Box key={`chat-list-skel-${i}`} p="xs">
                  <Skeleton height={42} radius="sm" />
                </Box>
              ))
            ) : chats && chats.length > 0 ? (
              chats.map((chat) => (
                <ChatsList
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  isSelected={selectedChat?._id === chat._id}
                  avatar={getChatAvatar(chat)}
                  firstName={getChatTitle(chat)}
                  badge={getChatBadge(chat)}
                  lastMessage={
                    chat.latestMessage ? replaceHTML(chat.latestMessage.content) : ''
                  }
                />
              ))
            ) : (
              <Center py="xl">
                <Text size="sm" c="dimmed">
                  لا توجد محادثات نشطة
                </Text>
              </Center>
            )}
          </Stack>
        </ScrollArea>
      )}
    </>
  )
}

export default Contacts
