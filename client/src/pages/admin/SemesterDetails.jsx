import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Box, Group, Paper, Stack, Text, Title, ActionIcon, ThemeIcon } from '@mantine/core'
import { IconBook, IconPencil } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useDashboardContext } from '../../layouts/MainLayout.jsx'

export const SemesterDetails = ({ courses = [] }) => {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { user } = useDashboardContext()
  const role = user?.role || user?.__t
  const userId = (user?._id || user?.id || user?.userId || '').toString()
  const isSuperAdmin = role === 'super-admin'
  const isAdmin = role === 'admin' || isSuperAdmin

  return (
    <Paper p="lg" radius="md" withBorder>
      <Group position="apart" mb="md">
        <Group>
          <ThemeIcon size="lg" radius="md" color="brand">
            <IconBook size={20} />
          </ThemeIcon>
          <Title order={4}>{t('courses.title')}</Title>
        </Group>
      </Group>

      {courses.length === 0 ? (
        <Text color="dimmed" size="sm" py="md">
          {tCommon('table.noRecords')}
        </Text>
      ) : (
        <Stack spacing="xs">
          {courses.map((item) => {
            const courseId = item._id || item.id
            const isCourseTeacher =
              role === 'teacher' &&
              (item.teachers || []).some(
                (tItem) => (typeof tItem === 'object' ? tItem._id || tItem.id : tItem)?.toString() === userId
              )
            const canEdit = isAdmin || isCourseTeacher

            return (
              <Paper
                key={courseId}
                p="sm"
                radius="sm"
                withBorder
                sx={(theme) => ({
                  transition: 'background-color 150ms ease',
                  '&:hover': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
                  },
                })}
              >
                <Group position="apart">
                  <NavLink
                    to={`/courses/${courseId}`}
                    style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}
                  >
                    <Group>
                      <IconBook size={20} color="#228be6" />
                      <Box>
                        <Text weight={600} size="sm">
                          {item.name}
                        </Text>
                        {item.category && (
                          <Text size="xs" color="dimmed">
                            {item.category}
                          </Text>
                        )}
                      </Box>
                    </Group>
                  </NavLink>

                  {canEdit && (
                    <ActionIcon
                      component={Link}
                      to={`/courses/${courseId}/edit`}
                      variant="subtle"
                      color="blue"
                      title={t('courses.editCourse')}
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                  )}
                </Group>
              </Paper>
            )
          })}
        </Stack>
      )}
    </Paper>
  )
}

export default SemesterDetails
