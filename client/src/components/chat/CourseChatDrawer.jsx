import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Drawer,
  Box,
  Stack,
  Group,
  Text,
  Title,
  ActionIcon,
  Button,
  Avatar,
  Badge,
  Textarea,
  FileButton,
  ScrollArea,
  Paper,
  Loader,
  Center,
  Image,
  Anchor,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import {
  IconMessageDots,
  IconSend,
  IconPaperclip,
  IconX,
  IconExternalLink,
  IconBook,
  IconUsers,
  IconFile,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { notifications } from '@mantine/notifications'
import customFetch from '../../utils/customFetch'
import { uploadMedia } from '../../utils/mediaUpload'
import { host } from '../../chat/utils/APIRoutes'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export default function CourseChatDrawer({ opened, onClose, courseId, courseName }) {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const { user } = useDashboardContext()

  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [sending, setSending] = useState(false)

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const currentUserId = user?._id || user?.id

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 1. Fetch or resolve course chat channel when drawer opens
  useEffect(() => {
    if (!opened || !courseId) return

    let isMounted = true
    setLoadingChat(true)

    const fetchCourseChat = async () => {
      try {
        const res = await customFetch.get(`/chats/course/${courseId}`)
        const channel = res?.data || res
        if (isMounted) {
          setChat(channel)
        }
      } catch (err) {
        console.error('Failed to resolve course chat:', err)
        notifications.show({
          color: 'red',
          title: 'تعذر فتح غرفة المحادثة',
          message: err?.response?.data?.message || 'تأكد من تسجيلك في هذا المقرر',
        })
      } finally {
        if (isMounted) setLoadingChat(false)
      }
    }

    fetchCourseChat()

    return () => {
      isMounted = false
    }
  }, [opened, courseId])

  // 2. Fetch messages once chat is loaded
  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return
    setLoadingMessages(true)
    try {
      const res = await customFetch.get(`/messages/getmsg/${chatId}`)
      const list = Array.isArray(res) ? res : (res?.data || [])
      setMessages(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to load messages for course chat:', err)
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    if (chat?._id) {
      fetchMessages(chat._id)
    }
  }, [chat?._id, fetchMessages])

  // 3. Socket.IO connection lifecycle
  useEffect(() => {
    if (!opened || !chat?._id) return

    const socket = io(host, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('setup', user)
      socket.emit('join chat', chat._id)
    })

    const handleIncomingMessage = (newMsg) => {
      if (!newMsg) return
      const targetChatId = newMsg?.chat?._id || newMsg?.chat
      if (String(targetChatId) === String(chat._id)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(newMsg._id))) {
            return prev
          }
          return [...prev, newMsg]
        })
      }
    }

    socket.on('message recieved', handleIncomingMessage)

    return () => {
      socket.off('message recieved', handleIncomingMessage)
      socket.disconnect()
      socketRef.current = null
    }
  }, [opened, chat?._id, user])

  // Auto scroll on messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 4. Send message handler
  const handleSendMessage = async () => {
    const text = messageText.trim()
    if (!text && !selectedFile) return
    if (!chat?._id) return

    setSending(true)
    try {
      let attachmentUrl = ''
      if (selectedFile) {
        try {
          const uploaded = await uploadMedia(selectedFile, { folder: 'chat' })
          attachmentUrl = uploaded?.url || uploaded?.key || ''
        } catch (uploadErr) {
          console.error('Attachment upload failed:', uploadErr)
          notifications.show({
            color: 'orange',
            title: 'فشل رفع المرفق',
            message: 'تعذر رفع الملف، جاري إرسال الرسالة النصية فقط',
          })
        }
      }

      const res = await customFetch.post('/messages/addmsg', {
        chatId: chat._id,
        content: text,
        attachment: attachmentUrl,
      })

      const data = res?.data || res

      if (socketRef.current) {
        socketRef.current.emit('new message', data)
        socketRef.current.emit('contacts', data.chat || chat)
      }

      setMessages((prev) => [...prev, data])
      setMessageText('')
      setSelectedFile(null)
    } catch (err) {
      console.error('Failed to send message in course chat:', err)
      notifications.show({
        color: 'red',
        title: 'خطأ في الإرسال',
        message: err?.response?.data?.message || 'تعذر إرسال الرسالة',
      })
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleOpenFullChat = () => {
    onClose()
    navigate(`/chat?courseId=${courseId}`)
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={500}
      title={
        <Group spacing="xs">
          <IconMessageDots size={22} color={theme.colors.brand[6]} />
          <Box>
            <Title order={5} sx={{ lineHeight: 1.2 }}>
              غرفة المناقشة الأكاديمية
            </Title>
            <Text size="xs" c="dimmed">
              {courseName || chat?.course?.name || 'المقرر الدراسي'}
            </Text>
          </Box>
        </Group>
      }
      styles={{
        header: {
          padding: '16px 20px',
          borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
          }`,
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 75px)',
          padding: 0,
        },
      }}
    >
      {/* Top Banner with Stats & Full Chat Link */}
      <Paper
        p="xs"
        px="md"
        sx={{
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
          }`,
        }}
      >
        <Group position="apart">
          <Group spacing="xs">
            <Badge
              leftSection={<IconUsers size={12} />}
              color="brand"
              variant="light"
              size="sm"
            >
              {chat?.users?.length || 0} مشارك
            </Badge>
            <Badge leftSection={<IconBook size={12} />} color="gray" variant="outline" size="sm">
              قناة رسمية
            </Badge>
          </Group>

          <Button
            size="xs"
            variant="subtle"
            color="brand"
            rightIcon={<IconExternalLink size={14} />}
            onClick={handleOpenFullChat}
          >
            فتح الشاشة الكاملة
          </Button>
        </Group>
      </Paper>

      {/* Message Feed */}
      <ScrollArea sx={{ flex: 1 }} p="md">
        {loadingChat || loadingMessages ? (
          <Center py="xl">
            <Loader size="md" variant="dots" />
          </Center>
        ) : messages && messages.length > 0 ? (
          <Stack spacing="md">
            {messages.map((msg, idx) => {
              const senderId = msg?.sender?._id || msg?.sender
              const isMe = String(senderId) === String(currentUserId)
              const senderObj = typeof msg?.sender === 'object' ? msg.sender : null
              const isInstructor =
                String(senderId) === String(chat?.groupAdmin?._id || chat?.groupAdmin) ||
                senderObj?.role === 'teacher' ||
                senderObj?.role === 'admin'

              const senderName = isMe
                ? 'أنت'
                : `${senderObj?.firstName || ''} ${senderObj?.lastName || ''}`.trim() ||
                  senderObj?.name ||
                  'مشارك'

              return (
                <Box
                  key={msg._id || `msg-${idx}`}
                  sx={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                  }}
                >
                  <Group
                    spacing="xs"
                    align="flex-start"
                    sx={{ flexDirection: isMe ? 'row-reverse' : 'row' }}
                  >
                    {!isMe && (
                      <Avatar
                        src={senderObj?.avatar}
                        radius="xl"
                        size="sm"
                        color={isInstructor ? 'yellow' : 'blue'}
                      >
                        {senderName.charAt(0)}
                      </Avatar>
                    )}

                    <Box>
                      {!isMe && (
                        <Group spacing={6} mb={2}>
                          <Text size="xs" fw={600}>
                            {senderName}
                          </Text>
                          {isInstructor && (
                            <Badge color="yellow" variant="filled" size="xs">
                              أستاذ المقرر
                            </Badge>
                          )}
                        </Group>
                      )}

                      <Paper
                        p="xs"
                        px="sm"
                        radius="md"
                        sx={{
                          backgroundColor: isMe
                            ? theme.colors.brand[6]
                            : theme.colorScheme === 'dark'
                            ? theme.colors.dark[6]
                            : theme.colors.gray[1],
                          color: isMe
                            ? '#ffffff'
                            : theme.colorScheme === 'dark'
                            ? theme.colors.dark[0]
                            : theme.black,
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg?.content && (
                          <Text size="sm" sx={{ whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </Text>
                        )}

                        {msg?.attachment && (
                          <Box mt="xs">
                            {/\.(jpg|jpeg|png|webp|gif)$/i.test(msg.attachment) ? (
                              <Image
                                src={msg.attachment}
                                radius="sm"
                                maw={220}
                                alt="Attachment"
                              />
                            ) : (
                              <Anchor
                                href={msg.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="xs"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: isMe ? '#ffffff' : theme.colors.brand[6],
                                  textDecoration: 'underline',
                                }}
                              >
                                <IconFile size={14} />
                                عرض الملف المرفق
                              </Anchor>
                            )}
                          </Box>
                        )}
                      </Paper>

                      <Text
                        size="10px"
                        c="dimmed"
                        mt={2}
                        sx={{ textAlign: isMe ? 'right' : 'left' }}
                      >
                        {msg?.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </Text>
                    </Box>
                  </Group>
                </Box>
              )
            })}
            <div ref={messagesEndRef} />
          </Stack>
        ) : (
          <Center py="xl" sx={{ height: '100%', flexDirection: 'column' }}>
            <IconMessageDots size={40} color={theme.colors.gray[4]} />
            <Text c="dimmed" size="sm" mt="sm">
              لا توجد رسائل سابقة في غرفة المناقشة.
            </Text>
            <Text c="dimmed" size="xs">
              اطرح أسئلتك أو شارك معلوماتك الأكاديمية مع زملائك وأستاذ المقرر!
            </Text>
          </Center>
        )}
      </ScrollArea>

      {/* Selected File Chip */}
      {selectedFile && (
        <Paper
          p="xs"
          px="md"
          withBorder
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          }}
        >
          <Group position="apart">
            <Group spacing="xs">
              <IconFile size={16} />
              <Text size="xs" truncate maw={300}>
                {selectedFile.name}
              </Text>
            </Group>
            <ActionIcon size="xs" color="red" variant="subtle" onClick={() => setSelectedFile(null)}>
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Paper>
      )}

      {/* Input Box Footer */}
      <Paper
        p="sm"
        sx={{
          borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
          }`,
        }}
      >
        <Group spacing="xs" align="flex-end">
          <FileButton
            onChange={setSelectedFile}
            accept="image/png,image/jpeg,image/webp,application/pdf,.doc,.docx,.zip"
          >
            {(props) => (
              <Tooltip label="إرفاق ملف أو صورة">
                <ActionIcon {...props} size="lg" variant="light" color="gray" radius="md">
                  <IconPaperclip size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </FileButton>

          <Textarea
            placeholder="اكتب استفسارك أو رسالتك الأكاديمية... (اضغط Enter للإرسال)"
            autosize
            minRows={1}
            maxRows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            sx={{ flex: 1 }}
          />

          <ActionIcon
            size="lg"
            color="brand"
            variant="filled"
            radius="md"
            loading={sending}
            disabled={!messageText.trim() && !selectedFile}
            onClick={handleSendMessage}
          >
            <IconSend size={18} />
          </ActionIcon>
        </Group>
      </Paper>
    </Drawer>
  )
}
