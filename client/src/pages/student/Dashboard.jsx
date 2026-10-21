import React from 'react'
import {
  Box,
  Paper,
  Title,
  Text,
  SimpleGrid,
  Group,
  Button,
  Badge,
  useMantineTheme,
  Card,
  ThemeIcon,
} from '@mantine/core'
import {
  IconBook,
  IconSchool,
  IconCertificate,
  IconArrowLeft,
  IconMessageDots,
  IconPlayerPlay,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '../../components/common'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export default function StudentDashboard() {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const navigate = useNavigate()
  const { user } = useDashboardContext()

  return (
    <Box p={{ base: 'xs', sm: 'md' }}>
      {/* Welcome Banner */}
      <Paper
        p="xl"
        radius="lg"
        mb="xl"
        sx={{
          background: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.brand[2]}`,
        }}
      >
        <Group position="apart" align="center">
          <Box>
            <Group spacing="xs" mb="xs">
              <Badge color="teal" variant="filled" size="sm">
                بوابة الطالب
              </Badge>
              <Text size="xs" color="dimmed">
                الفصل الدراسي الأول 2026/2027
              </Text>
            </Group>
            <Title
              order={2}
              sx={{
                fontWeight: 800,
                color: isDark ? '#ffffff' : '#1e3a8a',
                fontSize: 26,
              }}
            >
              أهلاً بك، {user?.name || 'الطالب'} 🎓
            </Title>
            <Text color="dimmed" size="sm" mt={4} sx={{ maxWidth: 600 }}>
              تابع محاضراتك المسجلة، تقدمك في المساقات، واطلع على درجاتك الفصلية أولاً بأول.
            </Text>
          </Box>

          <Button
            variant="gradient"
            gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
            radius="md"
            leftIcon={<IconArrowLeft size={16} />}
            onClick={() => navigate('/courses')}
            sx={{ fontWeight: 700 }}
          >
            تصفح مقرراتي
          </Button>
        </Group>
      </Paper>

      {/* KPI Stat Cards */}
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
        spacing="md"
        mb="xl"
      >
        <StatCard
          title="المقررات المسجلة"
          value={6}
          description="مساقات دراسية هذا الفصل"
          icon={<IconBook size={24} />}
          color="blue"
        />
        <StatCard
          title="السجل الأكاديمي"
          value="كشف الدرجات"
          description="متابعة نتائج الاختبارات"
          icon={<IconCertificate size={24} />}
          color="teal"
        />
        <StatCard
          title="الوضع الأكاديمي"
          value="منتظم"
          description="حالة القيد: مستمر بالدراسة"
          icon={<IconSchool size={24} />}
          color="indigo"
        />
      </SimpleGrid>

      {/* Quick Access Cards */}
      <Title order={3} sx={{ fontSize: 18, fontWeight: 700 }} mb="md">
        الوصول السريع
      </Title>

      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
        spacing="md"
      >
        <Card
          p="lg"
          radius="md"
          withBorder
          sx={{
            cursor: 'pointer',
            backgroundColor: isDark ? 'rgba(37, 38, 43, 0.75)' : '#ffffff',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              borderColor: theme.colors.brand[5],
            },
          }}
          onClick={() => navigate('/courses')}
        >
          <ThemeIcon size={44} radius="md" color="blue" variant="light" mb="md">
            <IconPlayerPlay size={24} />
          </ThemeIcon>
          <Text weight={700} size="md" mb={4}>
            المحاضرات الرقمية
          </Text>
          <Text size="xs" color="dimmed">
            مشاهدة الدروس المسجلة وتحميل المرفقات الأكاديمية.
          </Text>
        </Card>

        <Card
          p="lg"
          radius="md"
          withBorder
          sx={{
            cursor: 'pointer',
            backgroundColor: isDark ? 'rgba(37, 38, 43, 0.75)' : '#ffffff',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              borderColor: theme.colors.teal[5],
            },
          }}
          onClick={() => navigate('/grades')}
        >
          <ThemeIcon size={44} radius="md" color="teal" variant="light" mb="md">
            <IconCertificate size={24} />
          </ThemeIcon>
          <Text weight={700} size="md" mb={4}>
            كشف الدرجات والنتائج
          </Text>
          <Text size="xs" color="dimmed">
            استعراض نتائج المقررات وتقديرات الامتحانات.
          </Text>
        </Card>

        <Card
          p="lg"
          radius="md"
          withBorder
          sx={{
            cursor: 'pointer',
            backgroundColor: isDark ? 'rgba(37, 38, 43, 0.75)' : '#ffffff',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              borderColor: theme.colors.violet[5],
            },
          }}
          onClick={() => navigate('/chat')}
        >
          <ThemeIcon size={44} radius="md" color="violet" variant="light" mb="md">
            <IconMessageDots size={24} />
          </ThemeIcon>
          <Text weight={700} size="md" mb={4}>
            غرف النقاش والدردشة
          </Text>
          <Text size="xs" color="dimmed">
            التواصل مع أساتذة المساقات والزملاء للمناقشة الأكاديمية.
          </Text>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
