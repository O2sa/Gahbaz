import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  ActionIcon,
  Divider,
  MultiSelect,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPhoto, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useGetElements, useUpdateElement } from '../crud'
import UploadCourseCover from './UploadCourseCover'
import { useTeachers } from '../../hooks/useTeachers.js'
import customFetch from '../../utils/customFetch.js'

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(useGetElements(['courses', params.courseId]))
      return params.courseId
    } catch (error) {
      console.error(error?.response?.data?.msg)
      return null
    }
  }

export const EditCourseInfo = ({ queryClient }) => {
  const params = useParams()
  const courseId = params.courseId || params.id
  const { t } = useTranslation(['admin', 'common', 'errors'])

  const { data: course = {} } = useQuery({
    ...useGetElements(['courses', courseId]),
    enabled: Boolean(courseId),
  })

  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateElement(queryClient, [
    'courses',
    courseId,
  ])

  const { data: teachersRes } = useTeachers({ limit: 100 })
  const teacherOptions = (teachersRes?.data || []).map((tch) => ({
    value: tch._id || tch.id,
    label: `${tch.firstName || ''} ${tch.lastName || ''}`.trim() || tch.name || tch.email,
  }))

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await customFetch.get('/users/current-user').catch(() => customFetch.get('/users/showMe'))
      return res.data?.data || res.data?.user || res.data || {}
    },
    staleTime: 1000 * 60 * 5,
  })
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super-admin'

  const courseData = course?.data || course

  const [formData, setFormData] = useState({
    describtion: '',
    willLearn: [],
    requirements: [],
    teachers: [],
  })

  useEffect(() => {
    if (courseData && Object.keys(courseData).length > 0) {
      setFormData({
        describtion: courseData.description || courseData.describtion || '',
        willLearn: courseData.willLearn ? [...courseData.willLearn] : [],
        requirements: courseData.requirements ? [...courseData.requirements] : [],
        teachers: (courseData.teachers || []).map((tch) => (typeof tch === 'object' ? tch._id || tch.id : tch)),
      })
    }
  }, [course])

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]]
      updated[index] = value
      return { ...prev, [field]: updated }
    })
  }

  const handleAddArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const handleRemoveArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    try {
      await updateCourse({ ...formData, _id: courseId })
      notifications.show({
        title: t('common:confirmModalTitle'),
        message: t('courseBuilder.saveSuccess'),
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'حدث خطأ أثناء الحفظ' }),
        color: 'red',
      })
    }
  }

  return (
    <Paper p="xl" radius="md" withBorder m="md">
      <Title order={3} mb="lg">
        {t('courseBuilder.editCourseTitle')}
      </Title>

      <Stack spacing="lg">
        <Box>
          <Text weight={600} mb="xs">
            {t('courseBuilder.coverTitle')}
          </Text>
          <Group align="flex-start" spacing="md">
            <Box
              w={200}
              h={120}
              sx={{
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #dee2e6',
              }}
            >
              {course.cover ? (
                <Image src={course.cover} height={120} fit="cover" />
              ) : (
                <IconPhoto size={40} color="#adb5bd" />
              )}
            </Box>
            <Box>
              <Text size="sm" color="dimmed" mb="sm">
                {t('courseBuilder.coverDesc')}
              </Text>
              <UploadCourseCover queryClient={queryClient}>
                <Button variant="light" leftIcon={<IconUpload size={16} />}>
                  {t('courseBuilder.uploadCover')}
                </Button>
              </UploadCourseCover>
            </Box>
          </Group>
        </Box>

        <Divider />

        <Textarea
          label={t('courseBuilder.courseDesc')}
          placeholder={t('courseBuilder.courseDescPlaceholder')}
          minRows={4}
          value={formData.describtion}
          onChange={(e) => setFormData({ ...formData, describtion: e.target.value })}
        />

        <Divider />

        {isAdmin && (
          <>
            <Box>
              <Text weight={600} mb="xs">
                {t('courseBuilder.facultyTeachers')}
              </Text>
              <MultiSelect
                placeholder={t('courseBuilder.selectFaculty')}
                data={teacherOptions}
                value={formData.teachers}
                onChange={(val) => setFormData((prev) => ({ ...prev, teachers: val }))}
                searchable
                clearable
                nothingFound={t('courseBuilder.noFacultyFound')}
                description={t('courseBuilder.facultyDesc')}
              />
            </Box>
            <Divider />
          </>
        )}

        <Box>
          <Group position="apart" mb="sm">
            <Text weight={600}>{t('courseBuilder.whatYouLearn')}</Text>
            <Button
              size="xs"
              variant="subtle"
              leftIcon={<IconPlus size={14} />}
              onClick={() => handleAddArrayItem('willLearn')}
            >
              {t('courseBuilder.addOutcome')}
            </Button>
          </Group>
          <Stack spacing="xs">
            {formData.willLearn.map((item, idx) => (
              <Group key={idx} spacing="xs">
                <TextInput
                  sx={{ flex: 1 }}
                  placeholder={t('courseBuilder.outcomeItem', { index: idx + 1 })}
                  value={item}
                  onChange={(e) => handleArrayChange('willLearn', idx, e.target.value)}
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleRemoveArrayItem('willLearn', idx)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Group position="apart" mb="sm">
            <Text weight={600}>{t('courseBuilder.prerequisites')}</Text>
            <Button
              size="xs"
              variant="subtle"
              leftIcon={<IconPlus size={14} />}
              onClick={() => handleAddArrayItem('requirements')}
            >
              {t('courseBuilder.addPrerequisite')}
            </Button>
          </Group>
          <Stack spacing="xs">
            {formData.requirements.map((item, idx) => (
              <Group key={idx} spacing="xs">
                <TextInput
                  sx={{ flex: 1 }}
                  placeholder={t('courseBuilder.requirementItem', { index: idx + 1 })}
                  value={item}
                  onChange={(e) => handleArrayChange('requirements', idx, e.target.value)}
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleRemoveArrayItem('requirements', idx)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Group position="right">
          <Button onClick={handleSave} loading={isUpdating}>
            {t('courseBuilder.saveChanges')}
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}

export default EditCourseInfo
