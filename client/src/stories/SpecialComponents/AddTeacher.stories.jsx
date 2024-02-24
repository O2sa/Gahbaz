import { AddTeacher } from './AddTeacher'

export default {
  component: AddTeacher,
  title: 'AddTeacher',
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
      <AddTeacher items={teachers} />
    </>
  )
}
