import { useState, useEffect } from 'react'
// import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import { fetchChatsRoute } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'
import { getSender, getSenderFull, getSenderProfilePic } from '../config/ChatLogics'
import GroupChatCreate from './Group/CreateGroupChat'
import customFetch from '../../utils/customFetch'
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
} from '@mantine/core'
import { GrAddCircle } from 'react-icons/gr'
import { ChatContactsLoader, NoData } from '../../pages/LoadingComponents'
import { useMediaQuery } from '@mantine/hooks'
import { Carousel } from '@mantine/carousel'
import { IconSearch } from '@tabler/icons-react'
import ChatsList from '../NewChat/components/ChatsList/ChatsList'
import { replaceHTML } from '../../utils/uisText'
import { isUserActive } from '../../utils/UsersUtils'

function Contacts({ fetchAgain, selectedChat, socket }) {
  const { setSelectedChat, chats, user, setChats } = ChatState()
  const [loading, setLoading] = useState(false)
  const [modalActive, setModalActive] = useState('not')
  const tablet_match = useMediaQuery('(max-width: 768px)')

  const fetchChats = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${fetchChatsRoute}`)
      setChats(data)
      setLoading(false)
    } catch (error) {
      setLoading(true)
      //toast.error("Failed to load the chats", toastOptions);
    }
  }

  useEffect(() => {
    fetchChats() // eslint-disable-next-line
  }, [fetchAgain])

  const newChat = (data) => {
    if (chats !== undefined && chats.length !== 0 && data !== undefined) {
      return chats.map((chat) => {
        var temp = Object.assign({}, chat)
        if (temp._id === data._id) temp.latestMessage = data.latestMessage
        return temp
      })
    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('contacts', (data) => {
        setChats(newChat(data))
      })
    }
  })

  const checkActive = (chat) => {
    if (chat.isGroupChat) return true

    return getSenderFull(user, chat.users).lastActivity
      ? isUserActive(getSenderFull(user, chat.users).lastActivity)
      : true
  }
  return (
    <>
      {tablet_match ? (
        <>
          <Carousel
            height="100%"
            align="start"
            slidesToScroll={1}
            px={32}
            slideSize={{
              base: '27.5%',
              sm: '37.5%',
              md: '22.5%',
              lg: '25%',
            }}
            slideGap={{ base: 0, sm: 'md', md: 'md', lg: 'lg' }}
          >
            {loading
              ? Array.from({ length: 6 }).map((o, i) => (
                  <Carousel.Slide key={`chat-carousel-list-${i}`} mr="md">
                    <Skeleton height={48} />
                  </Carousel.Slide>
                ))
              : chats.length > 0 &&
                chats.map((chat) => (
                  <Carousel.Slide key={`carousel-${chat._id}`}>
                    <ChatsList
                      onClick={() => setSelectedChat(chat)}
                      key={chat._id}
                      avatar={
                        chat.isGroupChat ? chat.groupPic : getSenderProfilePic(user, chat.users)
                      }
                      // alt={chat?.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                      firstName={chat?.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                      lastMessage={
                        <p
                          dangerouslySetInnerHTML={{ __html: chat?.latestMessage?.content || '' }}
                        />
                      }
                      // date={chat?.latestMessage?.createdAt}
                      // unread={2}
                    />
                  </Carousel.Slide>
                ))}
          </Carousel>
          <Divider />
        </>
      ) : (
        <Stack sx={{ overflowY: 'auto', overflowX: 'hidden', gap: 0 }}>
          {loading
            ? Array.from({ length: 6 }).map((o, i) => (
                <Box key={`chat-list-${i}`}>
                  <Skeleton height={48} radius={0} />
                  <Divider />
                </Box>
              ))
            : chats?.length > 0 &&
              chats?.map((chat) => (
                <ChatsList
                  onClick={() => setSelectedChat(chat)}
                  key={chat._id}
                  active={checkActive(chat)}
                  avatar={chat.isGroupChat ? chat.groupPic : getSenderProfilePic(user, chat.users)}
                  // alt={chat?.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                  firstName={chat?.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                  lastMessage={
                    // <p dangerouslySetInnerHTML={{ __html: chat?.latestMessage?.content || '' }} />
                    chat.latestMessage ? replaceHTML(chat?.latestMessage?.content) : ''
                  }
                  // date={chat?.latestMessage?.createdAt}
                  // unread={2}
                />
              ))}
        </Stack>
      )}
    </>
  )
}

export default Contacts
