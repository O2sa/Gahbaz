import React, { useState } from 'react'
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
  useMantineTheme,
  rem,
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

function LessonItem({ lesson, section, queryClient }) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [textModalOpen, setTextModalOpen] = useState(false)

  return (
    <Paper
      key={lesson._id}
      p="sm"
      radius="md"
      withBorder
      sx={{
        backgroundColor: isDark ? 'rgba(37, 38, 43, 0.85)' : '#ffffff',
        borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
        transition: 'all 150ms ease',
        '&:hover': {
          borderColor: isDark ? theme.colors.brand[6] : theme.colors.brand[3],
        },
      }}
    >
      <Group position="apart">
        <Group>
          <ThemeIcon size="md" radius="sm" color="gray" variant="light">
            <IconFileText size={16} />
          </ThemeIcon>
          <Box>
            <Text
              size="sm"
              weight={600}
              sx={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            >
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
          <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            styles={{
              dropdown: {
                backgroundColor: isDark ? '#1a1b1e' : '#ffffff',
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
              },
              item: {
                color: isDark ? theme.colors.dark[0] : undefined,
                '&:hover': {
                  backgroundColor: isDark ? theme.colors.dark[5] : undefined,
                },
              },
            }}
          >
            <Menu.Target>
              <Button
                variant="light"
                size="xs"
                rightIcon={<IconDotsVertical size={14} />}
              >
                المحتوى
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label sx={{ color: isDark ? theme.colors.dark[2] : undefined }}>
                إدارة محتوى الدرس
              </Menu.Label>
              <Menu.Item
                icon={<IconVideo size={14} />}
                onClick={() => setVideoModalOpen(true)}
              >
                رفع / تعديل الفيديو
              </Menu.Item>
              <Menu.Item
                icon={<IconFileText size={14} />}
                onClick={() => setTextModalOpen(true)}
              >
                تحرير المحتوى النصي
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Render modals OUTSIDE Menu so closing Menu does not unmount them */}
          <UploadVideo
            opened={videoModalOpen}
            onClose={() => setVideoModalOpen(false)}
            lesson={lesson}
            queryClient={queryClient}
            sectionId={section._id}
          />
          <AddTextContent
            opened={textModalOpen}
            onClose={() => setTextModalOpen(false)}
            lesson={lesson}
            queryClient={queryClient}
            sectionId={section._id}
          />

          <AddLesson
            sectionId={section._id}
            queryClient={queryClient}
            edit={true}
            lesson={lesson}
          >
            <Tooltip label="تعديل اسم الدرس">
              <ActionIcon variant="subtle" color="gray" radius="sm">
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
              <ActionIcon variant="subtle" color="red" radius="sm">
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </DeleteLesson>
        </Group>
      </Group>
    </Paper>
  )
}

export default function EditCourseSection({
  section,
  queryClient,
  idx,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <Paper
      p="md"
      radius="lg"
      withBorder
      sx={{
        backgroundColor: isDark ? 'rgba(26, 27, 30, 0.75)' : theme.colors.gray[0],
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
        boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      <Group position="apart" mb="sm">
        <Group>
          <ThemeIcon size="lg" radius="md" color="blue" variant="light">
            <IconFolder size={20} />
          </ThemeIcon>
          <Box>
            <Text weight={700} size="md" sx={{ color: isDark ? '#ffffff' : '#0f172a' }}>
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
              <ActionIcon variant="light" color="blue" size="lg" radius="md">
                <IconPlus size={18} />
              </ActionIcon>
            </Tooltip>
          </AddLesson>

          <AddSection queryClient={queryClient} edit={true} section={section}>
            <Tooltip label="تعديل اسم القسم">
              <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </AddSection>

          <DeleteSection queryClient={queryClient} sectionId={section._id}>
            <Tooltip label="حذف القسم">
              <ActionIcon variant="subtle" color="red" size="lg" radius="md">
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </DeleteSection>
        </Group>
      </Group>

      {section.lessons?.length > 0 ? (
        <Stack spacing="xs" pl="md">
          {section.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson._id || index}
              lesson={lesson}
              section={section}
              queryClient={queryClient}
            />
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
