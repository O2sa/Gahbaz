import React, { useState, useMemo } from 'react'
import {
  Card,
  SimpleGrid,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  ActionIcon,
  TextInput,
  Paper,
  Tabs,
  Progress,
  ThemeIcon,
  Center,
  Loader,
  Alert,
  Tooltip,
  Divider,
  Modal,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import {
  IconFileText,
  IconPlus,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconTrash,
  IconEdit,
  IconDownload,
  IconUsers,
  IconChartBar,
  IconSearch,
  IconArrowRight,
  IconBook,
  IconPaperclip,
  IconCertificate,
  IconFileCheck,
  IconFileX,
  IconInbox,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { PageHeader, EmptyState } from '../../components/common'
import {
  AssignmentFormModal,
  SubmissionsDrawer,
  SubmitAssignmentModal,
} from '../../components/assignments'

export default function CourseAssignments() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { t: tNav } = useTranslation('nav')
  const { courseId } = useParams()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const queryClient = useQueryClient()

  // User session
  const { data: userResponse } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await customFetch.get('/users/current-user').catch(() => customFetch.get('/users/showMe'))
      return res.data?.data || res.data?.user || res.data || {}
    },
  })
  const role = userResponse?.role || 'admin'
  const isFaculty = role === 'teacher' || role === 'admin' || role === 'super-admin'
  const isStudent = role === 'student'

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [studentTab, setStudentTab] = useState('active')
  const [formModalOpened, setFormModalOpened] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [submissionsDrawerOpened, setSubmissionsDrawerOpened] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submitModalOpened, setSubmitModalOpened] = useState(false)
  const [submittingAssignment, setSubmittingAssignment] = useState(null)
  const [deleteConfirmAssignment, setDeleteConfirmAssignment] = useState(null)

  // Fetch course details
  const { data: courseData } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: async () => {
      const res = await customFetch.get(`/courses/${courseId}`)
      return res.data?.data || res.data || {}
    },
    enabled: Boolean(courseId),
  })

  // Fetch assignments
  const {
    data: assignmentsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['assignments', 'course', courseId],
    queryFn: async () => {
      const res = await customFetch.get(`/assignments/course/${courseId}`)
      return res.data?.data || res.data || []
    },
    enabled: Boolean(courseId),
  })

  const assignments = Array.isArray(assignmentsResponse) ? assignmentsResponse : []

  // If student, fetch their submissions across these assignments
  const { data: mySubmissionsResponse } = useQuery({
    queryKey: ['assignments', 'my-submissions', courseId],
    queryFn: async () => {
      if (!isStudent || assignments.length === 0) return {}
      const results = {}
      await Promise.all(
        assignments.map(async (a) => {
          try {
            const res = await customFetch.get(`/assignments/${a._id}/my-submission`)
            if (res.data?.data || res.data) {
              results[a._id] = res.data?.data || res.data
            }
          } catch {
            // No submission yet
          }
        })
      )
      return results
    },
    enabled: isStudent && assignments.length > 0,
  })

  const mySubmissions = mySubmissionsResponse || {}

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await customFetch.delete(`/assignments/${id}`)
      return res.data
    },
    onSuccess: () => {
      notifications.show({
        title: tCommon('notifications.success'),
        message: t('assignmentsData.deleteAssignment'),
        color: 'teal',
        icon: <IconCheck size={16} />,
      })
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', courseId] })
      setDeleteConfirmAssignment(null)
    },
    onError: (err) => {
      notifications.show({
        title: tCommon('notifications.error'),
        message: err?.response?.data?.message || tCommon('notifications.error'),
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
  })

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)

      if (!matchesSearch) return false

      if (isStudent) {
        const isPastDue = a.dueDate && new Date() > new Date(a.dueDate)
        const sub = mySubmissions[a._id]
        const hasSubmitted = Boolean(sub)

        if (studentTab === 'active') {
          return !hasSubmitted && !isPastDue
        }
        if (studentTab === 'submitted') {
          return hasSubmitted
        }
        if (studentTab === 'past') {
          return isPastDue && !hasSubmitted
        }
      }

      return true
    })
  }, [assignments, searchQuery, studentTab, isStudent, mySubmissions])

  // Faculty telemetry calculations
  const totalAssignments = assignments.length
  const activeAssignments = assignments.filter(
    (a) => a.dueDate && new Date(a.dueDate) > new Date()
  ).length

  // Helper: Format countdown badge for students
  const getDeadlineBadge = (dueDateString) => {
    if (!dueDateString) return null
    const due = new Date(dueDateString)
    const now = new Date()
    const diffMs = due - now

    if (diffMs < 0) {
      return (
        <Badge color="red" size="sm" variant="light" leftSection={<IconClock size={12} />}>
          {t('assignmentsData.pastDue')}
        </Badge>
      )
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays === 0) {
      return (
        <Badge color="orange" size="sm" variant="filled" leftSection={<IconClock size={12} />}>
          {t('assignmentsData.dueToday', { hours: diffHours })}
        </Badge>
      )
    }

    return (
      <Badge color="teal" size="sm" variant="light" leftSection={<IconClock size={12} />}>
        {t('assignmentsData.daysRemaining', { days: diffDays })}
      </Badge>
    )
  }

  return (
    <Stack spacing="lg">
      <PageHeader
        title={t('assignmentsData.title')}
        description={
          courseData?.name
            ? `${tNav('courses')}: ${courseData.name} (${courseData.code || '—'})`
            : t('assignmentsData.subtitle')
        }
        breadcrumbs={[
          { title: tCommon('actions.home'), href: '/' },
          { title: tNav('courses'), href: '/courses' },
          {
            title: courseData?.name || tNav('courses'),
            href: `/courses/${courseId}`,
          },
          { title: t('assignmentsData.title') },
        ]}
        action={
          <Group spacing="sm">
            <Button
              component={Link}
              to={`/courses/${courseId}`}
              variant="default"
              size="sm"
              leftIcon={<IconArrowRight size={16} />}
            >
              {tCommon('actions.back')}
            </Button>
            {isFaculty && (
              <Button
                color="indigo"
                size="sm"
                leftIcon={<IconPlus size={16} />}
                onClick={() => {
                  setEditingAssignment(null)
                  setFormModalOpened(true)
                }}
              >
                {t('assignmentsData.addNew')}
              </Button>
            )}
          </Group>
        }
      />

      {/* Faculty Telemetry Cards */}
      {isFaculty && (
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <Paper p="md" withBorder radius="md">
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" weight={600} transform="uppercase">
                  {t('assignmentsData.totalPublished')}
                </Text>
                <Title order={3} mt={4} color="indigo">
                  {totalAssignments}
                </Title>
              </div>
              <ThemeIcon color="indigo" variant="light" size={44} radius="md">
                <IconFileText size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" withBorder radius="md">
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" weight={600} transform="uppercase">
                  {t('assignmentsData.activeNow')}
                </Text>
                <Title order={3} mt={4} color="teal">
                  {activeAssignments}
                </Title>
              </div>
              <ThemeIcon color="teal" variant="light" size={44} radius="md">
                <IconClock size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" withBorder radius="md">
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" weight={600} transform="uppercase">
                  {t('assignmentsData.enrolledStudents')}
                </Text>
                <Title order={3} mt={4} color="blue">
                  {courseData?.students?.length || 0}
                </Title>
              </div>
              <ThemeIcon color="blue" variant="light" size={44} radius="md">
                <IconUsers size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>
      )}

      {/* Student Progress Summary Header */}
      {isStudent && (
        <Paper p="md" withBorder radius="md">
          <Group position="apart" mb="sm">
            <div>
              <Text size="sm" weight={700}>
                {t('assignmentsData.progressTitle')}
              </Text>
              <Text size="xs" color="dimmed">
                {t('assignmentsData.progressSub', {
                  count: Object.keys(mySubmissions).length,
                  total: totalAssignments,
                })}
              </Text>
            </div>
            <Badge size="lg" color="indigo" variant="light">
              {totalAssignments > 0
                ? t('assignmentsData.progressCompleted', {
                    percent: Math.round((Object.keys(mySubmissions).length / totalAssignments) * 100),
                  })
                : tCommon('table.noRecords')}
            </Badge>
          </Group>
          <Progress
            value={
              totalAssignments > 0
                ? (Object.keys(mySubmissions).length / totalAssignments) * 100
                : 0
            }
            size="md"
            radius="xl"
            color="indigo"
          />
        </Paper>
      )}

      {/* Search & Student Filter Tabs */}
      <Paper p="sm" withBorder radius="md">
        <Group position="apart">
          <TextInput
            placeholder={t('assignmentsData.searchPlaceholder')}
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            w={320}
            size="sm"
          />

          {isStudent && (
            <Tabs value={studentTab} onTabChange={setStudentTab} variant="pills" color="indigo">
              <Tabs.List>
                <Tabs.Tab value="active">{t('assignmentsData.tabs.active')}</Tabs.Tab>
                <Tabs.Tab value="submitted">{t('assignmentsData.tabs.submitted')}</Tabs.Tab>
                <Tabs.Tab value="past">{t('assignmentsData.tabs.past')}</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          )}
        </Group>
      </Paper>

      {/* Main Content Area */}
      {isLoading ? (
        <Center py="xl">
          <Loader size="lg" color="indigo" />
        </Center>
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? t('assignmentsData.emptySearch')
              : isStudent && studentTab === 'submitted'
              ? t('assignmentsData.emptySubmitted')
              : t('assignmentsData.emptyNone')
          }
          description={t('assignmentsData.subtitle')}
          icon={IconFileText}
        />
      ) : (
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {filteredAssignments.map((assignment) => {
            const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null
            const formattedDate = dueDate
              ? dueDate.toLocaleDateString()
              : '—'

            const submission = mySubmissions[assignment._id]
            const isGraded = submission?.status === 'graded'

            return (
              <Card
                key={assignment._id}
                p="lg"
                radius="md"
                withBorder
                sx={{
                  backgroundColor: isDark
                    ? 'rgba(26, 27, 30, 0.75)'
                    : 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows.md,
                  },
                }}
              >
                <div>
                  <Group position="apart" mb="xs" noWrap>
                    <Group spacing="xs">
                      <ThemeIcon color="indigo" variant="light" size="md" radius="md">
                        <IconFileText size={18} />
                      </ThemeIcon>
                      <Text weight={700} size="md" lineClamp={1}>
                        {assignment.title}
                      </Text>
                    </Group>
                    <Badge color="indigo" size="md" variant="filled">
                      {t('assignmentsData.points', { count: assignment.maxScore || 100 })}
                    </Badge>
                  </Group>

                  {assignment.description && (
                    <Text size="sm" color="dimmed" lineClamp={3} mb="md">
                      {assignment.description}
                    </Text>
                  )}

                  <Group spacing="xs" mb="sm" wrap="wrap">
                    <Badge color="gray" size="sm" variant="light" leftSection={<IconClock size={12} />}>
                      {t('assignmentsData.due', { date: formattedDate })}
                    </Badge>
                    {getDeadlineBadge(assignment.dueDate)}
                  </Group>

                  {/* Teacher Brief Attachment Download */}
                  {assignment.fileUrl && (
                    <Button
                      component="a"
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      size="xs"
                      variant="subtle"
                      color="indigo"
                      leftIcon={<IconPaperclip size={14} />}
                      mb="sm"
                    >
                      {t('assignmentsData.downloadBrief')}
                    </Button>
                  )}

                  {/* Student Submission & Grade Callout */}
                  {isStudent && submission && (
                    <Paper
                      p="xs"
                      withBorder
                      radius="md"
                      mb="md"
                      sx={{
                        backgroundColor: isDark
                          ? theme.colors.dark[6]
                          : isGraded
                          ? 'rgba(20, 184, 166, 0.08)'
                          : 'rgba(59, 130, 246, 0.08)',
                        borderColor: isGraded
                          ? theme.colors.teal[6]
                          : theme.colors.blue[5],
                      }}
                    >
                      <Group position="apart" mb={4}>
                        <Group spacing={6}>
                          <IconCheck size={16} color={isGraded ? theme.colors.teal[6] : theme.colors.blue[6]} />
                          <Text size="xs" weight={700}>
                            {isGraded ? t('assignmentsData.graded') : t('assignmentsData.submittedSuccess')}
                          </Text>
                        </Group>
                        {isGraded && (
                          <Badge color="teal" size="md" variant="filled">
                            {submission.grade} / {assignment.maxScore} (
                            {Math.round((submission.grade / assignment.maxScore) * 100)}%)
                          </Badge>
                        )}
                      </Group>

                      {submission.feedback && (
                        <Text size="xs" color="dimmed" mt={4} sx={{ fontStyle: 'italic' }}>
                          {t('assignmentsData.instructorFeedback', { feedback: submission.feedback })}
                        </Text>
                      )}
                    </Paper>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div>
                  <Divider my="sm" />
                  <Group position="apart">
                    {isFaculty ? (
                      <>
                        <Button
                          size="xs"
                          variant="light"
                          color="indigo"
                          leftIcon={<IconUsers size={14} />}
                          onClick={() => {
                            setSelectedAssignment(assignment)
                            setSubmissionsDrawerOpened(true)
                          }}
                        >
                          {t('assignmentsData.reviewSubmissions')}
                        </Button>

                        <Group spacing={6}>
                          <ActionIcon
                            color="indigo"
                            variant="subtle"
                            onClick={() => {
                              setEditingAssignment(assignment)
                              setFormModalOpened(true)
                            }}
                            title={t('assignmentsData.editAssignment')}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => setDeleteConfirmAssignment(assignment)}
                            title={t('assignmentsData.deleteAssignment')}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          color="indigo"
                          fullWidth
                          leftIcon={submission ? <IconEdit size={16} /> : <IconFileCheck size={16} />}
                          onClick={() => {
                            setSubmittingAssignment(assignment)
                            setSubmitModalOpened(true)
                          }}
                        >
                          {submission ? t('assignmentsData.resubmit') : t('assignmentsData.submitNow')}
                        </Button>
                      </>
                    )}
                  </Group>
                </div>
              </Card>
            )
          })}
        </SimpleGrid>
      )}

      {/* Faculty Create / Edit Modal */}
      <AssignmentFormModal
        opened={formModalOpened}
        onClose={() => setFormModalOpened(false)}
        courseId={courseId}
        assignment={editingAssignment}
        onSuccess={() => refetch()}
      />

      {/* Faculty Submissions Slide-Over Drawer */}
      <SubmissionsDrawer
        opened={submissionsDrawerOpened}
        onClose={() => setSubmissionsDrawerOpened(false)}
        assignment={selectedAssignment}
        courseId={courseId}
      />

      {/* Student Submit Modal */}
      <SubmitAssignmentModal
        opened={submitModalOpened}
        onClose={() => setSubmitModalOpened(false)}
        assignment={submittingAssignment}
        existingSubmission={submittingAssignment ? mySubmissions[submittingAssignment._id] : null}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        opened={Boolean(deleteConfirmAssignment)}
        onClose={() => setDeleteConfirmAssignment(null)}
        title={t('assignmentsData.deleteConfirmTitle')}
        size="sm"
        radius="md"
      >
        <Stack spacing="md">
          <Text size="sm">
            {t('assignmentsData.deleteConfirmMessage')}
          </Text>
          <Group position="right">
            <Button
              variant="default"
              onClick={() => setDeleteConfirmAssignment(null)}
              disabled={deleteMutation.isLoading}
            >
              {tCommon('actions.cancel')}
            </Button>
            <Button
              color="red"
              onClick={() => deleteMutation.mutate(deleteConfirmAssignment._id)}
              loading={deleteMutation.isLoading}
            >
              {tCommon('actions.delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
