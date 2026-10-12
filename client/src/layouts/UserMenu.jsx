import React from 'react'
import {
  Menu,
  Group,
  Avatar,
  Text,
  Badge,
  UnstyledButton,
  createStyles,
} from '@mantine/core'
import {
  IconUser,
  IconLogout,
  IconChevronDown,
  IconSettings,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/auth.api.js'
import { notifications } from '@mantine/notifications'

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 150ms ease',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
  userActive: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
}))

export default function UserMenu({ user }) {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authApi.logout()
      notifications.show({
        title: 'تم تسجيل الخروج',
        message: 'تم تسجيل خروجك بنجاح',
        color: 'blue',
      })
      navigate('/login')
    } catch (err) {
      navigate('/login')
    }
  }

  const roleLabels = {
    admin: 'مدير النظام',
    teacher: 'أستاذ',
    student: 'طالب',
  }

  const roleColors = {
    admin: 'violet',
    teacher: 'blue',
    student: 'teal',
  }

  const role = user?.role || 'admin'
  const name = user?.name || user?.userName || 'المستخدم'

  return (
    <Menu position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group spacing={8}>
            <Avatar radius="xl" size={34} color="brand">
              {name.charAt(0)}
            </Avatar>
            <div style={{ flex: 1, minWidth: 80 }}>
              <Text size="sm" weight={600} lineClamp={1}>
                {name}
              </Text>
              <Badge size="xs" color={roleColors[role] || 'gray'} variant="light">
                {roleLabels[role] || role}
              </Badge>
            </div>
            <IconChevronDown size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>حساب المستخدم</Menu.Label>
        <Menu.Item
          icon={<IconUser size={16} stroke={1.5} />}
          onClick={() => navigate('/profile')}
        >
          الملف الشخصي
        </Menu.Item>
        <Menu.Item icon={<IconSettings size={16} stroke={1.5} />}>
          الإعدادات
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          icon={<IconLogout size={16} stroke={1.5} />}
          onClick={handleLogout}
        >
          تسجيل الخروج
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
