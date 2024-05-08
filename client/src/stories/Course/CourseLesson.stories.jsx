import { CourseLesson } from './CourseLesson'

export default {
  component: CourseLesson,
  title: 'CourseLesson',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}




export const Default = () => {
 const teachers=[
    {
        name:'أحمد علي قاسم عبدالله',
        id:'09348984'
    },    {
        name:'أحمد علي قاسم عبدالله',
        id:'09348984'
    },
 ]
  return (
    <>
      <CourseLesson items={teachers} />
    </>
  )
}
