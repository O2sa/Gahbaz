import React from 'react'
import { Helmet } from 'react-helmet'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'
import { StudentDashboard } from '../student'
import { AdminDashboard } from '../admin'
import { TeacherDashboard } from '../teacher'

const Dashboard = ({ queryClient }) => {
  const { user } = useDashboardContext()

  const getComponent = () => {
    const role = (user?.role || user?.__t || 'admin').toLowerCase()
    if (role === 'teacher') {
      return <TeacherDashboard queryClient={queryClient} />
    } else if (role === 'student') {
      return <StudentDashboard queryClient={queryClient} />
    }
    // Default to admin dashboard
    return <AdminDashboard queryClient={queryClient} />
  }

  return (
    <div>
      <Helmet>
        <title>منصة جهبذ | لوحة التحكم</title>
      </Helmet>
      {getComponent()}
    </div>
  )
}

export default Dashboard
