import { Avatar, Group, Text } from '@mantine/core'
import ChatsList from '../../NewChat/components/ChatsList/ChatsList'

const UserListItem = ({ handleFunction, result }) => {
  return (
    <ChatsList
      onClick={handleFunction}
      key={result._id}
      avatar={result.avatar}
      alt={result.firstName}
      firstName={`${result.firstName} ${result.lastName}`}
      lastMessage={`${result.email} `}
    />
  )
}

export default UserListItem
