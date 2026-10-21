import React from 'react'
import { notifications } from '@mantine/notifications'
import { Center, Stack, Text } from '@mantine/core'
import { ChatState } from '../context/ChatProvider'
import customFetch from '../../utils/customFetch'
import UserListItem from './Aux/UserListItem'

function Search({ searchResults }) {
  const { setSelectedChat, chats, setChats } = ChatState()

  const accessChat = async (userId) => {
    try {
      const res = await customFetch.post('/chats/accessChat', { userId })
      const data = res?.data || res
      if (data?._id) {
        setChats((prev) => {
          const list = Array.isArray(prev) ? prev : []
          if (!list.find((c) => c._id === data._id)) {
            return [data, ...list]
          }
          return list
        })
        setSelectedChat(data)
      }
    } catch (error) {
      console.error('Error accessing chat:', error)
      notifications.show({
        color: 'red',
        title: 'خطأ',
        message: error?.response?.data?.message || 'تعذر فتح المحادثة مع هذا المستخدم',
      })
    }
  }

  return (
    <>
      {Array.isArray(searchResults) && searchResults.length !== 0 ? (
        <Stack sx={{ overflowY: 'auto', overflowX: 'hidden', gap: 0 }}>
          {searchResults.map((result) => (
            <UserListItem
              handleFunction={() => accessChat(result._id)}
              result={result}
              key={result._id}
            />
          ))}
        </Stack>
      ) : (
        <Center py="xl">
          <Text size="sm" c="dimmed">
            لم يتم العثور على مستخدمين
          </Text>
        </Center>
      )}
    </>
  )
}

export default Search
