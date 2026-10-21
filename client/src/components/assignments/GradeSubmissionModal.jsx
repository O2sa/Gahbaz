import React, { useState, useEffect } from 'react'
import {
  Modal,
  NumberInput,
  Textarea,
  Button,
  Group,
  Stack,
  Text,
  Badge,
  Paper,
  Divider,
  Anchor,
  useMantineTheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconCheck,
  IconAlertCircle,
  IconDownload,
  IconClock,
  IconUser,
  IconNote,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'

export default function GradeSubmissionModal({
  opened,
  onClose,
  submission,
  maxScore = 100,
  onSuccess,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const queryClient = useQueryClient()

  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (opened && submission) {
      setGrade(submission.grade !== null && submission.grade !== undefined ? submission.grade : '')
      setFeedback(submission.feedback || '')
    }
  }, [opened, submission])

  const gradeMutation = useMutation({
    mutationFn: async ({ submissionId, gradeValue, feedbackValue }) => {
      const res = await customFetch.patch(`/assignments/submissions/${submissionId}/grade`, {
        grade: Number(gradeValue),
        feedback: feedbackValue?.trim() || '',
      })
      return res.data
    },
    onSuccess: () => {
      notifications.show({
        title: 'تم رصد الدرجة بنجاح',
        message: 'تم حفظ درجة الطالب وإرسال الملاحظات بنجاح.',
        color: 'teal',
        icon: <IconCheck size={16} />,
      })
      if (submission?.assignment) {
        queryClient.invalidateQueries({
          queryKey: ['assignments', submission.assignment, 'submissions'],
        })
      }
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      if (onSuccess) onSuccess()
      onClose()
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'حدث خطأ أثناء رصد الدرجة.'
      notifications.show({
        title: 'تعذر رصد الدرجة',
        message: msg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
  })

  if (!submission) return null

  const studentName =
    submission.student?.name ||
    `${submission.student?.firstName || ''} ${submission.student?.lastName || ''}`.trim() ||
    submission.student?.email ||
    'طالب غير محدد'

  const isLate = submission.status === 'late'
  const submittedDate = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString('ar-SA', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'غير متوفر'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (grade === '' || grade === null) {
      notifications.show({
        title: 'حقل مطلوب',
        message: 'يرجى إدخال درجة التقييم.',
        color: 'orange',
      })
      return
    }

    const numGrade = Number(grade)
    if (numGrade < 0 || numGrade > maxScore) {
      notifications.show({
        title: 'قيمة غير مقبولة',
        message: `يجب أن تكون الدرجة بين 0 و ${maxScore}.`,
        color: 'red',
      })
      return
    }

    gradeMutation.mutate({
      submissionId: submission._id,
      gradeValue: numGrade,
      feedbackValue: feedback,
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group spacing="xs">
          <IconUser size={20} color={theme.colors.indigo[6]} />
          <Text weight={700} size="md">
            تقييم تسليم الطالب: {studentName}
          </Text>
        </Group>
      }
      size="md"
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          {/* Submission Details Card */}
          <Paper
            p="sm"
            withBorder
            radius="md"
            sx={{
              backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
            }}
          >
            <Stack spacing="xs">
              <Group position="apart">
                <Text size="xs" color="dimmed">
                  تاريخ التسليم:
                </Text>
                <Group spacing={6}>
                  <IconClock size={14} color={isLate ? theme.colors.red[5] : theme.colors.teal[6]} />
                  <Text size="xs" weight={500}>
                    {submittedDate}
                  </Text>
                  {isLate ? (
                    <Badge color="red" size="sm" variant="light">
                      متأخر (Late)
                    </Badge>
                  ) : (
                    <Badge color="teal" size="sm" variant="light">
                      في الموعد
                    </Badge>
                  )}
                </Group>
              </Group>

              {submission.fileUrl && (
                <Group position="apart">
                  <Text size="xs" color="dimmed">
                    ملف الإجابة:
                  </Text>
                  <Button
                    component="a"
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    size="xs"
                    variant="light"
                    color="indigo"
                    leftIcon={<IconDownload size={14} />}
                  >
                    تحميل ملف الحل
                  </Button>
                </Group>
              )}

              {submission.notes && (
                <div>
                  <Group spacing={4} mb={2}>
                    <IconNote size={14} color={theme.colors.gray[6]} />
                    <Text size="xs" weight={600} color="dimmed">
                      ملاحظات الطالب:
                    </Text>
                  </Group>
                  <Text size="xs" sx={{ whiteSpace: 'pre-wrap' }}>
                    {submission.notes}
                  </Text>
                </div>
              )}
            </Stack>
          </Paper>

          <Divider />

          {/* Grade Input */}
          <NumberInput
            label={`الدرجة المستحقة (من أصل ${maxScore})`}
            placeholder={`0 - ${maxScore}`}
            value={grade}
            onChange={(val) => setGrade(val)}
            min={0}
            max={maxScore}
            precision={1}
            step={0.5}
            required
            description={`الحد الأقصى للتكليف هو ${maxScore} درجة`}
          />

          {/* Feedback Input */}
          <Textarea
            label="ملاحظات وتوجيهات الأستاذ للطالب"
            placeholder="اكتب تعليقاتك التوجيهية وتصويب الإجابات هنا..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            minRows={3}
          />

          <Group position="right" mt="md">
            <Button variant="default" onClick={onClose} disabled={gradeMutation.isLoading}>
              إلغاء
            </Button>
            <Button type="submit" color="indigo" loading={gradeMutation.isLoading}>
              حفظ واعتماد التقييم
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
