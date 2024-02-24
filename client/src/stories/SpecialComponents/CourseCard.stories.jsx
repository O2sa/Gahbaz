import { CourseCard } from './CourseCard'

export default {
  component: CourseCard,
  title: 'CourseCard',
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
      <CourseCard items={teachers} />
    </>
  )
}
