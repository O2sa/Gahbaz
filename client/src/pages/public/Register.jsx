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
  Alert,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import customFetch from '../../utils/customFetch'
import LanguageSwitcher from '../../components/common/LanguageSwitcher.jsx'
import {
  IconSchool,
  IconMail,
  IconLock,
  IconArrowLeft,
  IconUser,
  IconPhone,
  IconCheck,
  IconAlertCircle,
  IconLogin,
} from '@tabler/icons-react'

export default function Register() {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const queryClient = useQueryClient()
  const isDark = theme.colorScheme === 'dark'
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(['auth', 'common'])

  const { data: authStatus } = useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      try {
        const res = await customFetch.get('/auth/status')
        return res?.data || res
      } catch {
        return { registrationEnabled: true }
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const registrationEnabled = authStatus?.registrationEnabled !== false

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
    },
    validate: {
      firstName: (value) => (value.trim().length >= 2 ? null : t('errors.validation.required', { ns: 'common', defaultValue: 'يرجى إدخال الاسم الأول' })),
      lastName: (value) => (value.trim().length >= 2 ? null : t('errors.validation.required', { ns: 'common', defaultValue: 'يرجى إدخال الاسم الأخير' })),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('errors.validation.invalidEmail', { ns: 'common', defaultValue: 'يرجى إدخال بريد إلكتروني صحيح' })),
      password: (value) => (value.length >= 6 ? null : t('errors.validation.passwordTooShort', { ns: 'common', defaultValue: 'كلمة المرور يجب أن لا تقل عن 6 أحرف' })),
    },
  })

  const handleSubmit = async (values) => {
    if (!registrationEnabled) {
      notifications.show({
        title: t('register.disabledNotice', { defaultValue: 'التسجيل مغلق' }),
        message: t('register.disabledNotice', { defaultValue: 'التسجيل معطل حالياً بواسطة إدارة المنظومة.' }),
        color: 'red',
      })
      return
    }

    setLoading(true)
    try {
      const res = await customFetch.post('/auth/register', values)
      const token = res?.data?.token || res?.token
      if (token) {
        localStorage.setItem('token', token)
      }
      queryClient.clear()
      await queryClient.resetQueries()

      notifications.show({
        title: t('common.notifications.success', { defaultValue: 'تم إنشاء الحساب الأكاديمي بنجاح' }),
        message: t('register.successWelcome', { defaultValue: 'مرحباً بك! يرجى استكمال إعداد بيانات جامعتك للبدء.' }),
        color: 'teal',
        autoClose: 5000,
      })
      navigate('/onboarding/university')
    } catch (error) {
      notifications.show({
        title: t('common.notifications.error', { defaultValue: 'خطأ في إنشاء الحساب' }),
        message:
          error?.response?.data?.message ||
          error?.response?.data?.msg ||
          t('register.errorGeneric', { defaultValue: 'حدث خطأ أثناء إنشاء الحساب، يرجى التحقق من البيانات والمحاولة مجدداً.' }),
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
        <title>{t('register.title', { defaultValue: 'منصة جهبذ | إنشاء حساب جديد' })}</title>
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
            {/* Header Mobile Brand & Language Switcher */}
            <Group position="apart" mb="xl">
              <Group spacing="xs">
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
                    {t('nav.platformTitle', { defaultValue: 'منصة جَهْبَذ' })}
                  </Text>
                  <Text size={10} color="dimmed">
                    {t('nav.platformSubtitle', { defaultValue: 'المنظومة الأكاديمية الذكية' })}
                  </Text>
                </Box>
              </Group>

              <LanguageSwitcher variant="subtle" size="sm" />
            </Group>

            <Title order={2} sx={{ fontWeight: 800, fontSize: 28, color: isDark ? '#ffffff' : '#0f172a' }}>
              {t('register.title', { defaultValue: 'إنشاء حساب جديد' })}
            </Title>
            <Text color="dimmed" size="sm" mt={4} mb="xl">
              {t('register.subtitle', { defaultValue: 'انضم إلى المنظومة الأكاديمية وابدأ مسيرتك التعليمية الرقمية' })}
            </Text>

            {!registrationEnabled ? (
              <Stack spacing="lg">
                <Alert
                  icon={<IconAlertCircle size={20} />}
                  title={t('register.disabledNotice', { defaultValue: 'التسجيل مغلق مؤقتاً' })}
                  color="orange"
                  radius="md"
                  variant="light"
                >
                  {t('register.disabledNotice', { defaultValue: 'نعتذر، تم إيقاف استقبال طلبات التسجيل الجديدة مؤقتاً بأمر إدارة المنظومة. إذا كان لديك حساب بالفعل يرجى تسجيل الدخول.' })}
                </Alert>

                <Button
                  component={Link}
                  to="/login"
                  fullWidth
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                  leftIcon={<IconLogin size={18} />}
                >
                  {t('register.loginNow', { defaultValue: 'الذهاب إلى تسجيل الدخول' })}
                </Button>
              </Stack>
            ) : (
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                  <Grid gutter="xs">
                    <Grid.Col span={6}>
                      <TextInput
                        label={t('register.firstName', { defaultValue: 'الاسم الأول' })}
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
                        label={t('register.lastName', { defaultValue: 'الاسم الأخير' })}
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
                    label={t('register.phone', { defaultValue: 'رقم الهاتف' })}
                    placeholder="05xxxxxxxx"
                    icon={<IconPhone size={16} />}
                    size="sm"
                    radius="md"
                    disabled={loading}
                    {...form.getInputProps('phone')}
                  />

                  <TextInput
                    label={t('register.email', { defaultValue: 'البريد الإلكتروني' })}
                    placeholder="name@university.edu"
                    icon={<IconMail size={16} />}
                    size="sm"
                    radius="md"
                    disabled={loading}
                    {...form.getInputProps('email')}
                  />

                  <PasswordInput
                    label={t('register.password', { defaultValue: 'كلمة المرور' })}
                    placeholder="••••••••"
                    icon={<IconLock size={16} />}
                    size="sm"
                    radius="md"
                    disabled={loading}
                    {...form.getInputProps('password')}
                  />

                  <Checkbox
                    label={t('register.agreeTerms', { defaultValue: 'أوافق على الشروط وسياسة الاستخدام الأكاديمي' })}
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
                    {t('register.submit', { defaultValue: 'إنشاء الحساب الأكاديمي' })}
                  </Button>
                </Stack>
              </form>
            )}

            <Text align="center" size="sm" mt="xl" color="dimmed">
              {t('register.hasAccount', { defaultValue: 'لديك حساب بالفعل؟' })}{' '}
              <Anchor component={Link} to="/login" weight={700} color="brand">
                {t('register.loginNow', { defaultValue: 'تسجيل الدخول' })}
              </Anchor>
            </Text>

            <Text align="center" size="xs" mt="md" color="dimmed">
              <Anchor component={Link} to="/" color="dimmed">
                {t('common.actions.backToHome', { defaultValue: 'العودة إلى الصفحة الرئيسية' })}
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
                  إعداد فوري لجامعتك وكلياتك ومساقاتك
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
