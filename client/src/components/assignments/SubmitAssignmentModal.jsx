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
  Badge,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconUpload,
  IconCheck,
  IconAlertCircle,
  IconClock,
  IconPaperclip,
  IconFileCheck,
} from '@tabler/icons-react'
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
        title: 'تم إرسال الحل بنجاح',
        message: isLate
          ? 'تم رفع الحل وتسجيله كـ (تسليم متأخر) بنجاح.'
          : 'تم رفع الحل وتسليمه بنجاح للأستاذ.',
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
        'حدث خطأ أثناء إرسال الحل.'
      notifications.show({
        title: 'تعذر إرسال الحل',
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
        title: 'ملف الحل مطلوب',
        message: 'يرجى اختيار ملف الحل الخاص بك أولاً.',
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
        title: 'فشل رفع الملف',
        message: uploadErr.message || 'حدث خطأ أثناء رفع ملف الإجابة.',
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
              تسليم إجابة: {assignment.title}
            </Text>
            <Text size="xs" color="dimmed">
              الدرجة العظمى: {assignment.maxScore} درجة
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
              title="تنبيه: تجاوز موعد الاستحقاق"
              color="orange"
              radius="md"
              variant="light"
            >
              انتهى الموعد المحدد للتسليم. يمكنك إرسال الحل الآن وسيتم توثيقه للأستاذ تحت وسم «تسليم متأخر (Late)».
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
                    لديك تسليم سابق مسجل
                  </Text>
                  <Text size="xs" color="dimmed">
                    تاريخ التسليم:{' '}
                    {new Date(existingSubmission.submittedAt).toLocaleString('ar-SA')}
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
                  استعراض الملف السابق
                </Button>
              </Group>
            </Paper>
          )}

          {/* File Picker Section */}
          <div>
            <Text size="sm" weight={600} mb={6}>
              ملف الحل (PDF, DOCX, ZIP, صور حتى 50MB):
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
                {selectedFile ? selectedFile.name : 'انقر لاختيار ملف الحل أو اسحبه هنا'}
              </Text>
              <Text size="xs" color="dimmed" mt={2}>
                {selectedFile
                  ? `الحجم: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : 'يدعم جميع الصيغ الأكاديمية الشائعة (PDF, ZIP, DOCX)'}
              </Text>
            </Paper>

            {isUploading && (
              <Stack spacing={4} mt="xs">
                <Text size="xs" color="indigo">
                  جارٍ رفع الملف... ({uploadProgress}%)
                </Text>
                <Progress value={uploadProgress} size="sm" color="indigo" radius="xl" animated />
              </Stack>
            )}
          </div>

          {/* Notes Textarea */}
          <Textarea
            label="ملاحظات موجهة للأستاذ (اختياري)"
            placeholder="أضف أي تفاصيل أو توضيحات تود مشاركتها مع أستاذ المقرر..."
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
              إلغاء
            </Button>
            <Button
              type="submit"
              color="indigo"
              loading={submitMutation.isLoading || isUploading}
            >
              {existingSubmission ? 'تأكيد إعادة التسليم' : 'تأكيد وإرسال الحل'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
