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
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['admin', 'common'])
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
                  {t('courseBuilder.videoAvailable')}
                </Badge>
              ) : (
                <Badge size="xs" color="gray" variant="outline">
                  {t('courseBuilder.noVideo')}
                </Badge>
              )}
              {lesson.topic?.data ? (
                <Badge size="xs" color="blue" variant="light">
                  {t('courseBuilder.addText')}
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
                {t('courseBuilder.contentMenu')}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label sx={{ color: isDark ? theme.colors.dark[2] : undefined }}>
                {t('courseBuilder.manageContent')}
              </Menu.Label>
              <Menu.Item
                icon={<IconVideo size={14} />}
                onClick={() => setVideoModalOpen(true)}
              >
                {t('courseBuilder.uploadEditVideo')}
              </Menu.Item>
              <Menu.Item
                icon={<IconFileText size={14} />}
                onClick={() => setTextModalOpen(true)}
              >
                {t('courseBuilder.editTextContent')}
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
            <Tooltip label={t('courseBuilder.editLessonTooltip')}>
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
            <Tooltip label={t('courseBuilder.deleteLessonTooltip')}>
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
  const { t } = useTranslation(['admin', 'common'])

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
              {`${t('courseBuilder.sectionDefault', { index: idx + 1 })}: ${section.name}`}
            </Text>
            <Text size="xs" color="dimmed">
              {t('courseBuilder.lessonsCount', { count: section.lessons?.length || 0 })}
            </Text>
          </Box>
        </Group>

        <Group spacing="xs">
          <AddLesson sectionId={section._id} queryClient={queryClient}>
            <Tooltip label={t('courseBuilder.addLessonTooltip')}>
              <ActionIcon variant="light" color="blue" size="lg" radius="md">
                <IconPlus size={18} />
              </ActionIcon>
            </Tooltip>
          </AddLesson>

          <AddSection queryClient={queryClient} edit={true} section={section}>
            <Tooltip label={t('courseBuilder.editSectionTooltip')}>
              <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </AddSection>

          <DeleteSection queryClient={queryClient} sectionId={section._id}>
            <Tooltip label={t('courseBuilder.deleteSectionTooltip')}>
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
          {t('courseBuilder.noLessonsInSection')}
        </Text>
      )}
    </Paper>
  )
}
