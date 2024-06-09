import { Avatar, Group, Text } from '@mantine/core'
import { ChatItem, ChatList } from 'react-chat-elements'

const UserListItem = ({ handleFunction, result }) => {
  return (
    <ChatItem
      onClick={handleFunction}
      key={result._id}
      avatar={result.avatar}
      alt={result.firstName}
      title={`${result.firstName} ${result.lastName}`}
      subtitle={`${result.email} `}
    />
  )
}

export default UserListItem
