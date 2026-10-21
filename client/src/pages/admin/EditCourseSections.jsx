import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Loader,
  useMantineTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import {
  useGetElements,
  useCreateElement,
  useUpdateElement,
  useDeleteElement,
} from '../crud'
import client from '../../api/client'
import EditCourseSection from './EditCourseSection'

export const EditCourseSections = ({ queryClient }) => {
  const params = useParams()
  const courseId = params.courseId || params.id
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: sections = [],
    isLoading,
  } = useQuery({
    ...useGetElements(['sections', courseId]),
    enabled: Boolean(courseId),
  })

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" color="brand" />
      </Center>
    )
  }

  return (
    <Box p="md">
      <Paper
        p="xl"
        radius="lg"
        withBorder
        sx={{
          backgroundColor: isDark ? 'rgba(26, 27, 30, 0.85)' : '#ffffff',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <Group position="apart" mb="lg">
          <Title order={3} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }}>
            أقسام ودروس الدورة
          </Title>
          <AddSection queryClient={queryClient}>
            <Button color="brand" leftIcon={<IconPlus size={16} />}>
              إضافة قسم جديد
            </Button>
          </AddSection>
        </Group>

        {sections.length > 0 ? (
          <Stack spacing="md">
            {sections.map((item, idx) => (
              <EditCourseSection
                key={item._id || idx}
                idx={idx}
                queryClient={queryClient}
                section={item}
              />
            ))}
          </Stack>
        ) : (
          <Paper
            p="xl"
            radius="md"
            withBorder
            sx={{
              textAlign: 'center',
              backgroundColor: isDark ? 'rgba(37, 38, 43, 0.6)' : theme.colors.gray[0],
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Text color="dimmed" size="md">
              لا توجد أقسام بعد. انقر على "إضافة قسم جديد" للبدء.
            </Text>
          </Paper>
        )}
      </Paper>
    </Box>
  )
}

export function AddSection({ children, queryClient, edit = false, section = {} }) {
  const { courseId } = useParams()
  const { mutateAsync: createSection, isPending: isCreating } = useCreateElement(
    queryClient,
    ['sections', courseId],
  )
  const { mutateAsync: updateSection, isPending: isUpdating } = useUpdateElement(
    queryClient,
    ['sections', courseId],
  )

  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: edit ? section.name || '' : '',
      course: courseId,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم القسم مطلوب' : null),
    },
  })

  const handleSubmit = async (values) => {
    try {
      if (!edit) {
        await createSection(values)
      } else {
        await updateSection({ ...values, _id: section._id })
      }
      close()
      form.reset()
      notifications.show({
        title: 'تم بنجاح',
        message: edit ? 'تم تعديل القسم بنجاح' : 'تم إنشاء القسم بنجاح',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: error?.response?.data?.msg || 'حدث خطأ أثناء حفظ القسم',
        color: 'red',
      })
    }
  }

  return (
    <>
      <Modal
        centered
        title={edit ? 'تعديل القسم' : 'إنشاء قسم جديد'}
        opened={opened}
        onClose={close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="اسم القسم"
            placeholder="مثال: مقدمة في علوم البيانات"
            {...form.getInputProps('name')}
          />
          <Group position="apart" mt="lg">
            <Button variant="default" onClick={close}>
              إلغاء
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {edit ? 'حفظ التعديل' : 'إنشاء القسم'}
            </Button>
          </Group>
        </form>
      </Modal>

      <div onClick={open} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {children}
      </div>
    </>
  )
}

export function DeleteSection({ children, sectionId, queryClient }) {
  const { courseId } = useParams()
  const { mutateAsync: deleteSection, isPending: isDeleting } = useDeleteElement(
    queryClient,
    ['sections', courseId],
  )

  const handleDelete = async () => {
    try {
      await deleteSection(sectionId)
      notifications.show({
        title: 'تم الحذف',
        message: 'تم حذف القسم بنجاح',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: error?.response?.data?.msg || 'فشل حذف القسم',
        color: 'red',
      })
    }
  }

  return (
    <div onClick={handleDelete} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  )
}

export function AddLesson({ children, sectionId, queryClient, edit = false, lesson = {} }) {
  const { courseId } = useParams()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: edit ? lesson.name || '' : '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الدرس مطلوب' : null),
    },
  })

  const handleSubmit = async (values) => {
    try {
      if (edit) {
        await client.patch(`sections/${sectionId}/lessons/${lesson._id}`, values)
      } else {
        await client.post(`sections/${sectionId}/lessons`, values)
      }

      if (queryClient) {
        queryClient.invalidateQueries(['sections', courseId])
      }
      close()
      form.reset()
      notifications.show({
        title: 'تم بنجاح',
        message: edit ? 'تم تعديل الدرس بنجاح' : 'تم إضافة الدرس بنجاح',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: error?.response?.data?.msg || 'فشل حفظ الدرس',
        color: 'red',
      })
    }
  }

  return (
    <>
      <Modal
        centered
        title={edit ? 'تعديل الدرس' : 'إضافة درس جديد'}
        opened={opened}
        onClose={close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="اسم الدرس"
            placeholder="مثال: الدرس الأول: المفاهيم الأساسية"
            {...form.getInputProps('name')}
          />
          <Group position="apart" mt="lg">
            <Button variant="default" onClick={close}>
              إلغاء
            </Button>
            <Button type="submit">
              {edit ? 'حفظ التعديل' : 'إضافة الدرس'}
            </Button>
          </Group>
        </form>
      </Modal>

      <div onClick={open} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {children}
      </div>
    </>
  )
}

export function DeleteLesson({ children, sectionId, queryClient, lessonId }) {
  const { courseId } = useParams()

  const handleDelete = async () => {
    try {
      await client.delete(`sections/${sectionId}/lessons/${lessonId}`)
      if (queryClient) {
        queryClient.invalidateQueries(['sections', courseId])
      }
      notifications.show({
        title: 'تم الحذف',
        message: 'تم حذف الدرس بنجاح',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: error?.response?.data?.msg || 'فشل حذف الدرس',
        color: 'red',
      })
    }
  }

  return (
    <div onClick={handleDelete} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  )
}

export default EditCourseSections
