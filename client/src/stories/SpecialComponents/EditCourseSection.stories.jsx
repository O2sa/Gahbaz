import { EditCourseSection } from './EditCourseSection'

export default {
  component: EditCourseSection,
  title: 'EditCourseSection',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {

  return (
    <>
      <EditCourseSection  />
    </>
  )
}
