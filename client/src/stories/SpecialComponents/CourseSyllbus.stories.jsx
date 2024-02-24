import { CourseSyllabus } from './CourseSyllbus'

export default {
  component: CourseSyllabus,
  title: 'CourseSyllabus',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {

  return (
    <>
      <CourseSyllabus  />
    </>
  )
}
