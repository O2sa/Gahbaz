import {
  Avatar,
  Box,
  Button,
  Center,
  Grid,
  Group,
  PasswordInput,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  Paper,
  Badge,
  useMantineTheme,
  rem,
} from '@mantine/core'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IconArrowRight,
  IconLock,
  IconUpload,
  IconUser,
  IconShieldCheck,
  IconSchool,
  IconUserCheck,
} from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'
import UploadProfile from './UploadProfile'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud'
import { Helmet } from 'react-helmet'
import { PageHeader } from '../../components/common/index.js'

export default function Profile({ queryClient }) {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: user = {},
    isFetching,
    isLoading,
  } = useQuery(useGetElements(['users', 'current-user']))

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    validate: {
      firstName: (value) => (!value ? 'الاسم الأول مطلوب' : null),
      lastName: (value) => (!value ? 'الاسم الأخير مطلوب' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'البريد الإلكتروني غير صحيح'),
    },
  })

  React.useEffect(() => {
    if (user && user._id) {
      form.setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user?._id])

  const passform = useForm({
    initialValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      oldPassword: (value) => (value?.length < 6 ? 'كلمة السر يجب ألا تقل عن 6 أحرف' : null),
      password: (value) => (value?.length < 6 ? 'كلمة السر يجب ألا تقل عن 6 أحرف' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'كلمات السر غير متطابقة' : null,
    },
  })

  if (isFetching || isLoading) {
    return (
      <Box p="md">
        <Skeleton height={50} mb="lg" radius="md" />
        <Skeleton height={180} mb="xl" radius="lg" />
        <Skeleton height={240} radius="lg" />
      </Box>
    )
  }

  const handleSubmit = async (values) => {
    try {
      await customFetch.patch(`users/${user._id}`, values)
      notifications.show({
        id: 'profile-updated',
        title: 'تم بنجاح!',
        message: 'تم تحديث البيانات الشخصية بنجاح.',
        color: 'teal',
        autoClose: 4000,
      })
      queryClient?.invalidateQueries(['user'])
    } catch (error) {
      notifications.show({
        id: 'profile-update-error',
        title: 'خطأ!',
        message: error?.response?.data?.msg || 'حدث خطأ أثناء تحديث البيانات.',
        color: 'red',
        autoClose: 5000,
      })
    }
  }

  const passhandleSubmit = async (values) => {
    try {
      await customFetch.post(`users/${user._id}/change-pass`, values)
      notifications.show({
        id: 'password-updated',
        title: 'تم بنجاح!',
        message: 'تم تغيير كلمة السر بنجاح.',
        color: 'teal',
        autoClose: 4000,
      })
      passform.reset()
    } catch (error) {
      notifications.show({
        id: 'password-update-error',
        title: 'خطأ!',
        message: error?.response?.data?.msg || 'حدث خطأ أثناء تغيير كلمة السر.',
        color: 'red',
        autoClose: 5000,
      })
    }
  }

  const roleName = user?.__t || user?.role || user?.kind || 'User'
  const isStudent = roleName === 'Student' || user?.role === 'student'
  const isTeacher = roleName === 'Teacher' || roleName === 'Teatcher' || user?.role === 'teacher'

  const getRoleBadge = () => {
    if (isStudent) {
      return (
        <Badge color="teal" variant="light" size="md" leftSection={<IconSchool size={14} />}>
          {`طالب ${user?.major?.name || ''} ${user?.comingSemester ? `(المستوى ${user.comingSemester})` : ''}`}
        </Badge>
      )
    }
    if (isTeacher) {
      return (
        <Badge color="blue" variant="light" size="md" leftSection={<IconUserCheck size={14} />}>
          عضو هيئة تدريس
        </Badge>
      )
    }
    return (
      <Badge color="violet" variant="light" size="md" leftSection={<IconShieldCheck size={14} />}>
        مدير نظام
      </Badge>
    )
  }

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || 'مستخدم'

  return (
    <Box>
      <Helmet>
        <title>{'منصة جهبذ | الملف الشخصي'}</title>
      </Helmet>

      <PageHeader
        title="الملف الشخصي"
        description="إدارة معلومات الحساب الشخصي وتعديل كلمة المرور"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الملف الشخصي' },
        ]}
        action={
          <Button variant="default" leftIcon={<IconArrowRight size={16} />} onClick={() => navigate(-1)}>
            رجوع
          </Button>
        }
      />

      {/* Hero Header Card */}
      <Paper
        withBorder
        radius="lg"
        p="xl"
        mb="xl"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.85)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(30, 64, 175, 0.04)',
        }}
      >
        <Group position="apart" align="center">
          <Group spacing="lg">
            <Avatar
              size={84}
              radius="xl"
              src={user?.avatar}
              color="brand"
              sx={{
                border: `3px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
            <Box>
              <Group spacing="xs" mb={4}>
                <Title order={3} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }}>
                  {fullName}
                </Title>
                {getRoleBadge()}
              </Group>
              <Text size="sm" color="dimmed">
                {user?.email}
              </Text>
            </Box>
          </Group>

          <UploadProfile queryClient={queryClient} user={user}>
            <Button size="sm" variant="light" color="brand" leftIcon={<IconUpload size={16} />}>
              تغيير الصورة الشخصية
            </Button>
          </UploadProfile>
        </Group>
      </Paper>

      {/* Edit Profile Info Form */}
      <Paper
        withBorder
        radius="lg"
        p="xl"
        mb="xl"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 16px rgba(0,0,0,0.25)'
            : '0 4px 16px rgba(30,64,175,0.03)',
        }}
      >
        <Group spacing="xs" mb="lg">
          <IconUser size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
          <Title order={4} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
            المعلومات الشخصية
          </Title>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid gutter="md">
            <Grid.Col xs={12} sm={6}>
              <TextInput
                label="الاسم الأول"
                placeholder="الاسم الأول"
                required
                {...form.getInputProps('firstName')}
              />
            </Grid.Col>
            <Grid.Col xs={12} sm={6}>
              <TextInput
                label="الاسم الأخير"
                placeholder="الاسم الأخير"
                required
                {...form.getInputProps('lastName')}
              />
            </Grid.Col>
            <Grid.Col xs={12} sm={6}>
              <TextInput
                label="البريد الإلكتروني"
                placeholder="example@gahbaz.edu"
                required
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col xs={12} sm={6}>
              <TextInput
                label="رقم الهاتف"
                placeholder="05xxxxxxxx"
                {...form.getInputProps('phone')}
              />
            </Grid.Col>
          </Grid>

          <Group position="right" mt="xl">
            <Button type="submit" color="brand">
              حفظ التعديلات
            </Button>
          </Group>
        </form>
      </Paper>

      {/* Change Password Form */}
      <Paper
        withBorder
        radius="lg"
        p="xl"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 16px rgba(0,0,0,0.25)'
            : '0 4px 16px rgba(30,64,175,0.03)',
        }}
      >
        <Group spacing="xs" mb="lg">
          <IconLock size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
          <Title order={4} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
            تغيير كلمة المرور
          </Title>
        </Group>

        <form onSubmit={passform.onSubmit(passhandleSubmit)}>
          <Grid gutter="md">
            <Grid.Col xs={12} md={4}>
              <PasswordInput
                label="كلمة السر الحالية"
                placeholder="••••••••"
                required
                {...passform.getInputProps('oldPassword')}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={4}>
              <PasswordInput
                label="كلمة السر الجديدة"
                placeholder="••••••••"
                required
                {...passform.getInputProps('password')}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={4}>
              <PasswordInput
                label="تأكيد كلمة السر الجديدة"
                placeholder="••••••••"
                required
                {...passform.getInputProps('confirmPassword')}
              />
            </Grid.Col>
          </Grid>

          <Group position="right" mt="xl">
            <Button type="submit" color="brand" variant="light">
              تحديث كلمة المرور
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  )
}
