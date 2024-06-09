import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChatProvider from './context/ChatProvider'
// import './chat_styles.css'
// import 'react-chat-elements/dist/main.css'
import { Box, Flex, ScrollArea, TextInput, Button, Paper } from '@mantine/core'

import Chat from './pages/Chat'
import Authorization from './pages/Authorization'

export default function ChatRoom() {
  return (
    <ChatProvider>
      <Box className="">
        <Chat />
      </Box>

    </ChatProvider>
  )
}
