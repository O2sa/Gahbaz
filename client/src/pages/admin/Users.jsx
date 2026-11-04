import React from 'react'
import { TabsLinks } from '../../components/TabsLinks'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { PiStudent } from 'react-icons/pi'
import { RiAdminLine } from 'react-icons/ri'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

export default function Users() {
  const { t } = useTranslation(['admin', 'nav'])

  const tabs = [
    {
      name: t('users.tabs.admins'),
      icon: RiAdminLine,
      to: '.',
    },
    {
      name: t('users.tabs.teachers'),
      icon: FaChalkboardTeacher,
      to: 'teachers',
    },
    {
      name: t('users.tabs.students'),
      icon: PiStudent,
      to: 'students',
    },
  ]

  return (
    <>
      <Helmet>
        <title>{`${t('platformTitle', { ns: 'nav', defaultValue: 'منصة جهبذ' })} | ${t('users.helmet')}`}</title>
      </Helmet>
      <TabsLinks tabs={tabs} />
    </>
  )
}
