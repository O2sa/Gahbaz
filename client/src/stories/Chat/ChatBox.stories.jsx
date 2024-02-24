import { ChatBox } from './ChatBox'

export default {
  component: ChatBox,
  title: 'ChatBox',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {

  return (
      <ChatBox  />
  )
}
