import React from 'react'
import { Paper, Group, Text, ThemeIcon, Box, useMantineTheme, Badge } from '@mantine/core'
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'

export default function StatCard({
  title,
  value,
  icon,
  diff,
  description,
  color = 'brand',
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight

  const renderIcon = () => {
    if (!icon) return null
    if (React.isValidElement(icon)) {
      return (
        <ThemeIcon color={color} variant="light" size={42} radius="md">
          {icon}
        </ThemeIcon>
      )
    }
    const IconComponent = icon
    return (
      <ThemeIcon color={color} variant="light" size={42} radius="md">
        <IconComponent size={24} stroke={1.6} />
      </ThemeIcon>
    )
  }

  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      sx={{
        backgroundColor: isDark
          ? 'rgba(37, 38, 43, 0.75)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isDark
            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px rgba(30, 64, 175, 0.08)',
          borderColor: isDark ? theme.colors.brand[6] : theme.colors.brand[3],
        },
      }}
    >
      <Group position="apart" align="flex-start">
        <Box>
          <Text size="xs" color="dimmed" weight={700} sx={{ letterSpacing: '0.3px' }}>
            {title}
          </Text>
          <Group align="baseline" spacing="xs" mt={6}>
            <Text
              size="xl"
              weight={800}
              sx={{
                fontSize: 28,
                color: isDark ? '#ffffff' : '#0f172a',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Text>
            {diff !== undefined && (
              <Badge
                color={diff >= 0 ? 'teal' : 'red'}
                variant="light"
                size="sm"
                radius="sm"
                leftSection={<DiffIcon size={12} stroke={2.5} />}
              >
                {Math.abs(diff)}%
              </Badge>
            )}
          </Group>
        </Box>
        {renderIcon()}
      </Group>

      {description && (
        <Text size="xs" color="dimmed" mt={8} sx={{ lineHeight: 1.5 }}>
          {description}
        </Text>
      )}
    </Paper>
  )
}
