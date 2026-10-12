import React from 'react'
import { Helmet } from 'react-helmet'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'
import { StudentDashboard } from '../student'
import { AdminDashboard } from '../admin'
import { TeacherDashboard } from '../teacher'

const Dashboard = ({ queryClient }) => {
  const { user } = useDashboardContext()

  const getComponent = () => {
    if (user?.__t === 'Admin') {
      return <AdminDashboard queryClient={queryClient} />
    } else if (user?.__t === 'Teacher') {
      return <TeacherDashboard queryClient={queryClient} />
    } else if (user?.__t === 'Student') {
      return <StudentDashboard queryClient={queryClient} />
    }
    return null
  }

  return (
    <div>
      <Helmet>
        <title>منصة جهبذ | الرئيسية</title>
      </Helmet>
      {getComponent()}
    </div>
  )
}

export default Dashboard
