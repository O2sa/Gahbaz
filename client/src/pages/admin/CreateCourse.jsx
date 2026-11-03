import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { TabsLinks } from '../../components/TabsLinks'
import { BsInfoSquare } from 'react-icons/bs'
import { GiLevelEndFlag } from 'react-icons/gi'
import { MdOutlinePlayLesson } from 'react-icons/md'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export default function CreateCourse() {
  const { t } = useTranslation('admin')
  const { courseId, id } = useParams()
  const effectiveCourseId = courseId || id
  const { user } = useDashboardContext()
  const role = user?.role || user?.__t

  if (role === 'student') {
    return <Navigate to={`/courses/${effectiveCourseId}`} replace />
  }

  const tabs = [
    {
      name: t('courses.basicInfo', 'المعلومات الأساسية'),
      icon: BsInfoSquare,
      to: '.',
    },
    {
      name: t('courses.lessons', 'الدروس'),
      icon: MdOutlinePlayLesson,
      to: 'lessons',
    },
    {
      name: t('courses.grades', 'درجات الطلاب'),
      icon: GiLevelEndFlag,
      to: 'grades',
    },
  ]

  return (
    <>
      <Helmet>
        <title>{`منصة جهبذ | ${t('courses.editCourse')}`}</title>
      </Helmet>
      <TabsLinks tabs={tabs} />
    </>
  )
}
