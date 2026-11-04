import React from 'react'
import { TabsLinks } from '../../components/TabsLinks'
import { GrInfo } from 'react-icons/gr'
import { GoBook } from 'react-icons/go'
import { FaLandmarkDome } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

export default function CollageInfo({ queryClient }) {
  const { t } = useTranslation('nav')
  const tabs = [
    {
      name: t('tabs.collegeInfo'),
      icon: GrInfo,
      to: '.',
    },
    {
      name: t('tabs.majorsAndDepts'),
      icon: FaLandmarkDome,
      to: 'majors',
    },
    {
      name: t('tabs.academicSubjects'),
      icon: GoBook,
      to: 'subjects',
    },
  ]

  return <TabsLinks tabs={tabs} />
}
