import React from 'react'
import { Box } from '@mantine/core'
import { Helmet } from 'react-helmet'
import ChatProvider from './context/ChatProvider'
import Chat from './pages/Chat'

export default function ChatRoom() {
  return (
    <ChatProvider>
      <Helmet>
        <title>منصة جهبذ | المحادثات</title>
      </Helmet>
      <Box>
        <Chat />
      </Box>
    </ChatProvider>
  )
}
