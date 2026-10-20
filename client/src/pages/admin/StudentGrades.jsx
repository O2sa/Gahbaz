import React, { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Group,
  Text,
  Badge,
  Button,
  ActionIcon,
  Modal,
  NumberInput,
  TextInput,
  Paper,
  SimpleGrid,
  Stack,
  Loader,
  Center,
  Alert,
  Avatar,
  ThemeIcon,
  Title,
  Divider,
  Select,
  Progress,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import {
  IconUsers,
  IconChartBar,
  IconTrophy,
  IconPercentage,
  IconSearch,
  IconEdit,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
  IconCertificate,
  IconBook,
  IconFileSpreadsheet,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { PageHeader, EmptyState } from '../../components/common'

// Helper: Calculate official letter grade and color
export const getLetterGrade = (total) => {
  const score = Number(total) || 0
  if (score >= 95) return { grade: 'A+', label: 'ممتاز مرتفع', color: 'teal', variant: 'filled' }
  if (score >= 90) return { grade: 'A', label: 'ممتاز', color: 'teal', variant: 'light' }
  if (score >= 85) return { grade: 'B+', label: 'جيد جداً مرتفع', color: 'blue', variant: 'filled' }
  if (score >= 80) return { grade: 'B', label: 'جيد جداً', color: 'blue', variant: 'light' }
  if (score >= 75) return { grade: 'C+', label: 'جيد مرتفع', color: 'cyan', variant: 'filled' }
  if (score >= 70) return { grade: 'C', label: 'جيد', color: 'cyan', variant: 'light' }
  if (score >= 65) return { grade: 'D+', label: 'مقبول مرتفع', color: 'yellow', variant: 'light' }
  if (score >= 60) return { grade: 'D', label: 'مقبول', color: 'orange', variant: 'light' }
  return { grade: 'F', label: 'راسب', color: 'red', variant: 'filled' }
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      const courseId = params?.courseId
      if (courseId) {
        await queryClient.prefetchQuery({
          queryKey: ['grades', 'course', courseId],
          queryFn: async () => {
            const res = await customFetch.get(`/grades/course/${courseId}`)
            return res.data?.data || res.data || {}
          },
        })
      }
      return courseId
    } catch (error) {
      console.error('Gradebook loader error:', error)
      return null
    }
  }

export default function StudentGrades() {
  const { courseId } = useParams()
  const queryClient = useQueryClient()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingGrade, setEditingGrade] = useState(null)
  const [formScores, setFormScores] = useState({})

  // Fetch enriched course gradebook
  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['grades', 'course', courseId],
    queryFn: async () => {
      const res = await customFetch.get(`/grades/course/${courseId}`)
      return res.data?.data || res.data || {}
    },
  })

  // Normalize data (support enriched envelope and legacy array fallback)
  const isEnriched = responseData && !Array.isArray(responseData) && responseData.grades
  const course = isEnriched ? responseData.course : null
  const rawGrades = isEnriched
    ? responseData.grades
    : Array.isArray(responseData)
    ? responseData
    : []
  const gradeSchema = isEnriched
    ? responseData.gradeSchema
    : rawGrades[0]?.grade
    ? {
        total: 100,
        grade: Object.keys(rawGrades[0].grade).reduce((acc, k) => {
          acc[k] = { name: rawGrades[0].grade[k].name, value: 30 }
          return acc
        }, {}),
      }
    : {
        total: 100,
        grade: {
          0: { name: 'تكاليف', value: 20 },
          1: { name: 'نصفي', value: 30 },
          2: { name: 'نهائي', value: 50 },
        },
      }

  // Calculate telemetry metrics
  const telemetry = useMemo(() => {
    if (isEnriched && responseData.metrics) {
      return responseData.metrics
    }
    const totalStudents = rawGrades.length
    let sumScore = 0
    let maxScore = 0
    let passingCount = 0

    for (const g of rawGrades) {
      const s = Number(g.total ?? g.percent ?? 0)
      sumScore += s
      if (s > maxScore) maxScore = s
      if (s >= 60) passingCount++
    }

    const averageScore = totalStudents > 0 ? Math.round((sumScore / totalStudents) * 10) / 10 : 0
    const passingRate = totalStudents > 0 ? Math.round((passingCount / totalStudents) * 100) : 0

    return {
      totalStudents,
      averageScore,
      maxScore,
      passingCount,
      failingCount: totalStudents - passingCount,
      passingRate,
    }
  }, [isEnriched, responseData, rawGrades])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ gradeId, scores }) => {
      const payload = {}
      for (const k in scores) {
        payload[k] = {
          name: gradeSchema.grade?.[k]?.name || `بند ${k}`,
          value: Number(scores[k]) || 0,
        }
      }
      const res = await customFetch.patch(`/grades/${gradeId}`, { grade: payload })
      return res.data
    },
    onSuccess: () => {
      notifications.show({
        title: 'تم تحديث الدرجة بنجاح',
        message: 'تم حفظ درجات الطالب وإعادة احتساب المجموع تلقائياً.',
        color: 'teal',
        icon: <IconCheck size={16} />,
      })
      queryClient.invalidateQueries({ queryKey: ['grades'] })
      setEditingGrade(null)
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.msg || 'تعذر حفظ الدرجة'
      notifications.show({
        title: 'خطأ في الحفظ',
        message: msg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
  })

  // Filtered grades
  const filteredGrades = useMemo(() => {
    return rawGrades.filter((g) => {
      const studentName = (
        g.student?.name ||
        `${g.student?.firstName || ''} ${g.student?.lastName || ''}`.trim()
      ).toLowerCase()
      const studentEmail = (g.student?.email || '').toLowerCase()
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch = !q || studentName.includes(q) || studentEmail.includes(q)

      const total = Number(g.total || 0)
      let matchesStatus = true
      if (statusFilter === 'passed') matchesStatus = total >= 60
      if (statusFilter === 'failed') matchesStatus = total > 0 && total < 60
      if (statusFilter === 'unrecorded') matchesStatus = total === 0

      return matchesSearch && matchesStatus
    })
  }, [rawGrades, searchQuery, statusFilter])

  // Open edit modal
  const handleOpenEdit = (gradeDoc) => {
    setEditingGrade(gradeDoc)
    const initial = {}
    if (gradeSchema.grade) {
      for (const k in gradeSchema.grade) {
        initial[k] = gradeDoc.grade?.[k]?.value ?? 0
      }
    }
    setFormScores(initial)
  }

  // Real-time score total in modal
  const modalTotal = useMemo(() => {
    let sum = 0
    for (const k in formScores) {
      sum += Number(formScores[k]) || 0
    }
    return sum
  }, [formScores])

  if (isLoading) {
    return (
      <Center py={80}>
        <Stack align="center" spacing="md">
          <Loader size="xl" color="brand" />
          <Text size="sm" color="dimmed">
            جاري تحميل سجل درجات المقرر والطلاب...
          </Text>
        </Stack>
      </Center>
    )
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="تعذر تحميل دفتر الدرجات"
        color="red"
        radius="md"
        my="xl"
      >
        {error.response?.data?.message || 'حدث خطأ أثناء جلب درجات هذا المقرر.'}
      </Alert>
    )
  }

  const assessmentKeys = gradeSchema.grade ? Object.keys(gradeSchema.grade) : []

  return (
    <>
      <PageHeader
        title={course?.name ? `دفتر درجات مقرر: ${course.name}` : 'دفتر درجات الطلاب'}
        description={`رصد وتقييم أداء الطلاب في المقرر الدراسي (${course?.code || 'رمز المقرر'}) ومتابعة نسب الإنجاز والتحصيل`}
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'المقررات', href: '/courses' },
          { title: course?.name || 'المقرر', href: `/courses/${courseId}` },
          { title: 'دفتر الدرجات' },
        ]}
        action={
          <Button
            component={Link}
            to={`/courses/${courseId}`}
            variant="default"
            radius="md"
            leftIcon={<IconArrowRight size={16} />}
          >
            العودة لصفحة المقرر
          </Button>
        }
      />

      {/* Telemetry Metric Cards */}
      <SimpleGrid
        cols={4}
        spacing="md"
        mb="xl"
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                إجمالي الطلاب المسجلين
              </Text>
              <Title order={2} mt={4}>
                {telemetry.totalStudents}
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="blue" variant="light">
              <IconUsers size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                متوسط درجات الدفعة
              </Text>
              <Title order={2} mt={4}>
                {telemetry.averageScore} / 100
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="teal" variant="light">
              <IconChartBar size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                أعلى درجة تم رصدها
              </Text>
              <Title order={2} mt={4}>
                {telemetry.maxScore}
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="yellow" variant="light">
              <IconTrophy size={24} />
            </ThemeIcon>
          </Group>
        </Paper>

        <Paper withBorder p="md" radius="lg" shadow="xs">
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700}>
                نسبة النجاح العامة
              </Text>
              <Title order={2} mt={4}>
                {telemetry.passingRate}%
              </Title>
            </div>
            <ThemeIcon size={46} radius="md" color="violet" variant="light">
              <IconPercentage size={24} />
            </ThemeIcon>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Toolbar: Search & Filter */}
      <Paper
        withBorder
        p="md"
        radius="lg"
        mb="lg"
        sx={{
          backgroundColor: isDark ? 'rgba(26, 27, 30, 0.65)' : theme.colors.gray[0],
        }}
      >
        <Group position="apart" align="center">
          <TextInput
            placeholder="البحث باسم الطالب أو البريد الإلكتروني..."
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            sx={{ flex: 1, minWidth: 260 }}
            radius="md"
          />

          <Select
            data={[
              { value: 'all', label: 'كافة الطلاب' },
              { value: 'passed', label: 'الناجحون (60 فأكثر)' },
              { value: 'failed', label: 'الراسبون (أقل من 60)' },
              { value: 'unrecorded', label: 'غير المرصود لهم (صفر)' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            radius="md"
            sx={{ width: 200 }}
          />
        </Group>
      </Paper>

      {/* Gradebook Table */}
      {filteredGrades.length === 0 ? (
        <EmptyState
          title="لا توجد سجلات درجات مطابقة"
          description={
            rawGrades.length === 0
              ? 'لم يتم تسجيل أي طلاب في هذا المقرر الدراسي بعد.'
              : 'لم يتم العثور على نتائج تطابق معايير البحث والتصفية المحددة.'
          }
        />
      ) : (
        <Paper
          withBorder
          radius="lg"
          sx={{
            overflow: 'hidden',
            backgroundColor: isDark ? 'rgba(26, 27, 30, 0.85)' : '#ffffff',
            borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          }}
        >
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <thead>
              <tr
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                }}
              >
                <th>الطالب</th>
                {assessmentKeys.map((k) => (
                  <th key={k} style={{ textAlign: 'center' }}>
                    {gradeSchema.grade[k].name}{' '}
                    <Text component="span" size="xs" color="dimmed">
                      (من {gradeSchema.grade[k].value})
                    </Text>
                  </th>
                ))}
                <th style={{ textAlign: 'center' }}>المجموع (100)</th>
                <th style={{ textAlign: 'center' }}>التقدير</th>
                <th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((g) => {
                const studentName =
                  g.student?.name ||
                  `${g.student?.firstName || ''} ${g.student?.lastName || ''}`.trim() ||
                  'طالب'
                const studentEmail = g.student?.email || '—'
                const total = Number(g.total || 0)
                const letter = getLetterGrade(total)

                return (
                  <tr key={g._id}>
                    <td>
                      <Group spacing="sm" noWrap>
                        <Avatar
                          src={g.student?.avatar}
                          radius="xl"
                          color="brand"
                          size="md"
                        >
                          {studentName.charAt(0)}
                        </Avatar>
                        <div>
                          <Text
                            size="sm"
                            weight={700}
                            sx={{ color: isDark ? '#ffffff' : '#0f172a' }}
                          >
                            {studentName}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {studentEmail}
                          </Text>
                        </div>
                      </Group>
                    </td>

                    {/* Dynamic Assessment Columns */}
                    {assessmentKeys.map((k) => {
                      const score = g.grade?.[k]?.value ?? 0
                      return (
                        <td key={k} style={{ textAlign: 'center' }}>
                          <Text weight={600} size="sm">
                            {score}
                          </Text>
                        </td>
                      )
                    })}

                    {/* Total Score */}
                    <td style={{ textAlign: 'center' }}>
                      <Badge
                        size="md"
                        color={total >= 60 ? 'teal' : 'red'}
                        variant={total >= 60 ? 'light' : 'filled'}
                      >
                        {total}
                      </Badge>
                    </td>

                    {/* Letter Grade */}
                    <td style={{ textAlign: 'center' }}>
                      <Badge
                        size="md"
                        color={letter.color}
                        variant={letter.variant}
                      >
                        {letter.grade} ({letter.label})
                      </Badge>
                    </td>

                    {/* Edit Action Button */}
                    <td style={{ textAlign: 'center' }}>
                      <Button
                        size="xs"
                        variant="light"
                        color="brand"
                        leftIcon={<IconEdit size={14} />}
                        onClick={() => handleOpenEdit(g)}
                      >
                        رصد الدرجات
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Paper>
      )}

      {/* Edit Student Grades Modal */}
      <Modal
        opened={Boolean(editingGrade)}
        onClose={() => setEditingGrade(null)}
        title={
          <Group spacing="xs">
            <ThemeIcon color="brand" variant="light" size="md" radius="md">
              <IconCertificate size={18} />
            </ThemeIcon>
            <Text weight={700} size="md">
              رصد وتعديل درجات الطالب
            </Text>
          </Group>
        }
        styles={{
          content: {
            backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
          },
          header: {
            backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
          },
        }}
      >
        {editingGrade && (
          <Stack spacing="md">
            <Paper p="sm" radius="md" withBorder bg={isDark ? 'rgba(0, 0, 0, 0.25)' : 'gray.0'}>
              <Group spacing="sm">
                <Avatar
                  src={editingGrade.student?.avatar}
                  radius="xl"
                  color="brand"
                  size="md"
                >
                  {(editingGrade.student?.name || 'ط').charAt(0)}
                </Avatar>
                <div>
                  <Text weight={700} size="sm">
                    {editingGrade.student?.name ||
                      `${editingGrade.student?.firstName || ''} ${editingGrade.student?.lastName || ''}`.trim()}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {editingGrade.student?.email}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Divider label="بنود التقييم الفصلي" labelPosition="center" />

            {/* Inputs for each assessment item */}
            {assessmentKeys.map((k) => {
              const maxVal = gradeSchema.grade?.[k]?.value || 100
              const label = gradeSchema.grade?.[k]?.name || `بند ${k}`

              return (
                <NumberInput
                  key={k}
                  label={`${label} (الحد الأقصى: ${maxVal})`}
                  placeholder={`أدخل درجة بين 0 و ${maxVal}`}
                  min={0}
                  max={maxVal}
                  value={formScores[k] ?? 0}
                  onChange={(val) =>
                    setFormScores((prev) => ({
                      ...prev,
                      [k]: val,
                    }))
                  }
                  required
                />
              )
            })}

            <Paper p="md" radius="md" withBorder bg={isDark ? 'dark.6' : 'gray.0'}>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed">
                    المجموع المحتسب:
                  </Text>
                  <Title order={3} color={modalTotal >= 60 ? 'teal' : 'red'}>
                    {modalTotal} / 100
                  </Title>
                </div>
                <Badge
                  size="lg"
                  color={getLetterGrade(modalTotal).color}
                  variant={getLetterGrade(modalTotal).variant}
                >
                  التقدير: {getLetterGrade(modalTotal).grade}
                </Badge>
              </Group>
            </Paper>

            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditingGrade(null)}>
                إلغاء
              </Button>
              <Button
                color="brand"
                loading={updateMutation.isLoading || updateMutation.isPending}
                onClick={() =>
                  updateMutation.mutate({
                    gradeId: editingGrade._id,
                    scores: formScores,
                  })
                }
              >
                حفظ الدرجات
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  )
}
