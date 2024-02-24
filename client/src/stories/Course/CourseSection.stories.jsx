import { CourseSection } from './CourseSection'

export default {
  component: CourseSection,
  title: 'CourseSection',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {

  return (
    <>
      <CourseSection  />
    </>
  )
}
