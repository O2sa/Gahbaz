import React, { useState, useMemo } from 'react'
import {
  Card,
  SimpleGrid,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Loader,
  Center,
  Progress,
  Alert,
  Tabs,
  Paper,
  Divider,
  ActionIcon,
  Tooltip,
  TextInput,
  Switch,
  Box,
  ThemeIcon,
  Avatar,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconBook,
  IconAlertCircle,
  IconCheck,
  IconPlus,
  IconTrash,
  IconCalendarTime,
  IconShieldLock,
  IconSearch,
  IconEye,
  IconFilter,
  IconArrowsExchange,
  IconUser,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { PageHeader, EmptyState } from '../../components/common'
import { CoursePreviewDrawer, ConfirmDropModal } from '../../components/enrollment'

export default function CourseRegistration() {
  const queryClient = useQueryClient()
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const [activeTab, setActiveTab] = useState('available')
  const [loadingCourseId, setLoadingCourseId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [eligibleOnly, setEligibleOnly] = useState(false)
  const [previewCourse, setPreviewCourse] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)

  // Fetch available courses and enrollment info
  const {
    data: enrollmentResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['enrollment', 'available-courses'],
    queryFn: async () => {
      const res = await customFetch.get('/enrollment/available-courses')
      return res.data?.data || res.data || {}
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (courseId) => {
      setLoadingCourseId(courseId)
      const res = await customFetch.post('/enrollment/register', { courseId })
      return res.data
    },
    onSuccess: () => {
      notifications.show({
        title: 'تم التسجيل بنجاح',
        message: 'تم تسجيل المقرر بنجاح وإضافتك لقناة المحادثة الدراسية.',
        color: 'teal',
        icon: <IconCheck size={16} />,
      })
      queryClient.invalidateQueries({ queryKey: ['enrollment'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: (err) => {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'حدث خطأ أثناء محاولة تسجيل المقرر.'
      notifications.show({
        title: 'تعذر التسجيل',
        message: errorMsg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
    onSettled: () => {
      setLoadingCourseId(null)
    },
  })

  // Drop mutation
  const dropMutation = useMutation({
    mutationFn: async (courseId) => {
      setLoadingCourseId(courseId)
      const res = await customFetch.post('/enrollment/drop', { courseId })
      return res.data
    },
    onSuccess: () => {
      notifications.show({
        title: 'تم حذف المقرر',
        message: 'تم حذف المقرر بنجاح وتحديث خطتك الدراسية.',
        color: 'orange',
        icon: <IconCheck size={16} />,
      })
      queryClient.invalidateQueries({ queryKey: ['enrollment'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: (err) => {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'حدث خطأ أثناء محاولة حذف المقرر.'
      notifications.show({
        title: 'تعذر الحذف',
        message: errorMsg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
    onSettled: () => {
      setLoadingCourseId(null)
    },
  })

  const {
    semester,
    currentCreditHours = 0,
    minCreditHours = 12,
    maxCreditHours = 19,
    isAddDropOpen = true,
    courses = [],
  } = enrollmentResponse || {}

  const enrolledCourses = useMemo(
    () => courses.filter((c) => c.isEnrolled),
    [courses]
  )

  const availableCourses = useMemo(
    () => courses.filter((c) => !c.isEnrolled),
    [courses]
  )

  // Filter available courses by search and eligibility
  const filteredAvailableCourses = useMemo(() => {
    return availableCourses.filter((course) => {
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        course.name?.toLowerCase().includes(query) ||
        course.code?.toLowerCase().includes(query) ||
        course.subtitle?.toLowerCase().includes(query)

      const canAddCredits =
        currentCreditHours + (course.creditHours || 3) <= maxCreditHours
      const isEligible = course.eligible && canAddCredits && isAddDropOpen

      if (eligibleOnly && !isEligible) {
        return false
      }

      return matchesSearch
    })
  }, [availableCourses, searchQuery, eligibleOnly, currentCreditHours, maxCreditHours, isAddDropOpen])

  // Filter enrolled courses by search
  const filteredEnrolledCourses = useMemo(() => {
    if (!searchQuery.trim()) return enrolledCourses
    const query = searchQuery.trim().toLowerCase()
    return enrolledCourses.filter(
      (course) =>
        course.name?.toLowerCase().includes(query) ||
        course.code?.toLowerCase().includes(query)
    )
  }, [enrolledCourses, searchQuery])

  if (isLoading) {
    return (
      <Center py={80}>
        <Stack align="center" spacing="md">
          <Loader size="xl" color="brand" />
          <Text size="sm" color="dimmed">
            جاري تحميل بيانات التسجيل والمقررات المتاحة...
          </Text>
        </Stack>
      </Center>
    )
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={18} />}
        title="تنبيه الأكاديميا"
        color="red"
        radius="md"
        my="xl"
      >
        {error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'لا يتوفر فصل دراسي نشط حالياً للتسجيل أو تعذر جلب المقررات.'}
      </Alert>
    )
  }

  const progressPercentage = Math.min(
    Math.round((currentCreditHours / maxCreditHours) * 100),
    100
  )

  const getProgressColor = () => {
    if (currentCreditHours < minCreditHours) return 'orange'
    if (currentCreditHours > maxCreditHours) return 'red'
    return 'teal'
  }

  return (
    <>
      <PageHeader
        title="بوابة تسجيل المقررات والحذف والإضافة"
        description="إدارة الخطة الدراسية الفردية للفصل الدراسي الحالي وفق الساعات المعتمدة والمتطلبات الأكاديمية"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'مقرراتي الدراسية', href: '/courses' },
          { title: 'الحذف والإضافة' },
        ]}
      />

      {/* Credit Hours & Add/Drop Status Summary Widget */}
      <Paper
        withBorder
        p="lg"
        radius="lg"
        mb="xl"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.85)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(30, 64, 175, 0.04)',
        }}
      >
        <Group position="apart" mb="md" align="center">
          <Group spacing="sm">
            <ThemeIcon size={42} radius="md" color="brand" variant="light">
              <IconCalendarTime size={24} />
            </ThemeIcon>
            <Box>
              <Text weight={800} size="lg" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                {semester?.name || 'الفصل الدراسي النشط'}
              </Text>
              <Text size="xs" color="dimmed">
                فترة الحذف والإضافة:{' '}
                <Text component="span" weight={600} color={isAddDropOpen ? 'teal' : 'gray'}>
                  {isAddDropOpen ? 'مفتوحة حالياً' : 'مغلقة'}
                </Text>
                {semester?.addDropDeadline && (
                  <> (الموعد النهائي: {new Date(semester.addDropDeadline).toLocaleDateString('ar-SA')})</>
                )}
              </Text>
            </Box>
          </Group>

          <Badge
            size="lg"
            radius="md"
            variant="filled"
            color={isAddDropOpen ? 'teal' : 'gray'}
          >
            {isAddDropOpen ? 'فترة التسجيل نشطة' : 'فترة التسجيل مغلقة'}
          </Badge>
        </Group>

        <Divider my="sm" color={isDark ? 'dark.4' : 'gray.2'} />

        <Stack spacing="xs">
          <Group position="apart">
            <Text size="sm" weight={700} sx={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
              إجمالي الساعات المسجلة: {currentCreditHours} من {maxCreditHours} ساعة معتمدة
            </Text>
            <Badge
              variant="outline"
              color={currentCreditHours >= minCreditHours ? 'teal' : 'orange'}
            >
              الحد الأدنى: {minCreditHours} ساعات | الأقصى: {maxCreditHours} ساعات
            </Badge>
          </Group>

          <Progress
            value={progressPercentage}
            color={getProgressColor()}
            size="xl"
            radius="xl"
            striped={isAddDropOpen}
            animate={isAddDropOpen}
          />

          {currentCreditHours < minCreditHours && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="orange"
              variant="light"
              py="xs"
              px="sm"
              radius="md"
            >
              <Text size="xs" weight={600}>
                تنبيه: يجب تسجيل ما لا يقل عن {minCreditHours} ساعة معتمدة لاعتماد الفصل الدراسي بنجاح.
              </Text>
            </Alert>
          )}

          {currentCreditHours >= minCreditHours && currentCreditHours <= maxCreditHours && (
            <Text size="xs" color="teal" weight={600}>
              ✓ عبء الساعات المسجلة ضمن النطاق الأكاديمي المسموح ({minCreditHours} إلى {maxCreditHours} ساعة).
            </Text>
          )}
        </Stack>
      </Paper>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        radius="md"
        mb="xl"
        styles={{
          tab: {
            fontWeight: 700,
            fontSize: rem(14),
          },
        }}
      >
        <Tabs.List mb="lg">
          <Tabs.Tab
            value="available"
            icon={<IconBook size={18} />}
            rightSection={
              <Badge size="xs" variant="filled" color="brand">
                {availableCourses.length}
              </Badge>
            }
          >
            المقررات المتاحة للتسجيل
          </Tabs.Tab>
          <Tabs.Tab
            value="enrolled"
            icon={<IconCheck size={18} />}
            rightSection={
              <Badge size="xs" variant="filled" color="teal">
                {enrolledCourses.length}
              </Badge>
            }
          >
            المقررات المسجلة حالياً
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab 1: Available Courses */}
        <Tabs.Panel value="available">
          {/* Search & Filter Toolbar */}
          <Paper
            withBorder
            p="md"
            radius="md"
            mb="lg"
            sx={{
              backgroundColor: isDark ? 'rgba(26, 27, 30, 0.65)' : theme.colors.gray[0],
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Group position="apart" align="center">
              <TextInput
                placeholder="ابحث باسم المقرر أو الرمز مثل CS101..."
                icon={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                sx={{ flex: 1, minWidth: 260 }}
                radius="md"
              />

              <Group spacing="md">
                <Switch
                  label="المؤهل لها فقط"
                  checked={eligibleOnly}
                  onChange={(e) => setEligibleOnly(e.currentTarget.checked)}
                  color="teal"
                  size="sm"
                />
                <Text size="xs" color="dimmed">
                  عرض {filteredAvailableCourses.length} من أصل {availableCourses.length} مقرر
                </Text>
              </Group>
            </Group>
          </Paper>

          {filteredAvailableCourses.length === 0 ? (
            <EmptyState
              title="لا توجد مقررات مطابقة للبحث"
              description={
                eligibleOnly
                  ? 'لا توجد مقررات إضافية مؤهل للتسجيل فيها حالياً. تحقق من المتطلبات السابقة أو رصيد الساعات.'
                  : 'لم يتم العثور على مقررات مطابقة لكلمة البحث الحالية.'
              }
            />
          ) : (
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: 'lg', cols: 2, spacing: 'md' },
                { maxWidth: 'sm', cols: 1, spacing: 'sm' },
              ]}
            >
              {filteredAvailableCourses.map((course) => {
                const courseCredits = course.creditHours || 3
                const canAddCredits = currentCreditHours + courseCredits <= maxCreditHours
                const isEligible = course.eligible && canAddCredits && isAddDropOpen
                const isLoadingThis =
                  loadingCourseId === course._id && registerMutation.isLoading
                const teachers = Array.isArray(course.teachers) ? course.teachers : []

                return (
                  <Card
                    key={course._id}
                    shadow="sm"
                    padding="lg"
                    radius="lg"
                    withBorder
                    sx={{
                      backgroundColor: isDark ? 'rgba(26, 27, 30, 0.75)' : '#ffffff',
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 180ms ease, box-shadow 180ms ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: isDark
                          ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                          : '0 8px 24px rgba(30, 64, 175, 0.08)',
                      },
                    }}
                  >
                    <Group position="apart" mb="xs">
                      <Badge color="brand" variant="light" size="sm">
                        {courseCredits} ساعات معتمدة
                      </Badge>
                      <Badge
                        color={course.eligible ? 'teal' : 'red'}
                        variant="dot"
                        size="sm"
                      >
                        {course.eligible ? 'مؤهل للتسجيل' : 'متطلب غير مكتمل'}
                      </Badge>
                    </Group>

                    <Text
                      weight={800}
                      size="md"
                      mb={4}
                      lineClamp={1}
                      sx={{ color: isDark ? '#ffffff' : '#0f172a' }}
                    >
                      {course.name}
                    </Text>

                    {course.code && (
                      <Text size="xs" color="dimmed" mb="xs">
                        رمز المقرر: <strong>{course.code}</strong>
                      </Text>
                    )}

                    {/* Teacher info */}
                    {teachers.length > 0 && (
                      <Group spacing={6} mb="sm">
                        <IconUser size={14} color="#64748b" />
                        <Text size="xs" color="dimmed" lineClamp={1}>
                          {teachers
                            .map((t) =>
                              typeof t === 'object'
                                ? t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim()
                                : ''
                            )
                            .filter(Boolean)
                            .join('، ') || 'هيئة التدريس'}
                        </Text>
                      </Group>
                    )}

                    {/* Prerequisites Info */}
                    {course.missingPrerequisites && course.missingPrerequisites.length > 0 && (
                      <Alert
                        icon={<IconShieldLock size={14} />}
                        color="red"
                        variant="light"
                        py={6}
                        px="xs"
                        mb="xs"
                        radius="md"
                      >
                        <Text size="xs" weight={600}>
                          يتطلب اجتياز:{' '}
                          {course.missingPrerequisites.map((p) => p.name).join('، ')}
                        </Text>
                      </Alert>
                    )}

                    {!canAddCredits && (
                      <Text size="xs" color="red" mb="xs" weight={500}>
                        يتجاوز الحد الأقصى للساعات المعتمدة ({maxCreditHours} س)
                      </Text>
                    )}

                    <Box sx={{ marginTop: 'auto', paddingTop: rem(12) }}>
                      <Group spacing="xs" grow>
                        <Button
                          variant="light"
                          color="gray"
                          radius="md"
                          leftIcon={<IconEye size={15} />}
                          onClick={() => setPreviewCourse(course)}
                        >
                          التفاصيل
                        </Button>
                        <Button
                          variant="filled"
                          color="brand"
                          radius="md"
                          leftIcon={<IconPlus size={16} />}
                          loading={isLoadingThis}
                          disabled={!isEligible}
                          onClick={() => registerMutation.mutate(course._id)}
                        >
                          تسجيل
                        </Button>
                      </Group>
                    </Box>
                  </Card>
                )
              })}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        {/* Tab 2: Enrolled Courses */}
        <Tabs.Panel value="enrolled">
          {filteredEnrolledCourses.length === 0 ? (
            <EmptyState
              title={
                searchQuery
                  ? 'لا توجد نتائج مطابقة لبحثك في المقررات المسجلة'
                  : 'لم تقم بتسجيل أي مقررات بعد'
              }
              description={
                searchQuery
                  ? 'جرب البحث بكلمة أخرى أو مسح حقل البحث.'
                  : 'يمكنك استعراض المقررات المتاحة في التبويب الآخر وتسجيل موادك الدراسية.'
              }
            />
          ) : (
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: 'lg', cols: 2, spacing: 'md' },
                { maxWidth: 'sm', cols: 1, spacing: 'sm' },
              ]}
            >
              {filteredEnrolledCourses.map((course) => {
                const courseCredits = course.creditHours || 3
                const canDropCredits = currentCreditHours - courseCredits >= minCreditHours
                const canDrop = isAddDropOpen && canDropCredits
                const teachers = Array.isArray(course.teachers) ? course.teachers : []

                return (
                  <Card
                    key={course._id}
                    shadow="sm"
                    padding="lg"
                    radius="lg"
                    withBorder
                    sx={{
                      backgroundColor: isDark ? 'rgba(26, 27, 30, 0.75)' : '#ffffff',
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Group position="apart" mb="xs">
                      <Badge color="brand" variant="light" size="sm">
                        {courseCredits} ساعات معتمدة
                      </Badge>
                      <Badge color="teal" variant="filled" size="sm">
                        مسجل حالياً
                      </Badge>
                    </Group>

                    <Text
                      weight={800}
                      size="md"
                      mb={4}
                      lineClamp={1}
                      sx={{ color: isDark ? '#ffffff' : '#0f172a' }}
                    >
                      {course.name}
                    </Text>

                    {course.code && (
                      <Text size="xs" color="dimmed" mb="xs">
                        رمز المقرر: <strong>{course.code}</strong>
                      </Text>
                    )}

                    {teachers.length > 0 && (
                      <Group spacing={6} mb="sm">
                        <IconUser size={14} color="#64748b" />
                        <Text size="xs" color="dimmed" lineClamp={1}>
                          {teachers
                            .map((t) =>
                              typeof t === 'object'
                                ? t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim()
                                : ''
                            )
                            .filter(Boolean)
                            .join('، ') || 'هيئة التدريس'}
                        </Text>
                      </Group>
                    )}

                    {!canDropCredits && (
                      <Text size="xs" color="orange" mb="xs" weight={500}>
                        لا يمكن حذف المقرر لأن الساعات ستصبح أقل من {minCreditHours} س
                      </Text>
                    )}

                    <Box sx={{ marginTop: 'auto', paddingTop: rem(12) }}>
                      <Group spacing="xs" grow>
                        <Button
                          variant="light"
                          color="gray"
                          radius="md"
                          leftIcon={<IconEye size={15} />}
                          onClick={() => setPreviewCourse(course)}
                        >
                          التفاصيل
                        </Button>
                        <Button
                          variant="light"
                          color="red"
                          radius="md"
                          leftIcon={<IconTrash size={16} />}
                          disabled={!canDrop}
                          onClick={() => setDropTarget(course)}
                        >
                          حذف (Drop)
                        </Button>
                      </Group>
                    </Box>
                  </Card>
                )
              })}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Course Details Preview Drawer */}
      <CoursePreviewDrawer
        opened={Boolean(previewCourse)}
        onClose={() => setPreviewCourse(null)}
        course={previewCourse}
        onRegister={(id) => registerMutation.mutate(id)}
        isAddDropOpen={isAddDropOpen}
        canAddCredits={
          previewCourse
            ? currentCreditHours + (previewCourse.creditHours || 3) <= maxCreditHours
            : true
        }
        isLoading={registerMutation.isLoading || registerMutation.isPending}
      />

      {/* Confirm Drop Modal */}
      <ConfirmDropModal
        opened={Boolean(dropTarget)}
        onClose={() => setDropTarget(null)}
        onConfirm={() => {
          if (dropTarget) {
            dropMutation.mutate(dropTarget._id)
            setDropTarget(null)
          }
        }}
        course={dropTarget}
        currentCredits={currentCreditHours}
        minCredits={minCreditHours}
        isLoading={dropMutation.isLoading || dropMutation.isPending}
      />
    </>
  )
}
