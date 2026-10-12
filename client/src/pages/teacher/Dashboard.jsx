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
  IconUsers,
  IconCalendar,
  IconArrowLeft,
  IconMessageDots,
  IconCertificate,
  IconVideo,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '../../components/common'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export default function TeacherDashboard() {
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
              <Badge color="blue" variant="filled" size="sm">
                بوابة هيئة التدريس
              </Badge>
              <Text size="xs" color="dimmed">
                الفصل الدراسي الحالي: الأول 2026/2027
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
              مرحباً د. {user?.name || 'الأستاذ'} 👋
            </Title>
            <Text color="dimmed" size="sm" mt={4} sx={{ maxWidth: 600 }}>
              تابع مقرراتك الدراسية، رفع المحاضرات والدروس، ورصد درجات الطلاب والتفاعل معهم.
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
            تصفح المقررات المسندة
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
          title="المقررات الدراسية النشطة"
          value={4}
          description="مساقات مسندة لك هذا الفصل"
          icon={<IconBook size={24} />}
          color="blue"
          diff={0}
        />
        <StatCard
          title="إجمالي الطلاب المسجلين"
          value={185}
          description="طالب في كافة مقرراتك"
          icon={<IconUsers size={24} />}
          color="teal"
          diff={12}
        />
        <StatCard
          title="حالة الفصل الدراسي"
          value="نشط"
          description="الفصل الأكاديمي قيد التدريس"
          icon={<IconCalendar size={24} />}
          color="indigo"
        />
      </SimpleGrid>

      {/* Quick Action Navigation Cards */}
      <Title order={3} sx={{ fontSize: 18, fontWeight: 700 }} mb="md">
        المهام الأكاديمية السريعة
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
            <IconVideo size={24} />
          </ThemeIcon>
          <Text weight={700} size="md" mb={4}>
            إدارة المحاضرات والدروس
          </Text>
          <Text size="xs" color="dimmed">
            رفع ملفات الدروس، مقاطع الفيديو التعليمية وتنظيم الوحدات.
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
          onClick={() => navigate('/courses')}
        >
          <ThemeIcon size={44} radius="md" color="teal" variant="light" mb="md">
            <IconCertificate size={24} />
          </ThemeIcon>
          <Text weight={700} size="md" mb={4}>
            رصد درجات الطلاب
          </Text>
          <Text size="xs" color="dimmed">
            إدخال نتائج الاختبارات الشهرية والأنشطة والامتحان النهائي.
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
            المحادثات الأكاديمية
          </Text>
          <Text size="xs" color="dimmed">
            التواصل الفوري مع الطلاب للرد على الأسئلة والاستفسارات.
          </Text>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
