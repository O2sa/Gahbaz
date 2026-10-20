import React, { useState, useEffect } from 'react'
import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Group,
  Stack,
  Text,
  Progress,
  Paper,
  ActionIcon,
  useMantineTheme,
  rem,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconFileText,
  IconUpload,
  IconCheck,
  IconAlertCircle,
  IconTrash,
  IconPaperclip,
} from '@tabler/icons-react'
import customFetch from '../../utils/customFetch'
import { uploadMedia } from '../../utils/mediaUpload'

export default function AssignmentFormModal({
  opened,
  onClose,
  courseId,
  assignment = null,
  onSuccess,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const queryClient = useQueryClient()

  const isEditing = Boolean(assignment?._id)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [maxScore, setMaxScore] = useState(20)
  const [fileUrl, setFileUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Initialize or reset form when modal opens or assignment changes
  useEffect(() => {
    if (opened) {
      if (assignment) {
        setTitle(assignment.title || '')
        setDescription(assignment.description || '')
        // Format ISO date to YYYY-MM-DDTHH:mm for datetime-local input
        if (assignment.dueDate) {
          const d = new Date(assignment.dueDate)
          const pad = (n) => String(n).padStart(2, '0')
          const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
          setDueDate(localIso)
        } else {
          setDueDate('')
        }
        setMaxScore(assignment.maxScore || 20)
        setFileUrl(assignment.fileUrl || '')
      } else {
        setTitle('')
        setDescription('')
        // Default due date: 7 days from now at 23:59
        const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        future.setHours(23, 59, 0, 0)
        const pad = (n) => String(n).padStart(2, '0')
        const defaultDue = `${future.getFullYear()}-${pad(future.getMonth() + 1)}-${pad(future.getDate())}T${pad(future.getHours())}:${pad(future.getMinutes())}`
        setDueDate(defaultDue)
        setMaxScore(20)
        setFileUrl('')
      }
      setSelectedFile(null)
      setUploadProgress(0)
      setIsUploading(false)
    }
  }, [opened, assignment])

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        const res = await customFetch.patch(`/assignments/${assignment._id}`, payload)
        return res.data
      } else {
        const res = await customFetch.post(`/assignments/course/${courseId}`, payload)
        return res.data
      }
    },
    onSuccess: () => {
      notifications.show({
        title: isEditing ? 'تم تحديث التكليف' : 'تم إنشاء التكليف',
        message: isEditing
          ? 'تم حفظ تعديلات التكليف وموعد التسليم بنجاح.'
          : 'تم نشر التكليف الدراسي الجديد وإتاحته للطلاب بنجاح.',
        color: 'teal',
        icon: <IconCheck size={16} />,
      })
      queryClient.invalidateQueries({ queryKey: ['assignments', 'course', courseId] })
      if (onSuccess) onSuccess()
      onClose()
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'حدث خطأ أثناء حفظ التكليف.'
      notifications.show({
        title: 'تعذر الحفظ',
        message: msg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      })
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      notifications.show({
        title: 'حقل مطلوب',
        message: 'يرجى إدخال عنوان التكليف.',
        color: 'orange',
      })
      return
    }
    if (!dueDate) {
      notifications.show({
        title: 'حقل مطلوب',
        message: 'يرجى تحديد موعد وتاريخ الاستحقاق.',
        color: 'orange',
      })
      return
    }

    try {
      let finalFileUrl = fileUrl
      if (selectedFile) {
        setIsUploading(true)
        const uploadRes = await uploadMedia(selectedFile, {
          folder: 'assignments',
          onProgress: (pct) => setUploadProgress(pct),
        })
        finalFileUrl = uploadRes.url
        setIsUploading(false)
      }

      saveMutation.mutate({
        title: title.trim(),
        description: description.trim(),
        dueDate: new Date(dueDate).toISOString(),
        maxScore: Number(maxScore) || 20,
        fileUrl: finalFileUrl,
      })
    } catch (uploadErr) {
      setIsUploading(false)
      notifications.show({
        title: 'فشل رفع الملف',
        message: uploadErr.message || 'حدث خطأ أثناء رفع ملف التعليمات.',
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
          <IconFileText size={20} color={theme.colors.indigo[6]} />
          <Text weight={700} size="lg">
            {isEditing ? 'تعديل التكليف الدراسي' : 'إنشاء تكليف دراسي جديد'}
          </Text>
        </Group>
      }
      size="lg"
      radius="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <TextInput
            label="عنوان التكليف"
            placeholder="مثال: التكليف الأول - تحليل الخوارزميات"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="تفاصيل وتعليمات التكليف"
            placeholder="اكتب تعليمات وشروط حل التكليف هنا..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
          />

          <Group grow>
            <TextInput
              label="تاريخ ووقت الاستحقاق (Due Date)"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <NumberInput
              label="الدرجة العظمى (Max Score)"
              value={maxScore}
              onChange={(val) => setMaxScore(val)}
              min={1}
              max={1000}
              required
            />
          </Group>

          {/* Instruction Attachment */}
          <div>
            <Text size="sm" weight={500} mb={4}>
              ملف التعليمات أو نموذج الواجب (اختياري)
            </Text>

            {fileUrl && !selectedFile && (
              <Paper
                p="xs"
                withBorder
                radius="md"
                mb="xs"
                sx={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                }}
              >
                <Group position="apart">
                  <Group spacing="xs">
                    <IconPaperclip size={16} color={theme.colors.indigo[5]} />
                    <Text size="xs" truncate maw={300}>
                      {fileUrl}
                    </Text>
                  </Group>
                  <ActionIcon
                    color="red"
                    size="sm"
                    variant="subtle"
                    onClick={() => setFileUrl('')}
                    title="إزالة المرفق"
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              </Paper>
            )}

            <input
              type="file"
              id="assignment-instruction-file"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0])
                }
              }}
            />

            <Button
              variant="light"
              color="indigo"
              size="sm"
              leftIcon={<IconUpload size={16} />}
              onClick={() => document.getElementById('assignment-instruction-file').click()}
            >
              {selectedFile ? selectedFile.name : fileUrl ? 'استبدال الملف' : 'اختيار ملف مرفق'}
            </Button>

            {selectedFile && (
              <Text size="xs" color="dimmed" mt={4}>
                الملف المحدد: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Text>
            )}

            {isUploading && (
              <Stack spacing={4} mt="xs">
                <Text size="xs" color="indigo">
                  جارٍ رفع الملف عبر التخزين السحابي... ({uploadProgress}%)
                </Text>
                <Progress value={uploadProgress} size="sm" color="indigo" radius="xl" animated />
              </Stack>
            )}
          </div>

          <Group position="right" mt="lg">
            <Button variant="default" onClick={onClose} disabled={saveMutation.isLoading || isUploading}>
              إلغاء
            </Button>
            <Button
              type="submit"
              color="indigo"
              loading={saveMutation.isLoading || isUploading}
            >
              {isEditing ? 'حفظ التعديلات' : 'نشر التكليف'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
