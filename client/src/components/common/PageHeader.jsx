import React from 'react'
import {
  Box,
  Group,
  Title,
  Text,
  Breadcrumbs,
  Anchor,
  useMantineTheme,
} from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconChevronLeft, IconHome } from '@tabler/icons-react'

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
}) {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <Box mb="xl">
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<IconChevronLeft size={13} stroke={1.5} style={{ opacity: 0.5 }} />}
          mb="xs"
        >
          <Anchor component={Link} to="/" size="xs" color="dimmed" sx={{ display: 'flex', alignItems: 'center' }}>
            <IconHome size={14} style={{ marginRight: 4 }} />
          </Anchor>
          {breadcrumbs.map((crumb, idx) =>
            crumb.href ? (
              <Anchor
                component={Link}
                to={crumb.href}
                key={idx}
                size="xs"
                color="dimmed"
                sx={{
                  fontWeight: 500,
                  '&:hover': {
                    color: isDark ? theme.colors.brand[4] : theme.colors.brand[7],
                  },
                }}
              >
                {crumb.title}
              </Anchor>
            ) : (
              <Text key={idx} size="xs" color={isDark ? 'gray.4' : 'gray.7'} weight={600}>
                {crumb.title}
              </Text>
            )
          )}
        </Breadcrumbs>
      )}

      <Group position="apart" align="flex-start" sx={{ '@media (max-width: 600px)': { flexDirection: 'column', gap: 12 } }}>
        <Box>
          <Title
            order={2}
            sx={{
              fontWeight: 800,
              fontSize: 24,
              color: isDark ? '#ffffff' : '#0f172a',
              letterSpacing: '-0.3px',
            }}
          >
            {title}
          </Title>
          {description && (
            <Text size="sm" color="dimmed" mt={4} sx={{ maxWidth: 640, lineHeight: 1.6 }}>
              {description}
            </Text>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Group>
    </Box>
  )
}
