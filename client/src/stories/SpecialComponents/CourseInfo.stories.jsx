import { CourseInfo } from './CourseInfo'

export default {
  component: CourseInfo,
  title: 'CourseInfo',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {

  return (
    <>
      <CourseInfo  />
    </>
  )
}
