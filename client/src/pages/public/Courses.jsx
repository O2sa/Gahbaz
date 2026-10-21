import React from 'react'
import { Helmet } from 'react-helmet'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'
import { StudentCourses } from '../student'
import { TeacherCourses } from '../teacher'

const Courses = ({ queryClient }) => {
  const { user } = useDashboardContext()

  const role = (user?.role || user?.__t || '').toLowerCase()
  const isStudent = role === 'student'

  return (
    <div>
      <Helmet>
        <title>منصة جهبذ | المقررات الدراسية</title>
      </Helmet>
      {isStudent ? (
        <StudentCourses queryClient={queryClient} />
      ) : (
        <TeacherCourses queryClient={queryClient} />
      )}
    </div>
  )
}

export default Courses
