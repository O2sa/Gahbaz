import { useEffect, useState, useRef } from 'react'
// import { ToastContainer, toast } from "react-toastify";

import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { ChatState } from '../context/ChatProvider'
import { recieveMessageRoute, sendMessageRoute } from '../utils/APIRoutes'
import { toastOptions } from '../utils/constants'
import { isGroupRecieved, isAnotherSender, isLastMessage } from '../config/ChatLogics'

import ChatInput from './ChatInput'
import { MessageBox, MessageList } from 'react-chat-elements'
import { Box, Center, Divider, Loader, ScrollArea, Stack } from '@mantine/core'
import ChatItem from '../NewChat/components/ChatItem/ChatItem'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'

function SingleChatTest({ fetchAgain, socket, setFetchAgain, selectedChat }) {
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [newAttach, setNewAttach] = useState()
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef()
  const { user } = ChatState()

  // console.log(user)
  const sendMessage = async (msg) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('sender', user._id)
      formData.append('chatId', selectedChat._id)

      if (newAttach) formData.append('attachment', newAttach, newAttach.name)

      if (msg.length > 0) {
        formData.append('content', msg)
      } else {
        formData.append('content', '')
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put(`${sendMessageRoute}`, formData)
      socket.current.emit('new message', data)
      setMessages([...messages, data])
      socket.current.emit('contacts', data.chat)
      setNewAttach()
      setLoading(false)
    } catch (error) {
      console.error('Failed to send the Message', toastOptions)
    }
  }

  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`${recieveMessageRoute}/${selectedChat._id}`)
      setMessages(data)
      socket.current.emit('join chat', selectedChat._id)
      socket.current.emit('contacts', data.chat)
    } catch (error) {
      //toast.error("Failed to Load the Messages", toastOptions);
    }
  }

  useEffect(() => {
    fetchMessages() // eslint-disable-next-line
  }, [selectedChat])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('connected', () => setSocketConnected(true))
    } // eslint-disable-next-line
  }, [])

  const func = (newMessageRecieved) => {
    if (
      newMessageRecieved !== undefined &&
      newMessageRecieved !== null &&
      newMessageRecieved.length !== 0
    ) {
      setMessages([...messages, newMessageRecieved])
      socket.current.emit('contacts', newMessageRecieved.chat)
    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('message recieved', (newMessageRecieved) => {
        func(newMessageRecieved)
      })
    }
  })

  useEffect(() => {
    scrollRef.current?.scrollIntoView()
  }, [messages])

  return (
    <Box
      h={'90%'}
      // sx={{ display: 'grid', gridTemplateRows: ' 90% 10%', overflow: 'hidden', padding:'0' }}
      // className={`messages-container ${newAttach ? 'grid' : ''}`}
    >
      <Box h={'90%'} sx={{ overflowY: 'scroll', overflowX: 'hidden' }} className="">
        {messages ? (
          <MessageList
            className="message-list"
            lockable={false}
            //   toBottomHeight={'100%'}
            dataSource={messages.map((message, i) => ({
              position: isAnotherSender(message, user._id) ? 'left' : 'right',
              type: 'text',
              title: isAnotherSender(message, user._id)
                ? `${message.sender.firstName} ${message.sender.lastName}`
                : `${user.firstName} ${user.lastName}`,
              text: message.content,
              date: message.createdAt,
              key: uuidv4(),
              id: uuidv4(),
            }))}
          />
        ) : (
          loading && <ChatContactsLoader />
        )}
      </Box>
      <ChatInput handleSendMsg={sendMessage} setNewAttach={setNewAttach} newAttach={newAttach} />
    </Box>
  )
}

function SingleChat({ fetchAgain, socket, setFetchAgain, selectedChat }) {
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [newAttach, setNewAttach] = useState()
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = ChatState()
  const tablet_match = useMediaQuery('(max-width: 768px)')

  console.log(user)
  const sendMessage = async (msg) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('sender', user._id)
      formData.append('chatId', selectedChat._id)

      if (newAttach) formData.append('attachment', newAttach, newAttach.name)

      if (msg.length > 0) {
        formData.append('content', msg)
      } else {
        formData.append('content', '')
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put(`${sendMessageRoute}`, formData)
      socket.current.emit('new message', data)
      setMessages([...messages, data])
      socket.current.emit('contacts', data.chat)
      setNewAttach()
      setLoading(false)
    } catch (error) {
      console.error('Failed to send the Message', toastOptions)
    }
  }

  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`${recieveMessageRoute}/${selectedChat._id}`)
      setMessages(data)
      socket.current.emit('join chat', selectedChat._id)
      socket.current.emit('contacts', data.chat)
    } catch (error) {
      //toast.error("Failed to Load the Messages", toastOptions);
    }
  }

  useEffect(() => {
    fetchMessages() // eslint-disable-next-line
  }, [selectedChat])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('connected', () => setSocketConnected(true))
    } // eslint-disable-next-line
  }, [])

  const func = (newMessageRecieved) => {
    if (
      newMessageRecieved !== undefined &&
      newMessageRecieved !== null &&
      newMessageRecieved.length !== 0
    ) {
      setMessages([...messages, newMessageRecieved])
      socket.current.emit('contacts', newMessageRecieved.chat)
    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('message recieved', (newMessageRecieved) => {
        func(newMessageRecieved)
      })
    }
  })

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    console.log('messages', messages)
    scrollToBottom()
  }, [messages])

  return (
    <>
      <ScrollArea h={415}>
        <Stack px="lg" py="xl">
          {messages
            ? // <MessageList
              //   className="message-list"
              //   lockable={false}
              //   //   toBottomHeight={'100%'}

              //   dataSource={messages.map((message, i) => ({

              //     position: isAnotherSender(message, user._id) ? 'left' : 'right',
              //     type: 'text',
              //     title: isAnotherSender(message, user._id)
              //       ? `${message.sender.firstName} ${message.sender.lastName}`
              //       : `${user.firstName} ${user.lastName}`,
              //     text: <p dangerouslySetInnerHTML={{ __html: message?.content || '' }} />,
              //     date: message.createdAt,
              //     key: uuidv4(),
              //     id: uuidv4(),
              //   }))}
              // />
              messages.map((message, i) => (
                <>
                  <ChatItem
                    ml={isAnotherSender(message, user._id) ? 'auto' : 0}
                    // type="text"
                    fullName={
                      isAnotherSender(message, user._id)
                        ? `${message.sender.firstName} ${message.sender.lastName}`
                        : `أنت`
                    }
                    avatar={
                      isAnotherSender(message, user._id) ? message.sender.avatar : user.avatar
                    }
                    message={
                      <span dangerouslySetInnerHTML={{ __html: message?.content.trim() || '' }} />
                    }
                    sent_time={new Date(message.createdAt).toLocaleString()}
                    style={{ maxWidth: tablet_match ? '100%' : '70%' }}
                    key={uuidv4()}
                    id={uuidv4()}
                  />
                  <div ref={messagesEndRef} />
                </>
              ))
            : loading && <ChatContactsLoader />}
        </Stack>
      </ScrollArea>
      <Divider />

      <ChatInput handleSendMsg={sendMessage} setNewAttach={setNewAttach} newAttach={newAttach} />
    </>
  )
}

export default SingleChat
