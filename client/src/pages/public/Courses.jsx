import React from 'react'
import { Helmet } from 'react-helmet'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'
import { StudentCourses } from '../student'
import { TeacherCourses } from '../teacher'

const Courses = ({ queryClient }) => {
  const { user } = useDashboardContext()

  const getComponent = () => {
    if (user?.__t === 'Teacher') {
      return <TeacherCourses queryClient={queryClient} />
    } else if (user?.__t === 'Student') {
      return <StudentCourses queryClient={queryClient} />
    }
    return null
  }

  return (
    <div>
      <Helmet>
        <title>منصة جهبذ | الدورات</title>
      </Helmet>
      {getComponent()}
    </div>
  )
}

export default Courses
