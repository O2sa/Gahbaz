import { CourseContent } from './CourseContent'


export default {
  component: CourseContent,
  title: 'CourseContent',
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
      <CourseContent items={teachers} />
    </>
  )
}
