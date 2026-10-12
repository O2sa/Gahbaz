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
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPhoto, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
import { useGetElements, useUpdateElement } from '../crud'
import UploadCourseCover from './UploadCourseCover'

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
  const { courseId } = useParams()

  const { data: course = {} } = useQuery(useGetElements(['courses', courseId]))

  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateElement(queryClient, [
    'courses',
    courseId,
  ])

  const [formData, setFormData] = useState({
    describtion: '',
    willLearn: [],
    requirements: [],
  })

  useEffect(() => {
    if (course) {
      setFormData({
        describtion: course.describtion || '',
        willLearn: course.willLearn ? [...course.willLearn] : [],
        requirements: course.requirements ? [...course.requirements] : [],
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
        title: 'تم الحفظ',
        message: 'تم تحديث بيانات الدورة بنجاح',
        color: 'green',
      })
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: error?.response?.data?.msg || 'حدث خطأ أثناء الحفظ',
        color: 'red',
      })
    }
  }

  return (
    <Paper p="xl" radius="md" withBorder m="md">
      <Title order={3} mb="lg">
        تعديل بيانات الدورة
      </Title>

      <Stack spacing="lg">
        <Box>
          <Text weight={600} mb="xs">
            غلاف الدورة
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
                قم برفع صورة تعبيرية ذات جودة عالية للدورة
              </Text>
              <UploadCourseCover queryClient={queryClient}>
                <Button variant="light" leftIcon={<IconUpload size={16} />}>
                  رفع صورة الغلاف
                </Button>
              </UploadCourseCover>
            </Box>
          </Group>
        </Box>

        <Divider />

        <Textarea
          label="وصف الدورة"
          placeholder="اكتب وصفاً مفصلاً للدورة..."
          minRows={4}
          value={formData.describtion}
          onChange={(e) => setFormData({ ...formData, describtion: e.target.value })}
        />

        <Divider />

        <Box>
          <Group position="apart" mb="sm">
            <Text weight={600}>ما الذي سيتعلمه الطالب في هذه الدورة؟</Text>
            <Button
              size="xs"
              variant="subtle"
              leftIcon={<IconPlus size={14} />}
              onClick={() => handleAddArrayItem('willLearn')}
            >
              إضافة مخرج تعلم
            </Button>
          </Group>
          <Stack spacing="xs">
            {formData.willLearn.map((item, idx) => (
              <Group key={idx} spacing="xs">
                <TextInput
                  sx={{ flex: 1 }}
                  placeholder={`مخرج التعلم ${idx + 1}`}
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
            <Text weight={600}>متطلبات الدورة</Text>
            <Button
              size="xs"
              variant="subtle"
              leftIcon={<IconPlus size={14} />}
              onClick={() => handleAddArrayItem('requirements')}
            >
              إضافة متطلب
            </Button>
          </Group>
          <Stack spacing="xs">
            {formData.requirements.map((item, idx) => (
              <Group key={idx} spacing="xs">
                <TextInput
                  sx={{ flex: 1 }}
                  placeholder={`المتطلب ${idx + 1}`}
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
            حفظ التغييرات
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}

export default EditCourseInfo
