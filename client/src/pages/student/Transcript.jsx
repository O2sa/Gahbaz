import React from 'react'
import {
  Paper,
  Text,
  Title,
  Group,
  Stack,
  Table,
  Badge,
  Button,
  Divider,
  Loader,
  Center,
  Alert,
  SimpleGrid,
  Box,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import {
  IconPrinter,
  IconCertificate,
  IconAlertCircle,
  IconSchool,
  IconAward,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { PageHeader, EmptyState } from '../../components/common'

export default function Transcript() {
  const {
    data: transcriptResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transcripts', 'my-transcript'],
    queryFn: async () => {
      const res = await customFetch.get('/transcripts/my-transcript')
      return res.data?.data || res.data || {}
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
          'تعذر تحميل السجل الأكاديمي حالياً.'}
      </Alert>
    )
  }

  const { student, summary, semesters = [] } = transcriptResponse || {}

  const handlePrint = () => {
    window.print()
  }

  const getStandingColor = (standing) => {
    if (standing === 'امتياز') return 'teal'
    if (standing === 'جيد جداً') return 'blue'
    if (standing === 'جيد') return 'cyan'
    return 'red'
  }

  return (
    <>
      {/* Hide on print */}
      <Box className="no-print">
        <PageHeader
          title="السجل الأكاديمي الرسمي"
          description="كشف الدرجات الأكاديمية الشامل والمعدل التراكمي الموزون بالساعات المعتمدة"
          breadcrumbs={[
            { title: 'الرئيسية', href: '/' },
            { title: 'الدرجات', href: '/grades' },
            { title: 'السجل الأكاديمي' },
          ]}
          action={
            <Button
              onClick={handlePrint}
              variant="filled"
              color="brand"
              radius="md"
              leftIcon={<IconPrinter size={16} />}
            >
              طباعة السجل الأكاديمي
            </Button>
          }
        />
      </Box>

      {/* Printable Transcript Document */}
      <Paper
        withBorder
        p="xl"
        radius="md"
        shadow="sm"
        className="printable-transcript"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#fff',
          '@media print': {
            border: 'none',
            boxShadow: 'none',
            padding: '0 !important',
            backgroundColor: '#fff !important',
            color: '#000 !important',
          },
        })}
      >
        {/* Official Header */}
        <Group position="apart" align="flex-start" mb="lg">
          <Group spacing="md">
            <IconSchool size={40} color="#7c3aed" />
            <div>
              <Title order={2} weight={800}>
                {student?.university || 'جامعة جهبذ الإلكترونية'}
              </Title>
              <Text size="sm" color="dimmed">
                عمادة القبول والتسجيل والشؤون الأكاديمية
              </Text>
            </div>
          </Group>

          <Stack spacing={2} align="flex-end">
            <Badge size="lg" variant="outline" color="brand">
              سجل أكاديمي رسمي
            </Badge>
            <Text size="xs" color="dimmed">
              تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}
            </Text>
          </Stack>
        </Group>

        <Divider my="md" />

        {/* Student Information Grid */}
        <SimpleGrid
          cols={3}
          spacing="md"
          mb="lg"
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          <Box>
            <Text size="xs" color="dimmed">
              اسم الطالب:
            </Text>
            <Text weight={700} size="sm">
              {student?.name || '---'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              الكلية:
            </Text>
            <Text weight={600} size="sm">
              {student?.college || '---'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              التخصص:
            </Text>
            <Text weight={600} size="sm">
              {student?.major || '---'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              البريد الأكاديمي:
            </Text>
            <Text size="sm">{student?.email || '---'}</Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              الدرجة العلمية:
            </Text>
            <Text size="sm">بكالوريوس</Text>
          </Box>
          <Box>
            <Text size="xs" color="dimmed">
              الحالة الأكاديمية:
            </Text>
            <Badge color={getStandingColor(summary?.academicStanding)} variant="light">
              {summary?.academicStanding || 'جيد'}
            </Badge>
          </Box>
        </SimpleGrid>

        {/* Cumulative Summary Card */}
        <Paper
          withBorder
          p="md"
          radius="md"
          mb="xl"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          })}
        >
          <Group position="apart">
            <Group spacing="xl">
              <div>
                <Text size="xs" color="dimmed">
                  إجمالي الساعات المسجلة
                </Text>
                <Text weight={700} size="lg">
                  {summary?.totalCreditsAttempted || 0}
                </Text>
              </div>
              <div>
                <Text size="xs" color="dimmed">
                  إجمالي الساعات المجتازة
                </Text>
                <Text weight={700} size="lg" color="teal">
                  {summary?.totalCreditsEarned || 0}
                </Text>
              </div>
              <div>
                <Text size="xs" color="dimmed">
                  المعدل التراكمي (GPA)
                </Text>
                <Text weight={800} size="xl" color="brand">
                  {(summary?.cumulativeGPA ?? 0).toFixed(2)} / 4.00
                </Text>
              </div>
            </Group>

            <Group spacing="xs">
              <IconAward size={24} color="#7c3aed" />
              <div>
                <Text size="xs" color="dimmed">
                  التقدير العام
                </Text>
                <Text weight={700} size="md">
                  {summary?.academicStanding || '---'}
                </Text>
              </div>
            </Group>
          </Group>
        </Paper>

        {/* Semesters Records */}
        {semesters.length === 0 ? (
          <EmptyState
            title="لا توجد فصول دراسية مرصودة"
            description="لم يتم رصد نتائج فصول دراسية في سجلك الأكاديمي بعد."
          />
        ) : (
          <Stack spacing="xl">
            {semesters.map((sem, sIdx) => (
              <Box key={sem.semesterId || sIdx}>
                <Group position="apart" mb="xs">
                  <Text weight={700} size="md">
                    {sem.name || `الفصل الدراسي ${sIdx + 1}`}
                  </Text>
                  <Group spacing="md">
                    <Badge variant="dot" color="brand">
                      ساعات الفصل: {sem.creditsAttempted || 0} (مجتازة:{' '}
                      {sem.creditsEarned || 0})
                    </Badge>
                    <Badge variant="filled" color="brand">
                      معدل الفصل: {(sem.semesterGPA ?? 0).toFixed(2)}
                    </Badge>
                  </Group>
                </Group>

                <Table striped highlightOnHover withBorder withColumnBorders fontSize="xs">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>رمز المقرر</th>
                      <th style={{ width: '38%' }}>اسم المقرر</th>
                      <th style={{ width: '10%' }}>الساعات</th>
                      <th style={{ width: '10%' }}>الدرجة (%)</th>
                      <th style={{ width: '10%' }}>التقدير</th>
                      <th style={{ width: '10%' }}>نقاط التقدير</th>
                      <th style={{ width: '10%' }}>النقاط المكتسبة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses?.map((course, cIdx) => (
                      <tr key={course.courseId || cIdx}>
                        <td style={{ fontWeight: 600 }}>{course.code || '---'}</td>
                        <td>{course.name}</td>
                        <td style={{ textAlign: 'center' }}>{course.creditHours}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>
                          {course.numericGrade}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Badge
                            color={course.passed ? 'teal' : 'red'}
                            size="sm"
                            variant="light"
                          >
                            {course.letterGrade}
                          </Badge>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(course.gradePoints ?? 0).toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>
                          {(course.qualityPoints ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            ))}
          </Stack>
        )}

        {/* Verification & Stamp Footer (Visible on Print) */}
        <Box
          mt={50}
          pt="xl"
          sx={{
            display: 'none',
            '@media print': { display: 'block' },
          }}
        >
          <Group position="apart" align="flex-end">
            <Stack spacing={4} align="center">
              <Text size="xs" weight={600}>
                المسجل الأكاديمي
              </Text>
              <Text size="xs" color="dimmed">
                ............................
              </Text>
            </Stack>

            <Stack spacing={4} align="center">
              <Text size="xs" weight={600}>
                ختم عمادة القبول والتسجيل
              </Text>
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  border: '1px dashed #777',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text size="10px" color="dimmed">
                  الختم الرسمي
                </Text>
              </Box>
            </Stack>

            <Stack spacing={4} align="center">
              <Text size="xs" weight={600}>
                عميد الكلية
              </Text>
              <Text size="xs" color="dimmed">
                ............................
              </Text>
            </Stack>
          </Group>
        </Box>
      </Paper>
    </>
  )
}
