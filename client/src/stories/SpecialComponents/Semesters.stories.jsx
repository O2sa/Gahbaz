import { Semesters } from './Semesters'

export default {
  component: Semesters,
  title: 'SemesterDetails',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
  // Sample rows data
  const semesters = [
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
  ]

  return (
    <>
      <Semesters rows={semesters} />
    </>
  )
}
