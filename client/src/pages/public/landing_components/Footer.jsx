import React from 'react'
import {
  useMantineTheme,
  Container,
  Grid,
  Text,
  Group,
  ActionIcon,
  Box,
  Divider,
  Badge,
  Stack,
} from '@mantine/core'
import {
  IconSchool,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconCircleCheck,
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import customFetch from '../../../utils/customFetch.js'

const Footer = () => {
  const { t } = useTranslation('landing')
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const { data: authStatus } = useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      try {
        const res = await customFetch.get('/auth/status', {
          skipAuthRedirect: true,
          skipErrorNotification: true,
        })
        return res?.data || res
      } catch {
        return { registrationEnabled: true }
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const registrationEnabled = authStatus?.registrationEnabled !== false

  return (
    <footer
      style={{
        backgroundColor: isDark ? '#141517' : '#0f172a',
        color: '#ffffff',
        paddingTop: 64,
        paddingBottom: 32,
        borderTop: `1px solid ${isDark ? theme.colors.dark[5] : '#1e293b'}`,
      }}
    >
      <Container size="lg">
        <Grid gutter={40}>
          {/* Brand info */}
          <Grid.Col sm={12} md={5}>
            <Group spacing="xs" mb="sm">
              <ActionIcon
                size={38}
                radius="md"
                variant="gradient"
                gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              >
                <IconSchool size={22} color="white" />
              </ActionIcon>
              <Box>
                <Text weight={800} size="md" color="white">
                  {t('footer.brandTitle')}
                </Text>
                <Text size={10} color="dimmed">
                  {t('footer.brandSubtitle')}
                </Text>
              </Box>
            </Group>
            <Text size="sm" color="gray.4" sx={{ maxWidth: 360, lineHeight: 1.7 }} mb="md">
              {t('footer.brandDesc')}
            </Text>
            <Group spacing="xs">
              <Badge
                leftSection={<IconCircleCheck size={12} />}
                color="teal"
                variant="filled"
                size="sm"
              >
                {t('footer.uptimeBadge')}
              </Badge>
            </Group>
          </Grid.Col>

          {/* Platform Links */}
          <Grid.Col xs={6} sm={6} md={3}>
            <Text weight={700} size="sm" mb="md" color="white">
              {t('footer.platformLinks')}
            </Text>
            <Stack spacing="xs">
              <Text
                component={RouterLink}
                to="/courses"
                size="sm"
                color="gray.4"
                sx={{ textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
              >
                {t('footer.courses')}
              </Text>
              <Text
                component={RouterLink}
                to="/login"
                size="sm"
                color="gray.4"
                sx={{ textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
              >
                {t('footer.login')}
              </Text>
              {registrationEnabled && (
                <Text
                  component={RouterLink}
                  to="/register"
                  size="sm"
                  color="gray.4"
                  sx={{ textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
                >
                  {t('footer.register')}
                </Text>
              )}
            </Stack>
          </Grid.Col>

          {/* Contact / Developer */}
          <Grid.Col xs={6} sm={6} md={4}>
            <Text weight={700} size="sm" mb="md" color="white">
              {t('footer.contactTitle')}
            </Text>
            <Stack spacing="xs">
              <Group spacing="xs">
                <IconMail size={16} color="#94a3b8" />
                <Text size="sm" color="gray.4">
                  {t('footer.supportEmail')}
                </Text>
              </Group>
              <Text size="xs" color="gray.5" mt="xs">
                {t('footer.devTitle')}
              </Text>
              <Text size="sm" weight={600} color="gray.2">
                {t('footer.devName')}
              </Text>
              <Group spacing="sm" mt="xs">
                <ActionIcon
                  component="a"
                  href="https://github.com/o2sa"
                  target="_blank"
                  variant="subtle"
                  color="gray"
                  size="md"
                >
                  <IconBrandGithub size={18} color="white" />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="mailto:osama.f.mabkhot@gmail.com"
                  variant="subtle"
                  color="gray"
                  size="md"
                >
                  <IconMail size={18} color="white" />
                </ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="xl" color="#1e293b" />

        <Group position="apart" sx={{ '@media (max-width: 600px)': { flexDirection: 'column', gap: 10 } }}>
          <Text size="xs" color="gray.5">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </Text>
          <Text size="xs" color="gray.5">
            {t('footer.rights')}
          </Text>
        </Group>
      </Container>
    </footer>
  )
}

export default Footer