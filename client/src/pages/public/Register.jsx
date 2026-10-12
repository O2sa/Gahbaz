import React, { useState } from 'react'
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Box,
  Stack,
  ActionIcon,
  Badge,
  useMantineTheme,
  Grid,
  Anchor,
  Checkbox,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Link, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { Helmet } from 'react-helmet'
import customFetch from '../../utils/customFetch'
import {
  IconSchool,
  IconMail,
  IconLock,
  IconArrowLeft,
  IconUser,
  IconPhone,
  IconCheck,
} from '@tabler/icons-react'

export default function Register() {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
    },
    validate: {
      firstName: (value) => (value.trim().length >= 2 ? null : 'يرجى إدخال الاسم الأول'),
      lastName: (value) => (value.trim().length >= 2 ? null : 'يرجى إدخال الاسم الأخير'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'يرجى إدخال بريد إلكتروني صحيح'),
      password: (value) => (value.length >= 6 ? null : 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await customFetch.post('/auth/register', values)
      notifications.show({
        title: 'تم إنشاء الحساب بنجاح',
        message: 'تم تسجيل حسابك الأكاديمي الجديد، يمكنك الآن تسجيل الدخول',
        color: 'teal',
        autoClose: 5000,
      })
      navigate('/login')
    } catch (error) {
      notifications.show({
        title: 'خطأ في إنشاء الحساب',
        message:
          error?.response?.data?.msg ||
          'حدث خطأ أثناء إنشاء الحساب، يرجى التحقق من البيانات والمحاولة مجدداً.',
        color: 'red',
        autoClose: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>منصة جهبذ | إنشاء حساب جديد</title>
      </Helmet>

      <Grid gutter={0} sx={{ flex: 1, minHeight: '100vh' }}>
        {/* Left Side: Interactive Registration Form */}
        <Grid.Col
          xs={12}
          md={6}
          lg={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 32px',
            backgroundColor: isDark ? theme.colors.dark[8] : '#ffffff',
            '@media (min-width: 900px)': {
              padding: '60px 56px',
            },
          }}
        >
          <Box sx={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
            {/* Header Mobile Brand */}
            <Group spacing="xs" mb="xl">
              <ActionIcon
                size={40}
                radius="md"
                variant="gradient"
                gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              >
                <IconSchool size={24} color="white" />
              </ActionIcon>
              <Box>
                <Text weight={800} size="md">
                  منصة جَهْبَذ
                </Text>
                <Text size={10} color="dimmed">
                  المنظومة الأكاديمية الذكية
                </Text>
              </Box>
            </Group>

            <Title order={2} sx={{ fontWeight: 800, fontSize: 28, color: isDark ? '#ffffff' : '#0f172a' }}>
              إنشاء حساب جديد
            </Title>
            <Text color="dimmed" size="sm" mt={4} mb="xl">
              انضم إلى المنظومة الأكاديمية وابدأ مسيرتك التعليمية الرقمية
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack spacing="md">
                <Grid gutter="xs">
                  <Grid.Col span={6}>
                    <TextInput
                      label="الاسم الأول"
                      placeholder="أحمد"
                      icon={<IconUser size={16} />}
                      size="sm"
                      radius="md"
                      disabled={loading}
                      {...form.getInputProps('firstName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="الاسم الأخير"
                      placeholder="الغامدي"
                      icon={<IconUser size={16} />}
                      size="sm"
                      radius="md"
                      disabled={loading}
                      {...form.getInputProps('lastName')}
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="رقم الهاتف"
                  placeholder="05xxxxxxxx"
                  icon={<IconPhone size={16} />}
                  size="sm"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('phone')}
                />

                <TextInput
                  label="البريد الإلكتروني"
                  placeholder="name@university.edu"
                  icon={<IconMail size={16} />}
                  size="sm"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label="كلمة المرور"
                  placeholder="••••••••"
                  icon={<IconLock size={16} />}
                  size="sm"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('password')}
                />

                <Checkbox
                  label="أوافق على الشروط وسياسة الاستخدام الأكاديمي"
                  size="xs"
                  defaultChecked
                  mt={4}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                  loading={loading}
                  leftIcon={<IconArrowLeft size={18} />}
                  mt="xs"
                  sx={{
                    fontWeight: 700,
                    height: 48,
                    boxShadow: isDark
                      ? '0 4px 16px rgba(59, 130, 246, 0.35)'
                      : '0 4px 16px rgba(30, 64, 175, 0.25)',
                  }}
                >
                  إنشاء الحساب الأكاديمي
                </Button>
              </Stack>
            </form>

            <Text align="center" size="sm" mt="xl" color="dimmed">
              لديك حساب بالفعل؟{' '}
              <Anchor component={Link} to="/login" weight={700} color="brand">
                تسجيل الدخول
              </Anchor>
            </Text>

            <Text align="center" size="xs" mt="md" color="dimmed">
              <Anchor component={Link} to="/" color="dimmed">
                العودة إلى الصفحة الرئيسية
              </Anchor>
            </Text>
          </Box>
        </Grid.Col>

        {/* Right Side: Branded Art Showcase */}
        <Grid.Col
          xs={12}
          md={6}
          lg={7}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            '@media (max-width: 899px)': {
              display: 'none',
            },
          }}
        >
          {/* Subtle background glow */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <Box>
            <Badge
              size="lg"
              radius="xl"
              variant="filled"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              بوابة التسجيل الأكاديمي
            </Badge>
          </Box>

          <Box sx={{ maxWidth: 540 }}>
            <Title
              order={1}
              sx={{
                fontSize: 38,
                fontWeight: 900,
                lineHeight: 1.3,
                color: '#ffffff',
                marginBottom: 16,
              }}
            >
              انضم إلى المنظومة الأكاديمية الأحدث
            </Title>
            <Text size="lg" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.7 }} mb="xl">
              تمتع بوصول غير محدود للمساقات الدراسية والمحاضرات الرقمية وتواصل بفاعلية مع الأساتذة والزملاء في مجتمع تعليمي نشط.
            </Text>

            <Stack spacing="md">
              <Group spacing="sm">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconCheck size={16} color="#34d399" />
                </Box>
                <Text size="sm" weight={600} color="gray.2">
                  تسجيل سريع وآمن دون أي تعقيدات
                </Text>
              </Group>

              <Group spacing="sm">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconCheck size={16} color="#34d399" />
                </Box>
                <Text size="sm" weight={600} color="gray.2">
                  وصول مباشر لجدول المحاضرات والاختبارات
                </Text>
              </Group>

              <Group spacing="sm">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconCheck size={16} color="#34d399" />
                </Box>
                <Text size="sm" weight={600} color="gray.2">
                  إشعارات فورية بكل جديد يخص مقرراتك
                </Text>
              </Group>
            </Stack>
          </Box>

          <Group position="apart">
            <Text size="xs" color="gray.4">
              منصة جهبذ الأكاديمية © {new Date().getFullYear()}
            </Text>
            <Text size="xs" color="gray.4">
              إصدار النظام 1.0
            </Text>
          </Group>
        </Grid.Col>
      </Grid>
    </Box>
  )
}
