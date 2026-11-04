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
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation(['teacher', 'common', 'errors'])

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
        title: t('common:confirmModalTitle'),
        message: t('assignments.grading.saveSuccess'),
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
        t('assignments.grading.saveError')
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
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
    t('common:user')

  const isLate = submission.status === 'late'
  const submittedDate = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleString(i18n.language.startsWith('ar') ? 'ar-SA' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (grade === '' || grade === null) {
      notifications.show({
        title: t('common:confirmModalTitle'),
        message: t('assignments.grading.scorePlaceholder'),
        color: 'orange',
      })
      return
    }

    const numGrade = Number(grade)
    if (numGrade < 0 || numGrade > maxScore) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: `${numGrade} (0 - ${maxScore})`,
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
            {`${t('assignments.grading.modalTitle')}: ${studentName}`}
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
                  {t('assignments.grading.submittedDate')}
                </Text>
                <Group spacing={6}>
                  <IconClock size={14} color={isLate ? theme.colors.red[5] : theme.colors.teal[6]} />
                  <Text size="xs" weight={500}>
                    {submittedDate}
                  </Text>
                  {isLate ? (
                    <Badge color="red" size="sm" variant="light">
                      {t('assignments.grading.lateBadge')}
                    </Badge>
                  ) : (
                    <Badge color="teal" size="sm" variant="light">
                      {t('assignments.grading.onTimeBadge')}
                    </Badge>
                  )}
                </Group>
              </Group>

              {submission.fileUrl && (
                <Group position="apart">
                  <Text size="xs" color="dimmed">
                    {t('assignments.grading.attachment')}
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
                    {t('assignments.grading.downloadSolution')}
                  </Button>
                </Group>
              )}

              {submission.notes && (
                <div>
                  <Group spacing={4} mb={2}>
                    <IconNote size={14} color={theme.colors.gray[6]} />
                    <Text size="xs" weight={600} color="dimmed">
                      {t('assignments.grading.studentNotes')}
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
            label={t('assignments.grading.scoreLabel', { max: maxScore })}
            placeholder={`0 - ${maxScore}`}
            value={grade}
            onChange={(val) => setGrade(val)}
            min={0}
            max={maxScore}
            precision={1}
            step={0.5}
            required
          />

          {/* Feedback Input */}
          <Textarea
            label={t('assignments.grading.feedbackLabel')}
            placeholder={t('assignments.grading.feedbackPlaceholder')}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            minRows={3}
          />

          <Group position="right" mt="md">
            <Button variant="default" onClick={onClose} disabled={gradeMutation.isLoading}>
              {t('actions.cancel', { ns: 'common' })}
            </Button>
            <Button type="submit" color="indigo" loading={gradeMutation.isLoading}>
              {t('assignments.grading.saveGrade')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
