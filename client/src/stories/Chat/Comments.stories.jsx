import { Comments } from './Comments'

export default {
  component: Comments,
  title: 'Comments',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
  return (
      <Comments  />
  )
}
