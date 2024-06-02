import { useState, useEffect } from 'react'
// import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import { fetchChatsRoute } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'
import { getSender, getSenderProfilePic } from '../config/ChatLogics'
import GroupChatCreate from './Group/CreateGroupChat'
import customFetch from '../../utils/customFetch'
import { ChatList } from 'react-chat-elements'
import { ActionIcon, Center, Group, Loader, Stack } from '@mantine/core'
import { GrAddCircle } from 'react-icons/gr'
import { ChatContactsLoader, NoData } from '../../pages/LoadingComponents'
function Contacts({ fetchAgain, selectedChat, socket }) {
  const { setSelectedChat, chats, user, setChats } = ChatState()
  const [loading, setLoading] = useState(false)
  const [modalActive, setModalActive] = useState('not')

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

  return (
    <>
      <Group sx={{ position: 'relative' }}>
        {chats && chats.length !== 0 ? (
          <>
            <Stack w={'100%'}  mx={'xs'} sx={{ overflowX: 'hidden', gap:0 }}>
              {chats.map((chat) => {
                return (
                  <>
                    <ChatList
                      onClick={() => setSelectedChat(chat)}
                      key={chat._id}
                      className="chat-list "
                      dataSource={[
                        {
                          avatar: chat.isGroupChat
                            ? chat.groupPic
                            : getSenderProfilePic(user, chat.users),
                          alt: chat?.isGroupChat ? chat.chatName : getSender(user, chat.users),
                          title: chat?.isGroupChat ? chat.chatName : getSender(user, chat.users),
                          subtitle: chat?.latestMessage?.content,
                          date: chat?.latestMessage?.createdAt,
                          // .split('.')[0]
                          // .split('T')[1]
                          // .split(':', 2)
                          // .join(':')
                          unread: 2,
                        },
                      ]}
                    />
                  </>
                )
              })}
            </Stack>
            <ActionIcon
              variant="filled"
              radius={'xl'}
              size={'xl'}
              color="black"
              sx={{ position: 'sticky', bottom: '30px', left: '18rem' }}
              // className="add-group-chat"
              onClick={() => {
                setModalActive('active')
              }}
            >
              <GrAddCircle />
              {/* <button className="icon-button">+</button>
                  <span className="tooltiptext">New group chat</span> */}
            </ActionIcon>
          </>
        ) : loading ? (
          <ChatContactsLoader />
          
        ) : (
          <NoData />
        )}
      </Group>
      {modalActive === 'active' && <GroupChatCreate setModalActive={setModalActive} />}
      {/* <ToastContainer /> */}
    </>
  )
}

export default Contacts
