import { Comment } from './Comment'

export default {
  component: Comment,
  title: 'Comment',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {

  return (
    <>
      <Comment  />
    </>
  )
}
