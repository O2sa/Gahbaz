import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Skeleton, Paper, Box, Group, Title, Text, useMantineTheme } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useGetElements } from '../crud'
import EditMajor from './EditMajor'

export default function AboutMajor({ queryClient }) {
  const params = useParams()
  const majorId = params.majorId || params.id
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'
  const { t } = useTranslation(['admin', 'common', 'nav'])

  const {
    data: major = null,
    isFetching,
    isLoading,
  } = useQuery({
    ...useGetElements(['majors', 'major', majorId]),
    enabled: Boolean(majorId),
  })

  const editCom = (
    <Button loading={isFetching} type="submit" variant="light" color="brand">
      {t('majors.editTitle')}
    </Button>
  )

  if (isFetching || isLoading) {
    return (
      <Paper withBorder radius="lg" p="xl">
        <Skeleton height={28} width="30%" mb="md" />
        <Skeleton height={14} radius="xl" mb="xs" />
        <Skeleton height={14} radius="xl" width="60%" />
      </Paper>
    )
  }

  return (
    <Box>
      <Helmet>
        <title>{`${t('platformTitle', { ns: 'nav', defaultValue: 'منصة جهبذ' })} | ${major?.name || t('majors.breadcrumb')}`}</title>
      </Helmet>

      <Paper
        withBorder
        radius="lg"
        p="xl"
        sx={{
          backgroundColor: isDark
            ? 'rgba(26, 27, 30, 0.75)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(30, 64, 175, 0.04)',
        }}
      >
        <Group position="apart" mb="lg">
          <Title order={3} sx={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 800 }}>
            {major?.name || t('majors.breadcrumb')}
          </Title>
          <EditMajor component={editCom} data={major} queryClient={queryClient} />
        </Group>

        <Text size="md" color={isDark ? 'gray.3' : 'gray.7'} sx={{ lineHeight: 1.8 }}>
          {major?.describtion || major?.description || t('common:emptyDescription')}
        </Text>
      </Paper>
    </Box>
  )
}
