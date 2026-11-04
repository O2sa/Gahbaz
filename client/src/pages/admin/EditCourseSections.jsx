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
import { useTranslation } from 'react-i18next'
import {
  useGetElements,
  useCreateElement,
  useUpdateElement,
  useDeleteElement,
} from '../crud'
import client from '../../api/client'
import EditCourseSection from './EditCourseSection'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export const EditCourseSections = ({ queryClient }) => {
  const { user } = useDashboardContext()
  const role = user?.role || user?.__t
  const isFaculty = role === 'admin' || role === 'super-admin' || role === 'teacher'
  const { t } = useTranslation(['admin', 'common'])

  const params = useParams()
  const courseId = params.courseId || params.id
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const {
    data: rawSections = [],
    isLoading,
  } = useQuery({
    ...useGetElements(['sections', courseId]),
    enabled: Boolean(courseId),
  })

  const sections = Array.isArray(rawSections)
    ? rawSections
    : Array.isArray(rawSections?.data)
    ? rawSections.data
    : []

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
            {t('courseBuilder.sectionsTitle')}
          </Title>
          {isFaculty && (
            <AddSection queryClient={queryClient}>
              <Button color="brand" leftIcon={<IconPlus size={16} />}>
                {t('courseBuilder.addSection')}
              </Button>
            </AddSection>
          )}
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
              {t('courseBuilder.noSectionsText')}
            </Text>
          </Paper>
        )}
      </Paper>
    </Box>
  )
}

export function AddSection({ children, queryClient, edit = false, section = {} }) {
  const { courseId } = useParams()
  const { t } = useTranslation(['admin', 'common'])
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
      name: (val) => (!val?.trim() ? t('courseBuilder.sectionNamePlaceholder') : null),
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
        title: t('common:confirmModalTitle'),
        message: edit ? t('courseBuilder.saveSuccess') : t('common:createSuccess'),
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'حدث خطأ أثناء حفظ القسم' }),
        color: 'red',
      })
    }
  }

  return (
    <>
      <Modal
        centered
        title={edit ? t('courseBuilder.editSectionTitle') : t('courseBuilder.createSectionTitle')}
        opened={opened}
        onClose={close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label={t('courseBuilder.sectionName')}
            placeholder={t('courseBuilder.sectionNamePlaceholder')}
            {...form.getInputProps('name')}
          />
          <Group position="apart" mt="lg">
            <Button variant="default" onClick={close}>
              {t('actions.cancel', { ns: 'common' })}
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {edit ? t('courseBuilder.saveEdit') : t('courseBuilder.createSectionBtn')}
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
  const { t } = useTranslation(['admin', 'common', 'errors'])
  const { mutateAsync: deleteSection, isPending: isDeleting } = useDeleteElement(
    queryClient,
    ['sections', courseId],
  )

  const handleDelete = async () => {
    try {
      await deleteSection(sectionId)
      notifications.show({
        title: t('common:confirmModalTitle'),
        message: t('common:deleteSuccess'),
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'فشل حذف القسم' }),
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
  const { t } = useTranslation(['admin', 'common', 'errors'])
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: edit ? lesson.name || '' : '',
    },
    validate: {
      name: (val) => (!val?.trim() ? t('courseBuilder.lessonNamePlaceholder') : null),
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
        title: t('common:confirmModalTitle'),
        message: edit ? t('common:updateSuccess') : t('common:createSuccess'),
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'فشل حفظ الدرس' }),
        color: 'red',
      })
    }
  }

  return (
    <>
      <Modal
        centered
        title={edit ? t('courseBuilder.editLessonTitle') : t('courseBuilder.createLessonTitle')}
        opened={opened}
        onClose={close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label={t('courseBuilder.lessonName')}
            placeholder={t('courseBuilder.lessonNamePlaceholder')}
            {...form.getInputProps('name')}
          />
          <Group position="apart" mt="lg">
            <Button variant="default" onClick={close}>
              {t('actions.cancel', { ns: 'common' })}
            </Button>
            <Button type="submit">
              {edit ? t('courseBuilder.saveEdit') : t('courseBuilder.addLessonBtn')}
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
  const { t } = useTranslation(['admin', 'common', 'errors'])

  const handleDelete = async () => {
    try {
      await client.delete(`sections/${sectionId}/lessons/${lessonId}`)
      if (queryClient) {
        queryClient.invalidateQueries(['sections', courseId])
      }
      notifications.show({
        title: t('common:confirmModalTitle'),
        message: t('common:deleteSuccess'),
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'فشل حذف الدرس' }),
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
