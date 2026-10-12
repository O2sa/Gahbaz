import React from 'react'
import { Box, Group, Title, Text, Breadcrumbs, Anchor } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconChevronLeft } from '@tabler/icons-react'

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  action,
}) {
  return (
    <Box mb="lg">
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<IconChevronLeft size={14} stroke={1.5} />}
          mb="xs"
        >
          {breadcrumbs.map((crumb, idx) =>
            crumb.href ? (
              <Anchor
                component={Link}
                to={crumb.href}
                key={idx}
                size="xs"
                color="dimmed"
              >
                {crumb.title}
              </Anchor>
            ) : (
              <Text key={idx} size="xs" color="dimmed" weight={500}>
                {crumb.title}
              </Text>
            )
          )}
        </Breadcrumbs>
      )}

      <Group position="apart" align="flex-start">
        <Box>
          <Title order={2} weight={700}>
            {title}
          </Title>
          {description && (
            <Text size="sm" color="dimmed" mt={4}>
              {description}
            </Text>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Group>
    </Box>
  )
}
