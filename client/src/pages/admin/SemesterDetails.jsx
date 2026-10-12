import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Box, Group, Paper, Stack, Text, Title, ActionIcon, ThemeIcon } from '@mantine/core'
import { IconBook, IconPencil } from '@tabler/icons-react'

export const SemesterDetails = ({ courses = [] }) => {
  return (
    <Paper p="lg" radius="md" withBorder>
      <Group position="apart" mb="md">
        <Group>
          <ThemeIcon size="lg" radius="md" color="brand">
            <IconBook size={20} />
          </ThemeIcon>
          <Title order={4}>دورات الفصل</Title>
        </Group>
      </Group>

      {courses.length === 0 ? (
        <Text color="dimmed" size="sm" py="md">
          لا توجد دورات مضافة لهذا الفصل حالياً.
        </Text>
      ) : (
        <Stack spacing="xs">
          {courses.map((item) => (
            <Paper
              key={item._id}
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
                  to={`/courses/${item._id}`}
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

                <ActionIcon
                  component={Link}
                  to={`/courses/${item._id}/edit`}
                  variant="subtle"
                  color="blue"
                  title="تعديل الدورة"
                >
                  <IconPencil size={18} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Paper>
  )
}

export default SemesterDetails
