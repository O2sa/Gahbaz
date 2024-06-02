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
    <>
      {user && (
        <Surface
          component={Paper}
          {...PAPER_PROPS}
          style={{ height: tablet_match ? 'auto' : rem(565) }}
        >
          <Grid h={'90vh'} className="">
            <Grid.Col h={'100%'} p={'0'} bg={'white'} span={4} sx={{}}>
              {/* <UserInfo fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}

              <Group h={'10%'}>
                <form className="w-100" onSubmit={(event) => handleSearch(event)}>
                  <TextInput
                    m={'md'}
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
                    placeholder="Search or start new chat"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
              </Group>

              <Stack h={'80%'} sx={{ overflowY: 'scroll' }}>
                {!search || navState === 'start' ? (
                  <Contacts socket={socket} selectedChat={selectedChat} fetchAgain={fetchAgain} />
                ) : loading ? (
                  <Center>
                    <ChatContactsLoader />
                  </Center>
                ) : (
                  <Search socket={socket} searchResults={searchResults} />
                )}
              </Stack>
            </Grid.Col>

            <Grid.Col h={'100%'} sx={{ backgroundColor: '#E5E5E5' }} p={0} span={8}>
              {selectedChat ? (
                <ChatContainer
                  socket={socket}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              ) : (
                <div style={styles.welcome} className="">
                  <img style={styles.img} src={Robot} alt="Robot waves his palm" />
                  <h1>
                    Welcome,{' '}
                    <span style={styles.span}>{`${user.firstName} ${user.lastName}`}!</span>
                  </h1>
                  <h3>Select a chat to start messaging.</h3>
                </div>
              )}
            </Grid.Col>
          </Grid>
        </Surface>
      )}
      <ToastContainer />
    </>
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
