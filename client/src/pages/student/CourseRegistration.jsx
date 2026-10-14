import React, { useState } from 'react'
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
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconBook,
  IconClock,
  IconAlertCircle,
  IconCheck,
  IconPlus,
  IconTrash,
  IconCalendarTime,
  IconSchool,
  IconShieldLock,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { PageHeader, EmptyState } from '../../components/common'

export default function CourseRegistration() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('available')
  const [loadingCourseId, setLoadingCourseId] = useState(null)

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

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="تنبيه"
        color="red"
        radius="md"
        my="xl"
      >
        {error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'لا يتوفر فصل دراسي نشط حالياً للتسجيل.'}
      </Alert>
    )
  }

  const {
    semester,
    currentCreditHours = 0,
    minCreditHours = 12,
    maxCreditHours = 19,
    isAddDropOpen = true,
    courses = [],
  } = enrollmentResponse || {}

  const enrolledCourses = courses.filter((c) => c.isEnrolled)
  const availableCourses = courses.filter((c) => !c.isEnrolled)

  const progressPercentage = Math.min(
    Math.round((currentCreditHours / maxCreditHours) * 100),
    100
  )

  const getProgressColor = () => {
    if (currentCreditHours < minCreditHours) return 'orange'
    if (currentCreditHours > maxCreditHours) return 'red'
    return 'brand'
  }

  return (
    <>
      <PageHeader
        title="بوابة تسجيل المقررات والحذف والإضافة"
        description="تسجيل المقررات الدراسية وإدارتها وفق الساعات المعتمدة والمتطلبات السابقة"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'مقرراتي', href: '/courses' },
          { title: 'الحذف والإضافة' },
        ]}
      />

      {/* Credit Hours & Add/Drop Status Summary */}
      <Paper withBorder p="lg" radius="md" mb="xl" shadow="xs">
        <Group position="apart" mb="md">
          <Group spacing="sm">
            <IconCalendarTime size={24} color="#7c3aed" />
            <div>
              <Text weight={700} size="lg">
                {semester?.name || 'الفصل الدراسي الحالي'}
              </Text>
              <Text size="xs" color="dimmed">
                فترة الحذف والإضافة: {isAddDropOpen ? 'مفتوحة حالياً' : 'مغلقة'}
              </Text>
            </div>
          </Group>

          <Badge
            size="lg"
            variant="filled"
            color={isAddDropOpen ? 'teal' : 'gray'}
          >
            {isAddDropOpen ? 'فترة التسجيل نشطة' : 'فترة التسجيل مغلقة'}
          </Badge>
        </Group>

        <Divider my="sm" />

        <Stack spacing="xs">
          <Group position="apart">
            <Text size="sm" weight={600}>
              إجمالي الساعات المسجلة: {currentCreditHours} من {maxCreditHours} ساعة معتمدة
            </Text>
            <Badge
              variant="outline"
              color={
                currentCreditHours >= minCreditHours ? 'teal' : 'orange'
              }
            >
              الحد الأدنى: {minCreditHours} ساعات | الأقصى: {maxCreditHours} ساعات
            </Badge>
          </Group>

          <Progress
            value={progressPercentage}
            color={getProgressColor()}
            size="lg"
            radius="xl"
            striped={isAddDropOpen}
            animate={isAddDropOpen}
          />

          {currentCreditHours < minCreditHours && (
            <Text size="xs" color="orange" weight={500}>
              تنبيه: يجب تسجيل ما لا يقل عن {minCreditHours} ساعة معتمدة لتثبيت الفصل الدراسي.
            </Text>
          )}
        </Stack>
      </Paper>

      {/* Tabs: Available vs Enrolled Courses */}
      <Tabs value={activeTab} onTabChange={setActiveTab} radius="md" mb="xl">
        <Tabs.List>
          <Tabs.Tab value="available" icon={<IconBook size={16} />}>
            المقررات المتاحة للتسجيل ({availableCourses.length})
          </Tabs.Tab>
          <Tabs.Tab value="enrolled" icon={<IconCheck size={16} />}>
            المقررات المسجلة حالياً ({enrolledCourses.length})
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab 1: Available Courses */}
        <Tabs.Panel value="available" pt="lg">
          {availableCourses.length === 0 ? (
            <EmptyState
              title="لا توجد مقررات إضافية متاحة للتسجيل"
              description="لقد قمت بتسجيل كافة المقررات المتاحة للفصل الدراسي الحالي."
            />
          ) : (
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: 'md', cols: 2, spacing: 'md' },
                { maxWidth: 'xs', cols: 1, spacing: 'sm' },
              ]}
            >
              {availableCourses.map((course) => {
                const canAddCredits =
                  currentCreditHours + (course.creditHours || 3) <= maxCreditHours
                const isEligible = course.eligible && canAddCredits && isAddDropOpen
                const isLoadingThis =
                  loadingCourseId === course._id && registerMutation.isLoading

                return (
                  <Card
                    key={course._id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                  >
                    <Group position="apart" mb="xs">
                      <Badge color="brand" variant="light">
                        {course.creditHours || 3} ساعات معتمدة
                      </Badge>
                      <Badge
                        color={course.eligible ? 'teal' : 'red'}
                        variant="dot"
                      >
                        {course.eligible ? 'مؤهل للتسجيل' : 'متطلب غير مكتمل'}
                      </Badge>
                    </Group>

                    <Text weight={700} size="md" mb="xs" lineClamp={1}>
                      {course.name}
                    </Text>

                    {course.code && (
                      <Text size="xs" color="dimmed" mb="xs">
                        رمز المقرر: {course.code}
                      </Text>
                    )}

                    {/* Prerequisites Info */}
                    {course.missingPrerequisites &&
                      course.missingPrerequisites.length > 0 && (
                        <Alert
                          icon={<IconShieldLock size={14} />}
                          color="red"
                          variant="light"
                          py="xs"
                          px="sm"
                          mb="xs"
                        >
                          <Text size="xs" weight={600}>
                            يتطلب اجتياز:{' '}
                            {course.missingPrerequisites
                              .map((p) => p.name)
                              .join('، ')}
                          </Text>
                        </Alert>
                      )}

                    {!canAddCredits && (
                      <Text size="xs" color="red" mb="xs">
                        يتجاوز الحد الأقصى للساعات المعتمدة ({maxCreditHours} س)
                      </Text>
                    )}

                    <Button
                      fullWidth
                      variant="filled"
                      color="brand"
                      mt="md"
                      radius="md"
                      leftIcon={<IconPlus size={16} />}
                      loading={isLoadingThis}
                      disabled={!isEligible}
                      onClick={() => registerMutation.mutate(course._id)}
                    >
                      تسجيل في المقرر
                    </Button>
                  </Card>
                )
              })}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        {/* Tab 2: Enrolled Courses (Drop) */}
        <Tabs.Panel value="enrolled" pt="lg">
          {enrolledCourses.length === 0 ? (
            <EmptyState
              title="لم تقم بتسجيل أي مقررات بعد"
              description="يمكنك استعراض المقررات المتاحة في التبويب الآخر وتسجيل موادك الدراسية."
            />
          ) : (
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: 'md', cols: 2, spacing: 'md' },
                { maxWidth: 'xs', cols: 1, spacing: 'sm' },
              ]}
            >
              {enrolledCourses.map((course) => {
                const courseCredits = course.creditHours || 3
                const canDropCredits =
                  currentCreditHours - courseCredits >= minCreditHours
                const canDrop = isAddDropOpen && canDropCredits
                const isLoadingThis =
                  loadingCourseId === course._id && dropMutation.isLoading

                return (
                  <Card
                    key={course._id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                  >
                    <Group position="apart" mb="xs">
                      <Badge color="brand" variant="light">
                        {courseCredits} ساعات معتمدة
                      </Badge>
                      <Badge color="teal" variant="filled">
                        مسجل حالياً
                      </Badge>
                    </Group>

                    <Text weight={700} size="md" mb="xs" lineClamp={1}>
                      {course.name}
                    </Text>

                    {course.code && (
                      <Text size="xs" color="dimmed" mb="xs">
                        رمز المقرر: {course.code}
                      </Text>
                    )}

                    {!canDropCredits && (
                      <Text size="xs" color="orange" mb="xs">
                        لا يمكن حذف المقرر لأن الساعات ستصبح أقل من {minCreditHours} س
                      </Text>
                    )}

                    <Button
                      fullWidth
                      variant="light"
                      color="red"
                      mt="md"
                      radius="md"
                      leftIcon={<IconTrash size={16} />}
                      loading={isLoadingThis}
                      disabled={!canDrop}
                      onClick={() => dropMutation.mutate(course._id)}
                    >
                      حذف المقرر (Drop)
                    </Button>
                  </Card>
                )
              })}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  )
}
