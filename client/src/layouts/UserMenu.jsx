import React from 'react'
import {
  Menu,
  Group,
  Avatar,
  Text,
  Badge,
  UnstyledButton,
  createStyles,
  Box,
  rem,
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
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.gray?.[8] || '#1f2937',
    padding: `${rem(4)} ${rem(8)}`,
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    transition: 'all 180ms ease',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
      borderColor:
        theme.colorScheme === 'dark' ? theme.colors.brand[6] : theme.colors.brand[3],
    },
  },
}))

export default function UserMenu({ user }) {
  const { classes, theme } = useStyles()
  const navigate = useNavigate()
  const isDark = theme.colorScheme === 'dark'

  const handleLogout = async () => {
    try {
      await authApi.logout()
      notifications.show({
        title: 'تم تسجيل الخروج',
        message: 'تم تسجيل خروجك بنجاح من المنصة',
        color: 'blue',
      })
      navigate('/login')
    } catch (err) {
      navigate('/login')
    }
  }

  const roleLabels = {
    admin: 'مدير النظام',
    teacher: 'عضو هيئة التدريس',
    student: 'طالب جامعي',
  }

  const roleColors = {
    admin: 'violet',
    teacher: 'blue',
    student: 'teal',
  }

  const role = user?.role || 'admin'
  const name = user?.name || user?.userName || 'المستخدم'
  const email = user?.email || 'admin@gahbaz.edu'

  return (
    <Menu
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right', duration: 150 }}
      shadow="md"
      radius="md"
      width={220}
    >
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group spacing={8}>
            <Avatar
              radius="xl"
              size={32}
              color="brand"
              sx={{
                fontWeight: 700,
                boxShadow: isDark
                  ? '0 2px 8px rgba(0,0,0,0.4)'
                  : '0 2px 6px rgba(30,64,175,0.2)',
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ maxWidth: 120 }}>
              <Text size="xs" weight={700} lineClamp={1}>
                {name}
              </Text>
              <Badge
                size="xs"
                color={roleColors[role] || 'gray'}
                variant="light"
                sx={{ textTransform: 'none', height: 16, padding: '0 4px', fontSize: 10 }}
              >
                {roleLabels[role] || role}
              </Badge>
            </Box>
            <IconChevronDown size={14} stroke={1.8} style={{ opacity: 0.6 }} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown sx={{ minWidth: 200, padding: 6 }}>
        <Box px="xs" py={6}>
          <Text size="xs" color="dimmed" weight={500} lineClamp={1}>
            {email}
          </Text>
        </Box>
        <Menu.Divider />

        <Menu.Item
          icon={<IconUser size={16} stroke={1.6} />}
          onClick={() => navigate('/profile')}
          sx={{ fontWeight: 600, fontSize: 13 }}
        >
          الملف الأكاديمي
        </Menu.Item>
        <Menu.Item
          icon={<IconSettings size={16} stroke={1.6} />}
          onClick={() => navigate('/profile')}
          sx={{ fontWeight: 600, fontSize: 13 }}
        >
          إعدادات الحساب
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          icon={<IconLogout size={16} stroke={1.8} />}
          onClick={handleLogout}
          sx={{ fontWeight: 600, fontSize: 13 }}
        >
          تسجيل الخروج
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
