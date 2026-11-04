import React, { useState } from 'react'
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
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
  IconArrowRight,
  IconShieldCheck,
  IconUserCheck,
  IconCheck,
  IconSparkles,
} from '@tabler/icons-react'

const Login = () => {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isRtl = theme.dir === 'rtl'
  const queryClient = useQueryClient()
  const isDark = theme.colorScheme === 'dark'
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation(['auth', 'common', 'nav'])

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
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('errors.validation.invalidEmail', { ns: 'common', defaultValue: 'يرجى إدخال بريد إلكتروني صحيح' })),
      password: (value) => (value.length >= 4 ? null : t('errors.validation.passwordTooShort', { ns: 'common', defaultValue: 'كلمة المرور يجب أن لا تقل عن 4 أحرف' })),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const res = await customFetch.post('/auth/login', values)
      const token = res?.data?.token || res?.token
      if (token) {
        localStorage.setItem('token', token)
      }
      queryClient.clear()
      await queryClient.resetQueries()

      const loggedUser = res?.data?.user || res?.user
      const needsOnboarding = loggedUser?.role === 'admin' && loggedUser?.university?.needsSetup

      notifications.show({
        title: t('common.notifications.success', { defaultValue: 'تم تسجيل الدخول بنجاح' }),
        message: t('login.welcomeBack', { defaultValue: 'مرحباً بك مجدداً في منصة جهبذ الأكاديمية' }),
        color: 'teal',
        autoClose: 4000,
      })

      if (needsOnboarding) {
        navigate('/onboarding/university')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      notifications.show({
        title: t('common.notifications.error', { defaultValue: 'خطأ في تسجيل الدخول' }),
        message:
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          t('login.errorInvalid', { defaultValue: 'البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة.' }),
        color: 'red',
        autoClose: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const fillAndLogin = (email, password) => {
    form.setValues({ email, password })
    handleSubmit({ email, password })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>{t('login.helmet', { defaultValue: 'منصة جهبذ | تسجيل الدخول' })}</title>
      </Helmet>

      <Grid gutter={0} sx={{ flex: 1, minHeight: '100vh' }}>
        {/* Left Side: Interactive Login Form */}
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
          <Box sx={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
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
                    {t('nav:platformTitle', { defaultValue: 'منصة جَهْبَذ' })}
                  </Text>
                  <Text size={10} color="dimmed">
                    {t('nav:platformSubtitle', { defaultValue: 'المنظومة الأكاديمية الذكية' })}
                  </Text>
                </Box>
              </Group>

              <LanguageSwitcher variant="subtle" size="sm" />
            </Group>

            <Title order={2} sx={{ fontWeight: 800, fontSize: 28, color: isDark ? '#ffffff' : '#0f172a' }}>
              {t('login.title', { defaultValue: 'تسجيل الدخول' })}
            </Title>
            <Text color="dimmed" size="sm" mt={4} mb="xl">
              {t('login.subtitle', { defaultValue: 'أهلاً بك مجدداً، أدخل بياناتك للوصول إلى حسابك الأكاديمي' })}
            </Text>

            {/* Quick Demo Credentials */}
            <Paper
              p="sm"
              radius="md"
              mb="xl"
              sx={{
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc',
                border: `1px dashed ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
              }}
            >
              <Group spacing={6} mb={8}>
                <IconSparkles size={16} color={isDark ? '#60a5fa' : '#2563eb'} />
                <Text size="xs" weight={700} color={isDark ? 'blue.3' : 'brand'}>
                  {t('login.demoHeading', { defaultValue: 'تجربة سريعة بضغطة زر واحدة:' })}
                </Text>
              </Group>
              <Group spacing="xs" grow>
                <Button
                  size="xs"
                  variant="light"
                  color="violet"
                  leftIcon={<IconShieldCheck size={14} />}
                  onClick={() => fillAndLogin('admin@test.com', 'admin@test.com')}
                  disabled={loading}
                  sx={{ fontWeight: 600 }}
                >
                  {t('roles.admin', { ns: 'common', defaultValue: 'مدير النظام' })}
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  leftIcon={<IconUserCheck size={14} />}
                  onClick={() => fillAndLogin('teacher@tech.com', 'teacher@tech.com')}
                  disabled={loading}
                  sx={{ fontWeight: 600 }}
                >
                  {t('roles.teacher', { ns: 'common', defaultValue: 'أستاذ' })}
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="teal"
                  leftIcon={<IconSchool size={14} />}
                  onClick={() => fillAndLogin('student@test.com', 'student@test.com')}
                  disabled={loading}
                  sx={{ fontWeight: 600 }}
                >
                  {t('roles.student', { ns: 'common', defaultValue: 'طالب' })}
                </Button>
              </Group>
            </Paper>

            {/* Login Form */}
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack spacing="md">
                <TextInput
                  label={t('login.emailLabel', { defaultValue: 'البريد الإلكتروني' })}
                  placeholder={t('login.emailPlaceholder', { defaultValue: 'name@gahbaz.edu' })}
                  icon={<IconMail size={16} />}
                  size="md"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  label={t('login.passwordLabel', { defaultValue: 'كلمة المرور' })}
                  placeholder={t('login.passwordPlaceholder', { defaultValue: '••••••••' })}
                  icon={<IconLock size={16} />}
                  size="md"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('password')}
                />

                <Group position="apart" mt={4}>
                  <Checkbox label={t('login.rememberMe', { defaultValue: 'تذكرني على هذا الجهاز' })} size="sm" />
                  <Anchor component="button" type="button" size="xs" color="dimmed">
                    {t('login.forgotPassword', { defaultValue: 'نسيت كلمة المرور؟' })}
                  </Anchor>
                </Group>

                <Button
                  type="submit"
                  fullWidth
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                  loading={loading}
                  leftIcon={isRtl ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
                  mt="xs"
                  sx={{
                    fontWeight: 700,
                    height: 48,
                    boxShadow: isDark
                      ? '0 4px 16px rgba(59, 130, 246, 0.35)'
                      : '0 4px 16px rgba(30, 64, 175, 0.25)',
                  }}
                >
                  {t('login.submit', { defaultValue: 'تسجيل الدخول' })}
                </Button>
              </Stack>
            </form>

            {registrationEnabled && (
              <Text align="center" size="sm" mt="xl" color="dimmed">
                {t('login.noAccount', { defaultValue: 'ليس لديك حساب بعد؟' })}{' '}
                <Anchor component={Link} to="/register" weight={700} color="brand">
                  {t('login.registerNow', { defaultValue: 'إنشاء حساب جديد' })}
                </Anchor>
              </Text>
            )}

            <Text align="center" size="xs" mt="md" color="dimmed">
              <Anchor component={Link} to="/" color="dimmed">
                {t('common.actions.backToHome', { defaultValue: 'العودة إلى الصفحة الرئيسية' })}
              </Anchor>
            </Text>
          </Box>
        </Grid.Col>

        {/* Right Side: High-Impact Branded Art Showcase */}
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
          {/* Subtle background glow circle */}
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
              {t('showcase.loginBadge', { defaultValue: 'منظومة جهبذ التعليمية' })}
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
              {t('showcase.loginTitle', { defaultValue: 'البيئة الرقمية المتكاملة للتعليم الجامعي الذكي' })}
            </Title>
            <Text size="lg" sx={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.7 }} mb="xl">
              {t('showcase.loginSubtitle', { defaultValue: 'تجمع جهبذ إدارة الكليات والأساتذة والطلاب في فضاء سحابي فائق الأمان لإدارة المساقات، حضور المحاضرات، ورصد الدرجات والتقارير الأكاديمية لحظياً.' })}
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
                  {t('showcase.loginFeature1', { defaultValue: 'هيكلة أكاديمية متكاملة لجميع الكليات والتخصصات' })}
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
                  {t('showcase.loginFeature2', { defaultValue: 'غرف تواصل أكاديمي تفاعلية ومحاضرات سحابية' })}
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
                  {t('showcase.loginFeature3', { defaultValue: 'رصد دقيق لكشوف الدرجات واحتساب المعدلات الأكاديمية' })}
                </Text>
              </Group>
            </Stack>
          </Box>

          <Group position="apart">
            <Text size="xs" color="gray.4">
              {t('showcase.copyright', { year: new Date().getFullYear(), defaultValue: `منصة جهبذ الأكاديمية © ${new Date().getFullYear()}` })}
            </Text>
            <Text size="xs" color="gray.4">
              {t('showcase.version', { defaultValue: 'إصدار النظام 1.0' })}
            </Text>
          </Group>
        </Grid.Col>
      </Grid>
    </Box>
  )
}

export default Login
