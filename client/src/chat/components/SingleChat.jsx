import { useEffect, useState, useRef, useCallback } from 'react'
import { Box, Center, Divider, Loader, ScrollArea, Stack, Text, Anchor, Image, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import customFetch from '../../utils/customFetch'
import { uploadMedia } from '../../utils/mediaUpload'
import { ChatState } from '../context/ChatProvider'
import { isAnotherSender } from '../config/ChatLogics'
import ChatInput from './ChatInput'
import ChatItem from '../NewChat/components/ChatItem/ChatItem'

function SingleChat({ fetchAgain, socket, setFetchAgain, selectedChat }) {
  const [messages, setMessages] = useState([])
  const [newAttach, setNewAttach] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = ChatState()
  const tabletMatch = useMediaQuery('(max-width: 768px)')

  const currentUserId = user?._id || user?.id

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
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
        message: error?.response?.data?.message || 'تعذر تحميل الرسائل الحالية',
      })
    } finally {
      setLoading(false)
    }
  }, [selectedChat?._id, socket])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = async (msg) => {
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
            message: 'تعذر رفع المرفق، سيتم إرسال الرسالة النصية فقط',
          })
        }
      }

      const res = await customFetch.post('/messages/addmsg', {
        chatId: selectedChat._id,
        content: msg || '',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 480 }}>
      <ScrollArea sx={{ flex: 1, maxHeight: 440 }} p="md">
        {loading ? (
          <Center py="xl">
            <Loader size="md" variant="dots" />
          </Center>
        ) : messages && messages.length > 0 ? (
          <Stack spacing="md">
            {messages.map((message, i) => {
              const isOther = isAnotherSender(message, currentUserId)
              const senderName = isOther
                ? `${message.sender?.firstName || ''} ${message.sender?.lastName || ''}`.trim() || 'عضو'
                : 'أنت'
              const avatar = isOther ? message.sender?.avatar : user?.avatar

              return (
                <Box key={message._id || `msg-${i}`}>
                  <ChatItem
                    ml={isOther ? 'auto' : 0}
                    fullName={senderName}
                    avatar={avatar}
                    message={
                      <Box>
                        {message?.content && (
                          <span dangerouslySetInnerHTML={{ __html: message.content.trim() }} />
                        )}
                        {message?.attachment && (
                          <Box mt="xs">
                            {/\.(jpg|jpeg|png|webp|gif)$/i.test(message.attachment) ? (
                              <Image
                                src={message.attachment}
                                radius="md"
                                maw={220}
                                alt="Attachment"
                              />
                            ) : (
                              <Anchor
                                href={message.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="xs"
                                color="blue"
                              >
                                📎 فتح المرفق
                              </Anchor>
                            )}
                          </Box>
                        )}
                      </Box>
                    }
                    sent_time={
                      message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''
                    }
                    style={{ maxWidth: tabletMatch ? '100%' : '75%' }}
                  />
                </Box>
              )
            })}
            <div ref={messagesEndRef} />
          </Stack>
        ) : (
          <Center py="xl">
            <Text c="dimmed" size="sm">
              لا توجد رسائل سابقة. ابدأ المحادثة الآن!
            </Text>
          </Center>
        )}
      </ScrollArea>

      <Divider />

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
