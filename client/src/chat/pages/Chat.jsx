import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { notifications } from '@mantine/notifications'
import {
  ActionIcon,
  Box,
  Grid,
  Loader,
  Stack,
  TextInput,
  Center,
  createPolymorphicComponent,
  Paper,
  Container,
  Title,
  Text,
  Group,
  ThemeIcon,
  SimpleGrid,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconSearch,
  IconX,
  IconArrowLeft,
  IconMessages,
  IconBook,
  IconPaperclip,
  IconShieldCheck,
  IconUsers,
} from '@tabler/icons-react'

import { ChatState } from '../context/ChatProvider'
import { allUsersRoute, host } from '../utils/APIRoutes'
import customFetch from '../../utils/customFetch'

import ChatContainer from '../components/ChatContainer'
import Contacts from '../components/Contacts'
import Search from '../components/Search'

function Chat() {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const tabletMatch = useMediaQuery('(max-width: 768px)')
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')

  const socket = useRef()
  const [loading, setLoading] = useState(false)
  const [fetchAgain, setFetchAgain] = useState(false)
  const [searchResults, setSearchResult] = useState([])
  const [search, setSearch] = useState('')
  const [navState, setNavState] = useState('start')

  const { selectedChat, setSelectedChat, user } = ChatState()
  const currentUserId = user?._id || user?.id

  // 1. Deep-link handling: if URL contains courseId, auto-resolve and select course chat
  useEffect(() => {
    if (!courseId) return
    let isMounted = true

    const resolveCourseChat = async () => {
      try {
        setLoading(true)
        const res = await customFetch.get(`/chats/course/${courseId}`)
        const channel = res?.data || res
        if (isMounted && channel?._id) {
          setSelectedChat(channel)
        }
      } catch (err) {
        console.error('Failed to resolve course chat for deep-link:', err)
        notifications.show({
          color: 'red',
          title: 'تعذر فتح المحادثة',
          message: err?.response?.data?.message || 'لم نتمكن من فتح محادثة المقرر المحدد',
        })
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    resolveCourseChat()

    return () => {
      isMounted = false
    }
  }, [courseId, setSelectedChat])

  // 2. Search users handler
  const handleSearch = async (event) => {
    event.preventDefault()
    if (!search?.trim()) {
      notifications.show({
        color: 'yellow',
        title: 'تنبيه',
        message: 'يرجى إدخال اسم للبحث عنه',
      })
      return
    }
    try {
      setLoading(true)
      const res = await customFetch.get(
        `${allUsersRoute}?search=${encodeURIComponent(search.trim())}`
      )
      const data = res?.data || (Array.isArray(res) ? res : [])
      setSearchResult(Array.isArray(data) ? data : [])
      setNavState('add-trip')
    } catch (error) {
      console.error('Error searching user:', error)
      notifications.show({
        color: 'red',
        title: 'خطأ',
        message: 'تعذر إتمام البحث عن المستخدم',
      })
    } finally {
      setLoading(false)
    }
  }

  // 3. Socket.IO connection
  useEffect(() => {
    if (currentUserId) {
      socket.current = io(host, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      })
      socket.current.emit('setup', currentUserId)

      return () => {
        if (socket.current) {
          socket.current.disconnect()
        }
      }
    }
  }, [currentUserId])

  // Handle mobile responsive display: either sidebar or conversation
  const showSidebar = !tabletMatch || !selectedChat
  const showConversation = !tabletMatch || Boolean(selectedChat)

  return (
    <Container fluid p={0} px="md" pb="md">
      {user && (
        <Surface
          component={Paper}
          radius="lg"
          withBorder
          sx={{
            height: tabletMatch ? 'calc(100vh - 105px)' : 'calc(100vh - 125px)',
            minHeight: 520,
            overflow: 'hidden',
            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            boxShadow: isDark
              ? '0 8px 30px rgba(0, 0, 0, 0.4)'
              : '0 6px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Grid gutter={0} h="100%">
            {/* Left Column: Chat Contacts & Search */}
            {showSidebar && (
              <Grid.Col
                span={12}
                sm={5}
                md={4}
                lg={3.5}
                sx={{
                  height: '100%',
                  borderLeft: `1px solid ${
                    isDark ? theme.colors.dark[5] : theme.colors.gray[2]
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Search Header */}
                <Box
                  p="sm"
                  px="md"
                  sx={{
                    borderBottom: `1px solid ${
                      isDark ? theme.colors.dark[5] : theme.colors.gray[2]
                    }`,
                    backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                  }}
                >
                  <form onSubmit={handleSearch}>
                    <TextInput
                      icon={<IconSearch size={16} />}
                      rightSection={
                        search ? (
                          <ActionIcon size="xs" color="gray" onClick={() => setSearch('')}>
                            <IconX size={14} />
                          </ActionIcon>
                        ) : null
                      }
                      placeholder="ابحث عن طالب أو أستاذ..."
                      radius="md"
                      size="sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      styles={{
                        input: {
                          backgroundColor: isDark
                            ? theme.colors.dark[6]
                            : theme.colors.gray[0],
                          borderColor: isDark
                            ? theme.colors.dark[4]
                            : theme.colors.gray[3],
                        },
                      }}
                    />
                  </form>
                </Box>

                {/* Contacts / Search List */}
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  {!search || navState === 'start' ? (
                    <Contacts
                      socket={socket}
                      selectedChat={selectedChat}
                      fetchAgain={fetchAgain}
                    />
                  ) : loading ? (
                    <Center py="xl">
                      <Loader size="sm" color="brand" />
                    </Center>
                  ) : (
                    <Search socket={socket} searchResults={searchResults} />
                  )}
                </Box>
              </Grid.Col>
            )}

            {/* Right Column: Active Chat or Welcome Hero */}
            {showConversation && (
              <Grid.Col
                h="100%"
                span={12}
                sm={tabletMatch ? 12 : 7}
                md={tabletMatch ? 12 : 8}
                lg={tabletMatch ? 12 : 8.5}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                {selectedChat ? (
                  <ChatContainer
                    socket={socket}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 32,
                      backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0],
                    }}
                  >
                    <Stack align="center" spacing="xl" maw={560} ta="center">
                      {/* Gradient Glowing Icon */}
                      <Box
                        sx={{
                          width: 88,
                          height: 88,
                          borderRadius: 24,
                          background: `linear-gradient(135deg, ${theme.colors.brand[6]}, ${theme.colors.cyan[5]})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 12px 28px ${theme.colors.brand[4]}40`,
                          color: '#ffffff',
                        }}
                      >
                        <IconMessages size={46} stroke={1.8} />
                      </Box>

                      {/* Welcome Titles */}
                      <Box>
                        <Title order={2} sx={{ fontWeight: 800 }}>
                          مرحباً بك في مركز المحادثات،{' '}
                          <Text component="span" color="brand">
                            {user.firstName || user.name || ''}
                          </Text>{' '}
                          👋
                        </Title>
                        <Text size="sm" c="dimmed" mt="xs" lh={1.6}>
                          اختر محادثة من القائمة الجانبية للبدء، أو انضم إلى غرف المناقشة الرسمية
                          للمقررات الدراسية للتواصل المباشر مع الأساتذة والزملاء.
                        </Text>
                      </Box>

                      {/* Feature Highlights Grid */}
                      <SimpleGrid cols={3} spacing="md" mt="sm" w="100%">
                        <Paper
                          p="sm"
                          radius="md"
                          withBorder
                          sx={{
                            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                          }}
                        >
                          <ThemeIcon
                            size={36}
                            radius="md"
                            color="teal"
                            variant="light"
                            mx="auto"
                            mb="xs"
                          >
                            <IconBook size={20} />
                          </ThemeIcon>
                          <Text size="xs" fw={700}>
                            غرف المقررات
                          </Text>
                          <Text size="10px" c="dimmed" mt={2}>
                            مناقشة أكاديمية معتمدة
                          </Text>
                        </Paper>

                        <Paper
                          p="sm"
                          radius="md"
                          withBorder
                          sx={{
                            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                          }}
                        >
                          <ThemeIcon
                            size={36}
                            radius="md"
                            color="blue"
                            variant="light"
                            mx="auto"
                            mb="xs"
                          >
                            <IconPaperclip size={20} />
                          </ThemeIcon>
                          <Text size="xs" fw={700}>
                            مشاركة المرفقات
                          </Text>
                          <Text size="10px" c="dimmed" mt={2}>
                            ملفات وواجبات وصور
                          </Text>
                        </Paper>

                        <Paper
                          p="sm"
                          radius="md"
                          withBorder
                          sx={{
                            backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                          }}
                        >
                          <ThemeIcon
                            size={36}
                            radius="md"
                            color="indigo"
                            variant="light"
                            mx="auto"
                            mb="xs"
                          >
                            <IconShieldCheck size={20} />
                          </ThemeIcon>
                          <Text size="xs" fw={700}>
                            اتصال موثوق
                          </Text>
                          <Text size="10px" c="dimmed" mt={2}>
                            تواصل لحظي محمي
                          </Text>
                        </Paper>
                      </SimpleGrid>
                    </Stack>
                  </Box>
                )}
              </Grid.Col>
            )}
          </Grid>
        </Surface>
      )}
    </Container>
  )
}

const Surface = createPolymorphicComponent(
  forwardRef(({ children, ...others }, ref) => (
    <Box component="div" {...others} ref={ref}>
      {children}
    </Box>
  ))
)

export default Chat
