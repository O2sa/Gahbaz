import React from 'react'
import {
  Grid,
  Text,
  Container,
  Title,
  Button,
  Stack,
  List,
  ThemeIcon,
  Box,
  Paper,
  useMantineTheme,
} from '@mantine/core'
import {
  IconCheck,
  IconMoonStars,
  IconDeviceLaptop,
  IconSparkles,
  IconArrowLeft,
  IconArrowRight,
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SectionThree = () => {
  const { t, i18n } = useTranslation('landing')
  const isRtl = i18n.dir() === 'rtl'
  const ForwardArrowIcon = isRtl ? IconArrowLeft : IconArrowRight

  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <section
      id="section-three"
      style={{
        paddingTop: 70,
        paddingBottom: 70,
      }}
    >
      <Container size="lg">
        <Grid gutter={40} align="center">
          <Grid.Col sm={12} md={5}>
            <Paper
              p="xl"
              radius="lg"
              sx={{
                background: isDark
                  ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
                border: `1px solid ${
                  isDark ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
                boxShadow: isDark
                  ? '0 20px 40px rgba(0,0,0,0.5)'
                  : '0 20px 40px rgba(30, 64, 175, 0.08)',
              }}
            >
              <Stack spacing="lg">
                <Paper
                  p="md"
                  radius="md"
                  sx={{
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                  }}
                >
                  <ThemeIcon size={38} radius="md" color="indigo" variant="light" mb="xs">
                    <IconMoonStars size={22} />
                  </ThemeIcon>
                  <Text weight={700} size="sm">{t('experience.cards.themeTitle')}</Text>
                  <Text size="xs" color="dimmed">{t('experience.cards.themeDesc')}</Text>
                </Paper>

                <Paper
                  p="md"
                  radius="md"
                  sx={{
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                  }}
                >
                  <ThemeIcon size={38} radius="md" color="cyan" variant="light" mb="xs">
                    <IconDeviceLaptop size={22} />
                  </ThemeIcon>
                  <Text weight={700} size="sm">{t('experience.cards.responsiveTitle')}</Text>
                  <Text size="xs" color="dimmed">{t('experience.cards.responsiveDesc')}</Text>
                </Paper>

                <Paper
                  p="md"
                  radius="md"
                  sx={{
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                  }}
                >
                  <ThemeIcon size={38} radius="md" color="violet" variant="light" mb="xs">
                    <IconSparkles size={22} />
                  </ThemeIcon>
                  <Text weight={700} size="sm">{t('experience.cards.typographyTitle')}</Text>
                  <Text size="xs" color="dimmed">{t('experience.cards.typographyDesc')}</Text>
                </Paper>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col sm={12} md={7}>
            <Stack spacing="md">
              <Text
                size="xs"
                weight={700}
                color="brand"
                sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {t('experience.tag')}
              </Text>
              <Title
                order={2}
                sx={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
              >
                {t('experience.title')}
              </Title>
              <Text color="dimmed" size="md" sx={{ lineHeight: 1.7 }}>
                {t('experience.subtitle')}
              </Text>

              <List
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={22} radius="xl" color="brand" variant="light">
                    <IconCheck size={14} stroke={2.5} />
                  </ThemeIcon>
                }
              >
                <List.Item>{t('experience.bullet1')}</List.Item>
                <List.Item>{t('experience.bullet2')}</List.Item>
                <List.Item>{t('experience.bullet3')}</List.Item>
              </List>

              <Box pt="xs">
                <Button
                  component={RouterLink}
                  to="/courses"
                  variant="outline"
                  size="md"
                  radius="md"
                  leftIcon={<ForwardArrowIcon size={18} />}
                  sx={{ fontWeight: 700 }}
                >
                  {t('experience.cta')}
                </Button>
              </Box>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  )
}

export default SectionThree