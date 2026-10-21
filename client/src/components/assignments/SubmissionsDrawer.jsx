import React, { useState, useMemo } from 'react'
import {
  Drawer,
  Table,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  ActionIcon,
  TextInput,
  Select,
  Paper,
  Center,
  Loader,
  Avatar,
  Box,
  Divider,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import {
  IconSearch,
  IconDownload,
  IconClock,
  IconCheck,
  IconEdit,
  IconInbox,
  IconFileText,
  IconFilter,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import GradeSubmissionModal from './GradeSubmissionModal'

export default function SubmissionsDrawer({ opened, onClose, assignment, courseId }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [gradeModalOpened, setGradeModalOpened] = useState(false)

  const assignmentId = assignment?._id

  // Fetch submissions
  const {
    data: responseData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['assignments', assignmentId, 'submissions'],
    queryFn: async () => {
      const res = await customFetch.get(`/assignments/${assignmentId}/submissions`)
      return res.data?.data || res.data || []
    },
    enabled: Boolean(assignmentId && opened),
  })

  const submissions = Array.isArray(responseData) ? responseData : []

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const studentName = (
        sub.student?.name ||
        `${sub.student?.firstName || ''} ${sub.student?.lastName || ''}`.trim() ||
        sub.student?.email ||
        ''
      ).toLowerCase()
      const studentEmail = (sub.student?.email || '').toLowerCase()
      const query = searchQuery.toLowerCase().trim()

      const matchesSearch = !query || studentName.includes(query) || studentEmail.includes(query)

      if (!matchesSearch) return false

      if (statusFilter === 'all') return true
      if (statusFilter === 'late') return sub.status === 'late'
      if (statusFilter === 'graded') return sub.status === 'graded'
      if (statusFilter === 'submitted') return sub.status === 'submitted'
      return true
    })
  }, [submissions, searchQuery, statusFilter])

  const gradedCount = submissions.filter((s) => s.status === 'graded').length
  const pendingCount = submissions.filter((s) => s.status !== 'graded').length
  const lateCount = submissions.filter((s) => s.status === 'late').length

  const handleOpenGrade = (sub) => {
    setSelectedSubmission(sub)
    setGradeModalOpened(true)
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        position="right"
        size="xl"
        title={
          <Group spacing="xs">
            <IconFileText size={22} color={theme.colors.indigo[6]} />
            <div>
              <Text weight={700} size="md">
                كشف تسليمات التكليف: {assignment?.title}
              </Text>
              <Text size="xs" color="dimmed">
                الدرجة العظمى: {assignment?.maxScore || 100} نقطة | إجمالي المسلمين:{' '}
                {submissions.length} طالب
              </Text>
            </div>
          </Group>
        }
        styles={{
          header: {
            borderBottom: `1px solid ${
              isDark ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
            paddingBottom: rem(12),
          },
          body: {
            padding: rem(16),
          },
        }}
      >
        <Stack spacing="md">
          {/* Quick Metrics Bar */}
          <Group grow>
            <Paper p="xs" withBorder radius="md" ta="center">
              <Text size="xs" color="dimmed">
                إجمالي التسليمات
              </Text>
              <Text weight={700} size="lg" color="indigo">
                {submissions.length}
              </Text>
            </Paper>
            <Paper p="xs" withBorder radius="md" ta="center">
              <Text size="xs" color="dimmed">
                تم التقييم
              </Text>
              <Text weight={700} size="lg" color="teal">
                {gradedCount}
              </Text>
            </Paper>
            <Paper p="xs" withBorder radius="md" ta="center">
              <Text size="xs" color="dimmed">
                بانتظار التقييم
              </Text>
              <Text weight={700} size="lg" color="orange">
                {pendingCount}
              </Text>
            </Paper>
            <Paper p="xs" withBorder radius="md" ta="center">
              <Text size="xs" color="dimmed">
                تسليمات متأخرة
              </Text>
              <Text weight={700} size="lg" color="red">
                {lateCount}
              </Text>
            </Paper>
          </Group>

          {/* Search & Filter Toolbar */}
          <Group spacing="sm">
            <TextInput
              placeholder="البحث باسم الطالب أو بريده الإلكتروني..."
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }}
              size="sm"
            />
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val || 'all')}
              data={[
                { value: 'all', label: 'كافة الحالات' },
                { value: 'submitted', label: 'بانتظار التقييم' },
                { value: 'graded', label: 'تم تقييمها' },
                { value: 'late', label: 'متأخرة فقط' },
              ]}
              icon={<IconFilter size={16} />}
              size="sm"
              w={160}
            />
          </Group>

          {/* Submissions Content */}
          {isLoading ? (
            <Center py="xl">
              <Loader size="md" color="indigo" />
            </Center>
          ) : filteredSubmissions.length === 0 ? (
            <Paper p="xl" withBorder radius="md" ta="center" my="md">
              <Center mb="sm">
                <IconInbox size={42} stroke={1.4} color={theme.colors.gray[5]} />
              </Center>
              <Text weight={600} size="sm">
                لا توجد تسليمات مسجلة
              </Text>
              <Text size="xs" color="dimmed" mt={4}>
                {searchQuery || statusFilter !== 'all'
                  ? 'لم يتم العثور على طلاب مطابقين لشروط البحث الحالية.'
                  : 'لم يقم أي طالب برفع حل هذا التكليف حتى الآن.'}
              </Text>
            </Paper>
          ) : (
            <Paper withBorder radius="md" sx={{ overflow: 'hidden' }}>
              <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
                <thead>
                  <tr
                    style={{
                      backgroundColor: isDark
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                    }}
                  >
                    <th>الطالب</th>
                    <th>توقيت التسليم</th>
                    <th>ملف الحل</th>
                    <th>الدرجة المرصودة</th>
                    <th style={{ textAlign: 'center' }}>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => {
                    const studentName =
                      sub.student?.name ||
                      `${sub.student?.firstName || ''} ${sub.student?.lastName || ''}`.trim() ||
                      sub.student?.email ||
                      'طالب غير محدد'
                    const studentAvatar = sub.student?.avatar
                    const isLate = sub.status === 'late'
                    const isGraded = sub.status === 'graded'

                    const submitDate = sub.submittedAt
                      ? new Date(sub.submittedAt).toLocaleString('ar-SA', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'

                    return (
                      <tr key={sub._id}>
                        <td>
                          <Group spacing="xs" noWrap>
                            <Avatar src={studentAvatar} radius="xl" size="sm" color="indigo">
                              {studentName.charAt(0)}
                            </Avatar>
                            <div>
                              <Text size="sm" weight={600}>
                                {studentName}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {sub.student?.email || '—'}
                              </Text>
                            </div>
                          </Group>
                        </td>

                        <td>
                          <Group spacing={4} noWrap>
                            <IconClock size={14} color={isLate ? theme.colors.red[5] : theme.colors.gray[6]} />
                            <Text size="xs">{submitDate}</Text>
                            {isLate ? (
                              <Badge color="red" size="xs" variant="light">
                                متأخر
                              </Badge>
                            ) : (
                              <Badge color="teal" size="xs" variant="light">
                                في الموعد
                              </Badge>
                            )}
                          </Group>
                        </td>

                        <td>
                          {sub.fileUrl ? (
                            <Button
                              component="a"
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              size="xs"
                              variant="subtle"
                              color="indigo"
                              leftIcon={<IconDownload size={14} />}
                            >
                              تحميل الملف
                            </Button>
                          ) : (
                            <Text size="xs" color="dimmed">
                              لا يوجد ملف
                            </Text>
                          )}
                        </td>

                        <td>
                          {isGraded ? (
                            <Badge color="teal" size="md" variant="filled">
                              {sub.grade} / {assignment.maxScore}
                            </Badge>
                          ) : (
                            <Badge color="orange" size="sm" variant="light">
                              بانتظار الرصد
                            </Badge>
                          )}
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <Button
                            size="xs"
                            variant={isGraded ? 'light' : 'filled'}
                            color="indigo"
                            leftIcon={<IconEdit size={14} />}
                            onClick={() => handleOpenGrade(sub)}
                          >
                            {isGraded ? 'تعديل الدرجة' : 'رصد الدرجة'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Paper>
          )}
        </Stack>
      </Drawer>

      {/* Grade Action Modal */}
      <GradeSubmissionModal
        opened={gradeModalOpened}
        onClose={() => setGradeModalOpened(false)}
        submission={selectedSubmission}
        maxScore={assignment?.maxScore || 100}
        onSuccess={() => refetch()}
      />
    </>
  )
}
