import React from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core'
import {
  IconDotsVertical,
  IconEdit,
  IconFileText,
  IconFolder,
  IconPlus,
  IconTrash,
  IconVideo,
} from '@tabler/icons-react'
import {
  AddLesson,
  AddSection,
  DeleteLesson,
  DeleteSection,
} from './EditCourseSections'
import UploadVideo from './UploadVideo'
import AddTextContent from './AddTextContent'

export default function EditCourseSection({
  section,
  queryClient,
  idx,
}) {
  return (
    <Paper p="md" radius="md" withBorder bg="gray.0">
      <Group position="apart" mb="sm">
        <Group>
          <ThemeIcon size="lg" radius="md" color="blue" variant="light">
            <IconFolder size={20} />
          </ThemeIcon>
          <Box>
            <Text weight={700} size="md">
              {`القسم ${idx + 1}: ${section.name}`}
            </Text>
            <Text size="xs" color="dimmed">
              {`${section.lessons?.length || 0} دروس`}
            </Text>
          </Box>
        </Group>

        <Group spacing="xs">
          <AddLesson sectionId={section._id} queryClient={queryClient}>
            <Tooltip label="إضافة درس لهذا القسم">
              <ActionIcon variant="light" color="blue" size="lg">
                <IconPlus size={18} />
              </ActionIcon>
            </Tooltip>
          </AddLesson>

          <AddSection queryClient={queryClient} edit={true} section={section}>
            <Tooltip label="تعديل اسم القسم">
              <ActionIcon variant="subtle" color="gray" size="lg">
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </AddSection>

          <DeleteSection queryClient={queryClient} sectionId={section._id}>
            <Tooltip label="حذف القسم">
              <ActionIcon variant="subtle" color="red" size="lg">
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </DeleteSection>
        </Group>
      </Group>

      {section.lessons?.length > 0 ? (
        <Stack spacing="xs" pl="md">
          {section.lessons.map((lesson, index) => (
            <Paper key={lesson._id || index} p="sm" radius="sm" withBorder>
              <Group position="apart">
                <Group>
                  <ThemeIcon size="md" radius="sm" color="gray" variant="light">
                    <IconFileText size={16} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" weight={500}>
                      {lesson.name}
                    </Text>
                    <Group spacing="xs" mt={2}>
                      {lesson.video?.url ? (
                        <Badge size="xs" color="teal" variant="light">
                          فيديو متاح
                        </Badge>
                      ) : (
                        <Badge size="xs" color="gray" variant="outline">
                          لا يوجد فيديو
                        </Badge>
                      )}
                      {lesson.topic?.data ? (
                        <Badge size="xs" color="blue" variant="light">
                          محتوى نصي
                        </Badge>
                      ) : null}
                    </Group>
                  </Box>
                </Group>

                <Group spacing="xs">
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <Button variant="light" size="xs" rightIcon={<IconDotsVertical size={14} />}>
                        المحتوى
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>إدارة محتوى الدرس</Menu.Label>
                      <UploadVideo lesson={lesson} queryClient={queryClient} sectionId={section._id}>
                        <Menu.Item icon={<IconVideo size={14} />}>
                          رفع / تعديل الفيديو
                        </Menu.Item>
                      </UploadVideo>
                      <AddTextContent lesson={lesson} queryClient={queryClient} sectionId={section._id}>
                        <Menu.Item icon={<IconFileText size={14} />}>
                          تحرير المحتوى النصي
                        </Menu.Item>
                      </AddTextContent>
                    </Menu.Dropdown>
                  </Menu>

                  <AddLesson
                    sectionId={section._id}
                    queryClient={queryClient}
                    edit={true}
                    lesson={lesson}
                  >
                    <Tooltip label="تعديل اسم الدرس">
                      <ActionIcon variant="subtle" color="gray">
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </AddLesson>

                  <DeleteLesson
                    sectionId={section._id}
                    queryClient={queryClient}
                    lessonId={lesson._id}
                  >
                    <Tooltip label="حذف الدرس">
                      <ActionIcon variant="subtle" color="red">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </DeleteLesson>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Text color="dimmed" size="xs" py="xs" pl="md">
          لا توجد دروس في هذا القسم بعد
        </Text>
      )}
    </Paper>
  )
}
