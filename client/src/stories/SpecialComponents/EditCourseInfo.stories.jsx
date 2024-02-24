import { EditCourseInfo } from './EditCourseInfo'
export default {
  component: EditCourseInfo,
  title: 'EditCourseInfo',
  tags: ['autodocs'],
  parameters: {
    direction: 'rtl',
  },
}

export const Default = () => {
  const courseInfo = {
    describtion: '',
    image: '',
    sallybals: ['', '', '', ''],
    requirements: ['', '', '', ''],
  }
  return <EditCourseInfo itemData={courseInfo} />
}
