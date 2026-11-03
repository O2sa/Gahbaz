import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  ThemeIcon,
  Badge,
  useMantineTheme,
  Alert,
  Loader,
  Center,
  Grid,
  Card,
  Divider,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { Helmet } from 'react-helmet'
import {
  IconSchool,
  IconCheck,
  IconArrowLeft,
  IconBuildingCommunity,
  IconBarcode,
  IconInfoCircle,
  IconLogout,
  IconSparkles,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import authApi from '../../api/auth.api.js'
import universitiesApi from '../../api/universities.api.js'
import LanguageSwitcher from '../../components/common/LanguageSwitcher.jsx'

export default function UniversityOnboarding() {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const queryClient = useQueryClient()
  const isDark = theme.colorScheme === 'dark'
  const { t } = useTranslation(['auth', 'common'])

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await authApi.getCurrentUser()
      return res?.data?.user || res?.user || res?.data || res
    },
    staleTime: 0,
    retry: false,
  })

  const {
    data: myUnivData,
    isLoading: isUnivLoading,
  } = useQuery({
    queryKey: ['myUniversity'],
    queryFn: async () => {
      const res = await universitiesApi.getMyUniversity()
      return res?.university || res?.data?.university || res?.data || res
    },
    enabled: !!userData,
    retry: false,
  })

  const form = useForm({
    initialValues: {
      name: '',
      code: '',
    },
    validate: {
      name: (val) => {
        const trimmed = (val || '').trim()
        if (trimmed.length < 3) return 'اسم الجامعة يجب أن لا يقل عن 3 أحرف'
        if (trimmed.length > 100) return 'اسم الجامعة يجب أن لا يتجاوز 100 حرف'
        return null
      },
      code: (val) => {
        const trimmed = (val || '').trim()
        if (trimmed.length < 2) return 'رمز الجامعة يجب أن لا يقل عن حرفين'
        if (trimmed.length > 10) return 'رمز الجامعة يجب أن لا يتجاوز 10 أحرف'
        if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) return 'رمز الجامعة يجب أن يحتوي على أحرف إنجليزية وأرقام فقط'
        return null
      },
    },
  })

  // Pre-fill form when university data loads
  useEffect(() => {
    if (myUnivData) {
      form.setValues({
        name: myUnivData.name || '',
        code: myUnivData.code || '',
      })
    }
  }, [myUnivData])

  // Redirect guard
  useEffect(() => {
    if (!isUserLoading) {
      if (isUserError || !userData) {
        navigate('/login', { replace: true })
        return
      }

      // If user is not an admin, they should not be here
      if (userData.role !== 'admin' && userData.role !== 'super-admin') {
        navigate('/dashboard', { replace: true })
        return
      }

      // If already finished setup (needsSetup is explicitly false), redirect to dashboard
      const univ = myUnivData || userData.university
      if (univ && univ.needsSetup === false) {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isUserLoading, isUserError, userData, myUnivData, navigate])

  const mutation = useMutation({
    mutationFn: async (values) => {
      return universitiesApi.updateMyUniversity({
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
      })
    },
    onSuccess: async () => {
      notifications.show({
        title: 'تم إعداد الجامعة بنجاح!',
        message: 'تم حفظ وتفعيل بيانات جامعتك في جهبذ. مرحباً بك في لوحة الإدارة الأكاديمية.',
        color: 'teal',
        icon: <IconCheck size={18} />,
        autoClose: 5000,
      })
      queryClient.clear()
      await queryClient.resetQueries()
      navigate('/dashboard', { replace: true })
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.response?.data?.error?.message ||
        'حدث خطأ أثناء حفظ بيانات الجامعة. يرجى التأكد من عدم تكرار الاسم أو الرمز.'
      notifications.show({
        title: 'تعذر حفظ البيانات',
        message: msg,
        color: 'red',
        autoClose: 6000,
      })
    },
  })

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      queryClient.clear()
      navigate('/login')
    }
  }

  if (isUserLoading || isUnivLoading) {
    return (
      <Center sx={{ height: '100vh', width: '100vw' }}>
        <Stack align="center" spacing="md">
          <Loader size="xl" color="brand" />
          <Text size="sm" color="dimmed">
            جارٍ تحميل بيانات المنظومة...
          </Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark
          ? 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)'
          : 'radial-gradient(ellipse at top, #f1f5f9 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Helmet>
        <title>منصة جهبذ | إعداد بيانات الجامعة</title>
      </Helmet>

      {/* Top Bar with brand and logout */}
      <Box
        sx={{
          padding: '16px 24px',
          borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          backdropFilter: 'blur(10px)',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
        }}
      >
        <Container size="lg">
          <Group position="apart">
            <Group spacing="sm">
              <ThemeIcon
                size={38}
                radius="md"
                variant="gradient"
                gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              >
                <IconSchool size={22} color="white" />
              </ThemeIcon>
              <Box>
                <Text weight={800} size="md">
                  منصة جَهْبَذ
                </Text>
                <Text size={10} color="dimmed">
                  إعداد المنظومة الأكاديمية
                </Text>
              </Box>
            </Group>

            <Group spacing="xs">
              <LanguageSwitcher variant="subtle" size="xs" />
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                leftIcon={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                {t('actions.logout', { ns: 'common', defaultValue: 'تسجيل الخروج' })}
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="md" py={48} sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Paper
          shadow="xl"
          radius="lg"
          p={{ base: 24, sm: 40 }}
          sx={{
            width: '100%',
            backgroundColor: isDark ? theme.colors.dark[7] : '#ffffff',
            border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          }}
        >
          {/* Header Step Badge */}
          <Group position="apart" mb="lg">
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              leftSection={<IconSparkles size={14} />}
            >
              الخطوة الأخيرة: تفعيل الجامعة
            </Badge>
            <Text size="xs" color="dimmed" weight={600}>
              حساب مسؤول: {userData?.email}
            </Text>
          </Group>

          <Title order={2} sx={{ fontWeight: 800, fontSize: 26 }} mb="xs">
            أهلاً بك كمسؤول أكاديمي جديد! 🎓
          </Title>
          <Text color="dimmed" size="sm" mb="xl">
            لاستكمال تفعيل حسابك كمسؤول وتجهيز بوابتك التعليمية بالكامل، يرجى تحديد الاسم الرسمي لجامعتك
            أو مؤسستك الأكاديمية والرمز التعريفي المختصر.
          </Text>

          <Alert
            icon={<IconInfoCircle size={18} />}
            title="تنويه إداري"
            color="blue"
            radius="md"
            mb="xl"
          >
            سيتم استخدام هذه البيانات لتعريف كلياتك، تخصصاتك، موادك ومقرراتك الدراسية أمام الأساتذة
            والطلاب.
          </Alert>

          <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack spacing="lg">
              <TextInput
                label="الاسم الرسمي للجامعة أو المؤسسة الأكاديمية"
                placeholder="مثال: جامعة الملك سعود أو جامعة الإمام"
                required
                size="md"
                radius="md"
                icon={<IconBuildingCommunity size={18} />}
                disabled={mutation.isLoading}
                {...form.getInputProps('name')}
              />

              <TextInput
                label="رمز الجامعة المختصر (Code)"
                placeholder="مثال: KSU أو IMAMU"
                description="رمز فريد باللغة الإنجليزية يتكون من 2 إلى 10 أحرف (سيتحول تلقائياً إلى أحرف كبيرة)."
                required
                size="md"
                radius="md"
                icon={<IconBarcode size={18} />}
                disabled={mutation.isLoading}
                {...form.getInputProps('code')}
                onChange={(e) => {
                  form.setFieldValue('code', e.target.value.toUpperCase())
                }}
              />

              {/* Preview Card */}
              <Card
                radius="md"
                p="md"
                sx={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                  border: `1px dashed ${isDark ? theme.colors.dark[4] : theme.colors.gray[4]}`,
                }}
              >
                <Text size="xs" color="dimmed" weight={700} mb="xs">
                  معاينة هوية المنظومة:
                </Text>
                <Group position="apart">
                  <Text weight={700} size="sm">
                    {form.values.name.trim() || 'اسم جامعتك يظهر هنا'}
                  </Text>
                  <Badge variant="filled" color="brand" size="md">
                    {form.values.code.trim().toUpperCase() || 'CODE'}
                  </Badge>
                </Group>
              </Card>

              <Divider my="xs" />

              <Button
                type="submit"
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                loading={mutation.isLoading}
                leftIcon={<IconArrowLeft size={20} />}
                sx={{
                  fontWeight: 700,
                  height: 50,
                  boxShadow: isDark
                    ? '0 4px 16px rgba(59, 130, 246, 0.35)'
                    : '0 4px 16px rgba(30, 64, 175, 0.25)',
                }}
              >
                حفظ بيانات الجامعة والبدء
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}
