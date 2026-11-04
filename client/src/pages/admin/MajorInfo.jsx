import React from 'react'
import { TabsLinks } from '../../components/TabsLinks'
import { GrInfo } from 'react-icons/gr'
import { FaLandmarkDome } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

export default function MajorInfo({ queryClient }) {
  const { t } = useTranslation('nav')
  const tabs = [
    {
      name: t('tabs.majorInfo'),
      icon: GrInfo,
      to: '.',
    },
    {
      name: t('tabs.studyPlan'),
      icon: FaLandmarkDome,
      to: 'semesters',
    },
  ]

  return <TabsLinks tabs={tabs} />
}
