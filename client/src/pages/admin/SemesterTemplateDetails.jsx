import React, { useState } from 'react'
import {
  Paper,
  Button,
  Stack,
  Group,
  Text,
  Title,
  ActionIcon,
  Badge,
} from '@mantine/core'
import { IconTable, IconTrash, IconPlus, IconPencil } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useGetElements } from '../crud.js'

export default function SemesterTemplateDetails({ queryClient }) {
  const { id } = useParams()
  const [isOpen, setIsOpen] = useState(false)

  const { data: semsterTemp } = useQuery(
    useGetElements(['semesters/semester-template', id])
  )

  const [items, setItems] = useState([
    {
      name: 'Mathematics',
      subtitle: 'Advanced Calculus',
      kind: 'Management',
      id: '1',
    },
    {
      name: 'Physics',
      subtitle: 'Mechanics',
      kind: 'Basic Science',
      id: '2',
    },
  ])

  const handleDelete = (itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  return (
    <Stack spacing="md">
      <Paper p="md" withBorder radius="md">
        <Group position="apart">
          <Group spacing="sm">
            <IconTable size={24} color="#7c3aed" />
            <Title order={3}>{semsterTemp?.name || 'تفاصيل خطة الفصل الدراسي'}</Title>
          </Group>
          <ActionIcon color="brand" variant="light" size="lg">
            <IconPencil size={18} />
          </ActionIcon>
        </Group>
      </Paper>

      {items.map((item) => (
        <Paper key={item.id} p="md" withBorder radius="md">
          <Group position="apart">
            <Group spacing="sm">
              <IconTable size={20} color="#7c3aed" />
              <div>
                <Text weight={600}>{item.name}</Text>
                <Text size="xs" color="dimmed">
                  {item.subtitle}
                </Text>
              </div>
              <Badge color="violet" variant="light" size="xs">
                {item.kind}
              </Badge>
            </Group>

            <ActionIcon
              color="red"
              variant="light"
              onClick={() => handleDelete(item.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      ))}

      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        color="brand"
        leftIcon={<IconPlus size={16} />}
      >
        {isOpen ? 'إغلاق القائمة' : 'إضافة مادة إلى الخطة'}
      </Button>
    </Stack>
  )
}
