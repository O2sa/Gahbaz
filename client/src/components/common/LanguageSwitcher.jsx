import React from 'react'
import { Menu, Button } from '@mantine/core'
import { IconWorld, IconCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher({ variant = 'subtle', size = 'sm' }) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'ar'

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    try {
      localStorage.setItem('gahbaz-language', lng)
    } catch (e) {}
  }

  return (
    <Menu shadow="md" width={160} position="bottom-end">
      <Menu.Target>
        <Button
          variant={variant}
          size={size}
          compact
          leftIcon={<IconWorld size={16} />}
          styles={(theme) => ({
            root: {
              fontWeight: 600,
              borderRadius: theme.radius.md,
            },
          })}
        >
          {currentLang === 'ar' ? 'العربية' : 'English'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={currentLang === 'ar' ? <IconCheck size={14} color="#12b886" /> : <span style={{ width: 14 }} />}
          onClick={() => changeLanguage('ar')}
        >
          العربية (AR)
        </Menu.Item>
        <Menu.Item
          icon={currentLang === 'en' ? <IconCheck size={14} color="#12b886" /> : <span style={{ width: 14 }} />}
          onClick={() => changeLanguage('en')}
        >
          English (EN)
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default LanguageSwitcher
