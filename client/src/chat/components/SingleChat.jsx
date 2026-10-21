import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Box,
  Center,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Badge,
  useMantineTheme,
} from '@mantine/core'
import { IconMessages } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import customFetch from '../../utils/customFetch'
import { uploadMedia } from '../../utils/mediaUpload'
import { ChatState } from '../context/ChatProvider'
import ChatInput from './ChatInput'
import ChatItem from '../NewChat/components/ChatItem/ChatItem'

function SingleChat({ fetchAgain, socket, setFetchAgain, selectedChat }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const [messages, setMessages] = useState([])
  const [newAttach, setNewAttach] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef(null)
  const { user } = ChatState()
  const currentUserId = user?._id || user?.id

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = useCallback(async () => {
    if (!selectedChat?._id) return
    setLoading(true)
    try {
      const res = await customFetch.get(`/messages/getmsg/${selectedChat._id}`)
      const list = Array.isArray(res) ? res : (res?.data || [])
      setMessages(Array.isArray(list) ? list : [])
      if (socket?.current) {
        socket.current.emit('join chat', selectedChat._id)
        socket.current.emit('contacts', selectedChat)
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error)
      notifications.show({
        color: 'red',
        title: 'خطأ في تحميل الرسائل',
        message: error?.response?.data?.message || 'تعذر استرجاع رسائل المحادثة',
      })
    } finally {
      setLoading(false)
    }
  }, [selectedChat?._id, socket])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = async (msgText) => {
    if (!selectedChat?._id) return
    setSending(true)
    try {
      let attachmentUrl = ''
      if (newAttach) {
        try {
          const uploaded = await uploadMedia(newAttach, { folder: 'chat' })
          attachmentUrl = uploaded?.url || uploaded?.key || ''
        } catch (uploadErr) {
          console.error('Failed to upload attachment:', uploadErr)
          notifications.show({
            color: 'orange',
            title: 'تحذير المرفقات',
            message: 'تعذر رفع الملف، جاري إرسال الرسالة النصية فقط',
          })
        }
      }

      const res = await customFetch.post('/messages/addmsg', {
        chatId: selectedChat._id,
        content: msgText || '',
        attachment: attachmentUrl,
      })

      const data = res?.data || res

      if (socket?.current) {
        socket.current.emit('new message', data)
        socket.current.emit('contacts', data.chat || selectedChat)
      }

      setMessages((prev) => [...prev, data])
      setNewAttach(null)
      if (setFetchAgain) {
        setFetchAgain((prev) => !prev)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      notifications.show({
        color: 'red',
        title: 'فشل الإرسال',
        message: error?.response?.data?.message || 'تعذر إرسال الرسالة',
      })
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (!socket?.current) return

    const handleMessageReceived = (newMessage) => {
      if (!newMessage || !selectedChat?._id) return
      const incomingChatId = newMessage?.chat?._id || newMessage?.chat
      if (String(incomingChatId) === String(selectedChat._id)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(newMessage._id))) {
            return prev
          }
          return [...prev, newMessage]
        })
      }
      if (socket.current) {
        socket.current.emit('contacts', newMessage.chat || selectedChat)
      }
    }

    socket.current.on('message recieved', handleMessageReceived)

    return () => {
      socket.current?.off('message recieved', handleMessageReceived)
    }
  }, [selectedChat?._id, socket])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
      }}
    >
      {/* Scrollable Message List */}
      <ScrollArea
        sx={{
          flex: 1,
          padding: '16px 20px',
        }}
        type="hover"
      >
        {loading ? (
          <Center py="3rem">
            <Loader size="md" variant="dots" color="brand" />
          </Center>
        ) : messages && messages.length > 0 ? (
          <Stack spacing="xs">
            {messages.map((message, i) => {
              const senderId = message.sender?._id || message.sender
              const isMe = String(senderId) === String(currentUserId)
              const senderObj = typeof message.sender === 'object' ? message.sender : null

              const isInstructor =
                String(senderId) ===
                  String(selectedChat?.groupAdmin?._id || selectedChat?.groupAdmin) ||
                senderObj?.role === 'teacher' ||
                senderObj?.role === 'admin'

              const senderName = isMe
                ? 'أنت'
                : `${senderObj?.firstName || ''} ${senderObj?.lastName || ''}`.trim() ||
                  senderObj?.name ||
                  'عضو'

              const avatar = isMe ? user?.avatar : senderObj?.avatar

              return (
                <ChatItem
                  key={message._id || `msg-${i}`}
                  isMe={isMe}
                  isInstructor={isInstructor}
                  fullName={senderName}
                  avatar={avatar}
                  message={message.content}
                  attachment={message.attachment}
                  sent_time={
                    message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''
                  }
                />
              )
            })}
            <div ref={messagesEndRef} />
          </Stack>
        ) : (
          <Center py="4rem" sx={{ flexDirection: 'column' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.brand[0],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <IconMessages size={32} color={theme.colors.brand[6]} />
            </Box>
            <Text fw={600} size="sm">
              لا توجد رسائل بعد
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              كن أول من يفتتح النقاش ويرسل رسالة في هذه المحادثة!
            </Text>
          </Center>
        )}
      </ScrollArea>

      {/* Modernized Bottom Input Dock */}
      <ChatInput
        handleSendMsg={sendMessage}
        setNewAttach={setNewAttach}
        newAttach={newAttach}
        loading={sending}
      />
    </Box>
  )
}

export default SingleChat
