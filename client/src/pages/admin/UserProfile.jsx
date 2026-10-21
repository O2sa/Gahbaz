import React, { useMemo } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Paper,
  Badge,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IconArrowRight,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconSchool,
  IconUserCheck,
  IconCalendar,
  IconAward,
} from '@tabler/icons-react'
import { useGetElements } from '../crud'
import { useQuery } from '@tanstack/react-query'
import { MantineReactTable } from 'mantine-react-table'
import { Helmet } from 'react-helmet'
import { PageHeader } from '../../components/common/index.js'
import dayjs from 'dayjs'

export default function UserProfile({ queryClient }) {
  const { userId } = useParams()
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: user = null,
    isFetching,
    isLoading,
  } = useQuery(useGetElements(['users', userId]))

  if (isFetching || isLoading) {
    return (
      <Box p="md">
        <Skeleton height={50} mb="lg" radius="md" />
        <Skeleton height={180} mb="xl" radius="lg" />
        <Skeleton height={200} radius="lg" />
      </Box>
    )
  }

  const roleName = user?.__t || user?.role || user?.kind || 'User'
  const isStudent = roleName === 'Student' || user?.role === 'student'
  const isTeacher = roleName === 'Teacher' || roleName === 'Teatcher' || user?.role === 'teacher'
  const isAdmin = roleName === 'Admin' || user?.role === 'admin'

  const getRoleBadge = () => {
    if (isStudent) {
      return (
        <Badge
          color="teal"
          variant="light"
          size="md"
          leftSection={<IconSchool size={14} />}
        >
          طالب جامعي
        </Badge>
      )
    }
    if (isTeacher) {
      return (
        <Badge
          color="blue"
          variant="light"
          size="md"
          leftSection={<IconUserCheck size={14} />}
        >
          عضو هيئة تدريس
        </Badge>
      )
    }
    return (
      <Badge
        color="violet"
        variant="light"
        size="md"
        leftSection={<IconShieldCheck size={14} />}
      >
        مدير نظام
      </Badge>
    )
  }

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || 'مستخدم'

  return (
    <Box>
      <Helmet>
        <title>{`منصة جهبذ | ${fullName}`}</title>
      </Helmet>

      <PageHeader
        title="الملف التعريفي للمستخدم"
        description="عرض البيانات الشخصية، الانتماء الأكاديمي، وسجل الدرجات والأنشطة"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'المستخدمون', href: '/users' },
          { title: fullName },
        ]}
        action={
          <Button
            variant="default"
            leftIcon={<IconArrowRight size={16} />}
            onClick={() => navigate(-1)}
          >
            رجوع
          </Button>
        }
      />

      {/* User Hero Banner Card */}
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
        <Group position="apart" align="center" spacing="xl">
          <Group spacing="lg">
            <Avatar
              size={90}
              radius="xl"
              src={user?.avatar}
              color="brand"
              sx={{
                border: `3px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
            <Box>
              <Group spacing="xs" mb={4}>
                <Title
                  order={3}
                  sx={{
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontWeight: 800,
                  }}
                >
                  {fullName}
                </Title>
                {getRoleBadge()}
              </Group>

              {user?.major?.name && (
                <Text size="sm" color="dimmed" mb={4}>
                  {user.major.name}
                  {user?.comingSemester ? ` • المستوى ${user.comingSemester}` : ''}
                </Text>
              )}

              <Text size="xs" color="dimmed">
                معرف المستخدم: {user?._id || userId}
              </Text>
            </Box>
          </Group>

          <Grid sx={{ minWidth: 260 }}>
            <Grid.Col span={12}>
              <Group spacing="xs">
                <IconMail
                  size={16}
                  color={isDark ? theme.colors.dark[2] : theme.colors.gray[6]}
                />
                <Text size="sm" weight={500} color={isDark ? 'gray.3' : 'gray.8'}>
                  {user?.email || '—'}
                </Text>
              </Group>
            </Grid.Col>
            {user?.phone && (
              <Grid.Col span={12}>
                <Group spacing="xs">
                  <IconPhone
                    size={16}
                    color={isDark ? theme.colors.dark[2] : theme.colors.gray[6]}
                  />
                  <Text size="sm" color="dimmed">
                    {user.phone}
                  </Text>
                </Group>
              </Grid.Col>
            )}
          </Grid>
        </Group>
      </Paper>

      {/* If Student, Render Academic Grades */}
      {isStudent && (
        <Box mt="lg">
          <Title
            order={4}
            mb="md"
            sx={{
              color: isDark ? '#ffffff' : '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IconAward size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
            السجل الأكاديمي والدرجات
          </Title>
          <StudentGradesSection queryClient={queryClient} userId={userId} />
        </Box>
      )}
    </Box>
  )
}

function StudentGradesSection({ queryClient, userId }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: grades = [],
    isLoading,
    isFetching,
  } = useQuery(useGetElements(['grades', 'student-grades', userId]))

  if (isLoading || isFetching) {
    return (
      <Paper withBorder p="xl" radius="lg">
        <Skeleton height={20} mb="sm" width="40%" />
        <Skeleton height={120} radius="md" />
      </Paper>
    )
  }

  if (!grades || grades.length === 0) {
    return (
      <Paper
        withBorder
        p="xl"
        radius="lg"
        sx={{
          textAlign: 'center',
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.6)'
            : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
      >
        <Text color="dimmed" size="sm">
          لا توجد سجلات درجات مرصودة لهذا الطالب حالياً.
        </Text>
      </Paper>
    )
  }

  return (
    <Stack spacing="xl">
      {grades.map((gr, idx) => {
        const semesterName = gr?.semester?.name || `الفصل الدراسي ${idx + 1}`
        const dateRange = gr?.semester?.startDate
          ? `${dayjs(gr.semester.startDate).format('YYYY/MM/DD')} - ${dayjs(gr.semester.endDate).format('YYYY/MM/DD')}`
          : ''

        return (
          <Paper
            key={gr?.semester?._id || idx}
            withBorder
            radius="lg"
            p="lg"
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
            <Group position="apart" mb="md">
              <Group spacing="xs">
                <IconCalendar size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                <Text weight={700} size="md" color={isDark ? 'gray.1' : 'gray.9'}>
                  {semesterName}
                </Text>
              </Group>
              {dateRange && (
                <Text size="xs" color="dimmed">
                  {dateRange}
                </Text>
              )}
            </Group>

            <GradesTable grades={gr.grades || []} isDark={isDark} theme={theme} />
          </Paper>
        )
      })}
    </Stack>
  )
}

const GradesTable = ({ grades, isDark, theme }) => {
  const columns = useMemo(() => {
    if (!grades || grades.length === 0) return []

    const sampleGrade = grades[0]?.grade || {}
    const dynamicCols = Object.keys(sampleGrade).map((grKey) => ({
      id: grKey,
      header: sampleGrade[grKey]?.name || grKey,
      accessorFn: (row) => row?.grade?.[grKey]?.value ?? '—',
    }))

    return [
      {
        id: 'course',
        header: 'المقرر الدراسي',
        accessorFn: (row) => row?.course?.name || 'مقرر',
        Cell: ({ cell, row }) => (
          <Group spacing="xs">
            <Text weight={600} size="sm" color={isDark ? 'gray.1' : 'gray.9'}>
              {row.original?.course?.name || 'مقرر'}
            </Text>
            {row.original?.course?.code && (
              <Badge size="xs" variant="outline" color="brand">
                {row.original.course.code}
              </Badge>
            )}
          </Group>
        ),
      },
      ...dynamicCols,
      {
        id: 'total',
        header: 'المجموع الكلي',
        accessorKey: 'total',
        Cell: ({ cell }) => (
          <Badge
            color={Number(cell.getValue()) >= 60 ? 'teal' : 'red'}
            variant="light"
            size="md"
          >
            {cell.getValue() ?? '—'}%
          </Badge>
        ),
      },
    ]
  }, [grades, isDark])

  if (!grades || grades.length === 0) {
    return (
      <Text size="sm" color="dimmed" p="md">
        لا توجد درجات مسجلة.
      </Text>
    )
  }

  return (
    <MantineReactTable
      columns={columns}
      data={grades}
      getRowId={(row) => row._id || row.id}
      enableTopToolbar={false}
      enableBottomToolbar={false}
      mantinePaperProps={{
        sx: {
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.6)'
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          boxShadow: 'none',
        },
      }}
      mantineTableProps={{
        sx: {
          backgroundColor: 'transparent',
        },
      }}
      mantineTableHeadCellProps={{
        sx: {
          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
          color: isDark ? theme.colors.dark[0] : theme.colors.gray[8],
          fontWeight: 700,
        },
      }}
      mantineTableBodyCellProps={{
        sx: {
          color: isDark ? theme.colors.dark[0] : theme.colors.gray[8],
        },
      }}
    />
  )
}
