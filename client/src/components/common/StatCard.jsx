import React from 'react'
import { Paper, Group, Text, ThemeIcon, Box } from '@mantine/core'
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'

export default function StatCard({
  title,
  value,
  icon: Icon,
  diff,
  description,
  color = 'brand',
}) {
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      sx={(theme) => ({
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.sm,
        },
      })}
    >
      <Group position="apart">
        <Text size="xs" color="dimmed" weight={700} transform="uppercase">
          {title}
        </Text>
        {Icon && (
          <ThemeIcon color={color} variant="light" size={38} radius="md">
            <Icon size={22} stroke={1.5} />
          </ThemeIcon>
        )}
      </Group>

      <Group align="flex-end" spacing="xs" mt={12}>
        <Text size="xl" weight={700}>
          {value}
        </Text>
        {diff !== undefined && (
          <Text
            color={diff > 0 ? 'teal' : 'red'}
            size="sm"
            weight={500}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <span>{diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        )}
      </Group>

      {description && (
        <Text size="xs" color="dimmed" mt={4}>
          {description}
        </Text>
      )}
    </Paper>
  )
}
