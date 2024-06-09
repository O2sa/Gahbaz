import { useEffect, useState, useRef, forwardRef } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { SlMagnifier } from 'react-icons/sl'
import { IoIosArrowBack } from 'react-icons/io'
import { GrFormClose } from 'react-icons/gr'
import { io } from 'socket.io-client'

import axios from 'axios'

import { ChatState } from '../context/ChatProvider'
import { allUsersRoute, host } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'

import ChatContainer from '../components/ChatContainer'
import Contacts from '../components/Contacts'
import Search from '../components/Search'
import UserInfo from '../components/UserInfo'

import Robot from '../assets/robot.gif'
import {
  ActionIcon,
  Box,
  Grid,
  Loader,
  Stack,
  TextInput,
  Center,
  Group,
  createPolymorphicComponent,
  rem,
  Paper,
  Container,
  Image,
  ScrollArea,
} from '@mantine/core'
import { ChatContactsLoader } from '../../pages/LoadingComponents'
import { useMediaQuery } from '@mantine/hooks'

const styles = {
  welcome: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#121212',
    flexDirection: 'column',
    backgroundColor: '#E5E5E5',
  },
  img: {
    height: '20rem',
  },
  span: {
    color: '#B1454A',
  },
}

const PAPER_PROPS = {
  shadow: 'md',
  radius: 'md',
}

function Chat() {
  const tablet_match = useMediaQuery('(max-width: 768px)')

  const socket = useRef()
  const [loading, setLoading] = useState(false)
  const [fetchAgain, setFetchAgain] = useState(false)
  const [searchResults, setSearchResult] = useState([])
  const [search, setSearch] = useState('')
  const [navState, setNavState] = useState('start')

  const { selectedChat, user } = ChatState()

  // search function
  const handleSearch = async (event) => {
    event.preventDefault()
    if (!search) {
      toast.error('Please Enter something in search', toastOptions)
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const getUsers = async () => {
        const { data } = await axios.get(`${allUsersRoute}?search=${search}`)
        setLoading(false)
        setSearchResult(data)
      }
      getUsers()
      setNavState('add-trip')
    } catch (error) {
      setLoading(true)
      toast.error('Error in searching user', toastOptions)
    }
  }

  //socket connection
  // useEffect(() => {
  //   if (user) {
  socket.current = io(host)
  socket.current.emit('setup', user._id)
  //   }
  // }, [user]);

  return (
    <Container fluid>
      {user && (
        <Surface
          component={Paper}
          {...PAPER_PROPS}
          style={{ height: tablet_match ? 'auto' : rem(565), overflow: 'hidden' }}
        >
          <Grid gutter={0} h={'100%'}>
            <Grid.Col span={12} sm={4} md={4} lg={3} h={'100%'}>
              {/* <UserInfo fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}

              <Stack py="md" style={{ height: '100%' }}>
                <Box px="sm">
                  <form onSubmit={(event) => handleSearch(event)}>
                    <TextInput
                      leftSection={
                        search && (
                          <ActionIcon
                            // className="right-button"
                            onClick={() => {
                              setSearch('')
                            }}
                          >
                            <GrFormClose />
                          </ActionIcon>
                        )
                      }
                      rightSection={
                        navState === 'add-trip' && search ? (
                          <ActionIcon
                            onClick={() => {
                              setNavState('start')
                            }}
                          >
                            <IoIosArrowBack />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            type="submit"
                            // className="search__button"
                          >
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
                {/* <ScrollArea> */}
                {!search || navState === 'start' ? (
                  <Contacts socket={socket} selectedChat={selectedChat} fetchAgain={fetchAgain} />
                ) : loading ? (
                  <Center>
                    <ChatContactsLoader />
                  </Center>
                ) : (
                  <Search socket={socket} searchResults={searchResults} />
                )}
                {/* </ScrollArea> */}
              </Stack>
            </Grid.Col>

            <Grid.Col span={12} sm={8} md={8} lg={9}>
              {selectedChat ? (
                <ChatContainer
                  socket={socket}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              ) : (
                <Box
                  bg={'gray.1'}
                  sx={(theme) => ({
                    borderLeft: `1px solid ${theme.colors.gray[3]}`,
                  })}
                >
                  {/* <Image w={'200px'} src={Robot} alt="Robot waves his palm" />
                  <h1>
                    Welcome,{' '}
                    <span style={styles.span}>{`${user.firstName} ${user.lastName}`}!</span>
                  </h1>
                  <h3>Select a chat to start messaging.</h3> */}
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
