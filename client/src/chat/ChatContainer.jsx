import React from 'react'
import { Box } from '@mantine/core'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import ChatProvider from './context/ChatProvider'
import Chat from './pages/Chat'

export default function ChatRoom() {
  const { t } = useTranslation('chat')

  return (
    <ChatProvider>
      <Helmet>
        <title>{t('meta.title')}</title>
      </Helmet>
      <Box>
        <Chat />
      </Box>
    </ChatProvider>
  )
}
