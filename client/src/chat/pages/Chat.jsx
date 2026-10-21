import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlMagnifier } from 'react-icons/sl'
import { IoIosArrowBack } from 'react-icons/io'
import { GrFormClose } from 'react-icons/gr'
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
  rem,
  Paper,
  Container,
  Image,
  Title,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import { ChatState } from '../context/ChatProvider'
import { allUsersRoute, host } from '../utils/APIRoutes'
import customFetch from '../../utils/customFetch'

import ChatContainer from '../components/ChatContainer'
import Contacts from '../components/Contacts'
import Search from '../components/Search'
import Robot from '../assets/robot.gif'

const PAPER_PROPS = {
  shadow: 'md',
  radius: 'md',
}

function Chat() {
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
      const res = await customFetch.get(`${allUsersRoute}?search=${encodeURIComponent(search.trim())}`)
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

  return (
    <Container fluid>
      {user && (
        <Surface
          component={Paper}
          {...PAPER_PROPS}
          style={{ height: tabletMatch ? 'auto' : rem(565), overflow: 'hidden' }}
        >
          <Grid gutter={0} h={'100%'}>
            <Grid.Col span={12} sm={4} md={4} lg={3} h={'100%'}>
              <Stack py="md" style={{ height: '100%' }}>
                <Box px="sm">
                  <form onSubmit={handleSearch}>
                    <TextInput
                      leftSection={
                        search && (
                          <ActionIcon onClick={() => setSearch('')}>
                            <GrFormClose />
                          </ActionIcon>
                        )
                      }
                      rightSection={
                        navState === 'add-trip' && search ? (
                          <ActionIcon onClick={() => setNavState('start')}>
                            <IoIosArrowBack />
                          </ActionIcon>
                        ) : (
                          <ActionIcon type="submit">
                            <SlMagnifier />
                          </ActionIcon>
                        )
                      }
                      type="text"
                      placeholder="ابحث عن مستخدم لبدء محادثة"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                </Box>

                {!search || navState === 'start' ? (
                  <Contacts socket={socket} selectedChat={selectedChat} fetchAgain={fetchAgain} />
                ) : loading ? (
                  <Center py="md">
                    <Loader size="sm" />
                  </Center>
                ) : (
                  <Search socket={socket} searchResults={searchResults} />
                )}
              </Stack>
            </Grid.Col>

            <Grid.Col h={'100%'} span={12} sm={8} md={8} lg={9}>
              {selectedChat ? (
                <ChatContainer
                  socket={socket}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              ) : (
                <Box
                  sx={(theme) => ({
                    borderLeft: `1px solid ${theme.colors.gray[3]}`,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <Center>
                    <Stack align="center" spacing="md">
                      <Image w={'80%'} maw={320} src={Robot} alt="Robot waves his palm" />
                      <Box ta={'center'}>
                        <Title order={2}>
                          أهلاً بك،{' '}
                          <Text color="brand" sx={{ display: 'inline' }}>
                            {`${user.firstName || ''} ${user.lastName || ''}`}!
                          </Text>
                        </Title>
                        <Title order={4} c="dimmed" mt="xs">
                          قم باختيار محادثة أو مقرر دراسي لتبدأ المراسلة
                        </Title>
                      </Box>
                    </Stack>
                  </Center>
                </Box>
              )}
            </Grid.Col>
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
  )),
)

export default Chat
