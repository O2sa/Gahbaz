import React, { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  Progress,
  Paper,
  Alert,
  useMantineTheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconUpload,
  IconCheck,
  IconAlertCircle,
  IconClock,
  IconFileCheck,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import customFetch from '../../utils/customFetch'
import { uploadMedia } from '../../utils/mediaUpload'

export default function SubmitAssignmentModal({
  opened,
  onClose,
  assignment,
  existingSubmission = null,
  onSuccess,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation(['student', 'common', 'errors'])

  const [selectedFile, setSelectedFile] = useState(null)
  const [notes, setNotes] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const isLate = assignment?.dueDate && new Date() > new Date(assignment.dueDate)

  useEffect(() => {
    if (opened) {
      setSelectedFile(null)
      setNotes(existingSubmission?.notes || '')
      setUploadProgress(0)
      setIsUploading(false)
    }
  }, [opened, existingSubmission])

  const submitMutation = useMutation({
    mutationFn: async ({ fileUrl, studentNotes }) => {
      const res = await customFetch.post(`/assignments/${assignment._id}/submissions`, {
        fileUrl,
        notes: studentNotes,
      })
      return res.data
    },
    onSuccess: () => {
      notifications.show({
        title: t('common:confirmModalTitle'),
        message: isLate
          ? t('student:submissionModal.successLate')
          : t('student:submissionModal.success'),
        color: isLate ? 'orange' : 'teal',
        icon: <IconCheck size={16} />,
      })
      queryClient.invalidateQueries({
        queryKey: ['assignments', assignment._id, 'my-submission'],
      })
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      if (onSuccess) onSuccess()
      onClose()
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        t('errors:generic', { defaultValue: 'حدث خطأ أثناء إرسال الحل.' })
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: msg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
  })

  if (!assignment) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFile && !existingSubmission?.fileUrl) {
      notifications.show({
        title: t('common:confirmModalTitle'),
        message: t('student:submissionModal.fileRequired'),
        color: 'orange',
      })
      return
    }

    try {
      let finalFileUrl = existingSubmission?.fileUrl || ''

      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadMedia(selectedFile, {
          folder: 'assignments',
          onProgress: (pct) => setUploadProgress(pct),
        })
        finalFileUrl = uploadRes.url
        setIsUploading(false)
      }

      submitMutation.mutate({
        fileUrl: finalFileUrl,
        studentNotes: notes.trim(),
      })
    } catch (uploadErr) {
      setIsUploading(false)
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: uploadErr.message || t('errors:generic', { defaultValue: 'حدث خطأ أثناء رفع ملف الإجابة.' }),
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group spacing="xs">
          <IconFileCheck size={22} color={theme.colors.indigo[6]} />
          <div>
            <Text weight={700} size="md">
              {`${t('student:submissionModal.title')}: ${assignment.title}`}
            </Text>
            <Text size="xs" color="dimmed">
              {t('student:submissionModal.maxScoreLabel', { score: assignment.maxScore })}
            </Text>
          </div>
        </Group>
      }
      size="md"
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          {/* Late Alert Banner */}
          {isLate && (
            <Alert
              icon={<IconClock size={16} />}
              title={t('student:submissionModal.lateWarning')}
              color="orange"
              radius="md"
              variant="light"
            >
              {t('student:submissionModal.lateWarning')}
            </Alert>
          )}

          {/* Existing Submission Banner */}
          {existingSubmission && (
            <Paper
              p="xs"
              withBorder
              radius="md"
              sx={{
                backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
              }}
            >
              <Group position="apart">
                <div>
                  <Text size="xs" weight={600} color="indigo">
                    {t('student:submissionModal.existingSubmissionTitle')}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {`${t('student:submissionModal.dueDate')} ${new Date(existingSubmission.submittedAt).toLocaleString(i18n.language.startsWith('ar') ? 'ar-SA' : 'en-US')}`}
                  </Text>
                </div>
                <Button
                  component="a"
                  href={existingSubmission.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  size="xs"
                  variant="subtle"
                  color="indigo"
                >
                  {t('student:submissionModal.viewPreviousFile')}
                </Button>
              </Group>
            </Paper>
          )}

          {/* File Picker Section */}
          <div>
            <Text size="sm" weight={600} mb={6}>
              {t('student:submissionModal.fileLabel')}
            </Text>

            <input
              type="file"
              id="student-solution-file"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0])
                }
              }}
            />

            <Paper
              p="md"
              withBorder
              radius="md"
              ta="center"
              sx={{
                borderStyle: 'dashed',
                borderWidth: 2,
                cursor: 'pointer',
                borderColor: selectedFile
                  ? theme.colors.indigo[5]
                  : isDark
                  ? theme.colors.dark[4]
                  : theme.colors.gray[4],
                backgroundColor: isDark
                  ? theme.colors.dark[7]
                  : theme.colors.gray[0],
                '&:hover': {
                  borderColor: theme.colors.indigo[5],
                },
              }}
              onClick={() => document.getElementById('student-solution-file').click()}
            >
              <IconUpload
                size={32}
                color={selectedFile ? theme.colors.indigo[6] : theme.colors.gray[5]}
              />
              <Text size="sm" weight={600} mt={6}>
                {selectedFile ? selectedFile.name : t('student:submissionModal.dropzoneText')}
              </Text>
              <Text size="xs" color="dimmed" mt={2}>
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : t('student:submissionModal.dropzoneHint')}
              </Text>
            </Paper>

            {isUploading && (
              <Stack spacing={4} mt="xs">
                <Text size="xs" color="indigo">
                  {uploadProgress}%
                </Text>
                <Progress value={uploadProgress} size="sm" color="indigo" radius="xl" animated />
              </Stack>
            )}
          </div>

          {/* Notes Textarea */}
          <Textarea
            label={t('student:submissionModal.notesLabel')}
            placeholder={t('student:submissionModal.notesPlaceholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            minRows={2}
          />

          <Group position="right" mt="md">
            <Button
              variant="default"
              onClick={onClose}
              disabled={submitMutation.isLoading || isUploading}
            >
              {t('actions.cancel', { ns: 'common' })}
            </Button>
            <Button
              type="submit"
              color="indigo"
              loading={submitMutation.isLoading || isUploading}
            >
              {isLate
                ? t('student:submissionModal.submitLateButton')
                : t('student:submissionModal.submitButton')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
