import { Avatar, Group, Text } from '@mantine/core'
import { ChatList } from 'react-chat-elements'

const UserListItem = ({ handleFunction, result }) => {
  return (
    <ChatList
      className="chat-list"
      onClick={handleFunction}
      dataSource={[
        {
          avatar: result.avatar,
          alt: result.firstName,
          title: `${result.firstName} ${result.lastName}`,
          subtitle: `${result.email} `,
          date: '',
          dateString: '',
        },
      ]}
    />
  )
}

export default UserListItem
