import React, { useState } from 'react'
import {
  useMantineTheme,
  Container,
  Text,
  Title,
  Card,
  Badge,
  Button,
  List,
  ThemeIcon,
  Tabs,
  Stack,
  SimpleGrid,
  Box,
  Grid
} from '@mantine/core'
import {
  IconCheck,
  IconShieldCheck,
  IconUserCheck,
  IconSchool,
  IconArrowLeft,
  IconArrowRight,
  IconDashboard,
  IconBook,
  IconCertificate,
  IconMessageDots,
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SectionFour = () => {
  const { t, i18n } = useTranslation('landing')
  const isRtl = i18n.dir() === 'rtl'
  const ForwardArrowIcon = isRtl ? IconArrowLeft : IconArrowRight

  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const roles = [
    {
      value: 'admin',
      label: t('roles.admin.label'),
      icon: IconShieldCheck,
      badge: t('roles.admin.badge'),
      title: t('roles.admin.title'),
      desc: t('roles.admin.desc'),
      features: [
        t('roles.admin.f1'),
        t('roles.admin.f2'),
        t('roles.admin.f3'),
        t('roles.admin.f4'),
      ],
      cta: t('roles.admin.cta'),
      color: 'violet',
    },
    {
      value: 'teacher',
      label: t('roles.teacher.label'),
      icon: IconUserCheck,
      badge: t('roles.teacher.badge'),
      title: t('roles.teacher.title'),
      desc: t('roles.teacher.desc'),
      features: [
        t('roles.teacher.f1'),
        t('roles.teacher.f2'),
        t('roles.teacher.f3'),
        t('roles.teacher.f4'),
      ],
      cta: t('roles.teacher.cta'),
      color: 'blue',
    },
    {
      value: 'student',
      label: t('roles.student.label'),
      icon: IconSchool,
      badge: t('roles.student.badge'),
      title: t('roles.student.title'),
      desc: t('roles.student.desc'),
      features: [
        t('roles.student.f1'),
        t('roles.student.f2'),
        t('roles.student.f3'),
        t('roles.student.f4'),
      ],
      cta: t('roles.student.cta'),
      color: 'teal',
    },
  ]

  return (
    <section
      id="section-four"
      style={{
        paddingTop: 80,
        paddingBottom: 80,
        backgroundColor: isDark
          ? 'rgba(26, 27, 30, 0.4)'
          : 'rgba(241, 245, 249, 0.6)',
      }}
    >
      <Container size="lg">
        <Stack align="center" spacing="xs" mb={40} sx={{ textAlign: 'center' }}>
          <Text
            size="xs"
            weight={700}
            color="brand"
            sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            {t('roles.tag')}
          </Text>
          <Title
            order={2}
            sx={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            {t('roles.title')}
          </Title>
          <Text color="dimmed" size="md" sx={{ maxWidth: 640 }}>
            {t('roles.subtitle')}
          </Text>
        </Stack>

        <Tabs defaultValue="admin" variant="pills" radius="md">
          <Tabs.List position="center" mb={30}>
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Tabs.Tab
                  key={role.value}
                  value={role.value}
                  icon={<Icon size={18} stroke={1.8} />}
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    padding: '10px 20px',
                  }}
                >
                  {role.label}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>

          {roles.map((role) => (
            <Tabs.Panel key={role.value} value={role.value}>
              <Card
                p="xl"
                radius="lg"
                sx={{
                  backgroundColor: isDark
                    ? 'rgba(37, 38, 43, 0.8)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${
                    isDark ? theme.colors.dark[4] : theme.colors.gray[2]
                  }`,
                  boxShadow: isDark
                    ? '0 16px 36px rgba(0, 0, 0, 0.4)'
                    : '0 16px 36px rgba(30, 64, 175, 0.08)',
                }}
              >
                <Grid gutter={30} align="center">
                  <Grid.Col sm={12} md={7}>
                    <Stack spacing="md">
                      <Badge size="md" color={role.color} variant="light" sx={{ alignSelf: 'flex-start' }}>
                        {role.badge}
                      </Badge>
                      <Title order={3} sx={{ fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
                        {role.title}
                      </Title>
                      <Text size="sm" color="dimmed" sx={{ lineHeight: 1.7 }}>
                        {role.desc}
                      </Text>

                      <List
                        spacing="sm"
                        size="sm"
                        icon={
                          <ThemeIcon size={20} radius="xl" color={role.color} variant="light">
                            <IconCheck size={12} stroke={2.5} />
                          </ThemeIcon>
                        }
                      >
                        {role.features.map((feat, i) => (
                          <List.Item key={i}>{feat}</List.Item>
                        ))}
                      </List>

                      <Box pt="xs">
                        <Button
                          component={RouterLink}
                          to="/login"
                          variant="filled"
                          color={role.color}
                          size="md"
                          radius="md"
                          leftIcon={<ForwardArrowIcon size={16} />}
                          sx={{ fontWeight: 700 }}
                        >
                          {role.cta}
                        </Button>
                      </Box>
                    </Stack>
                  </Grid.Col>

                  <Grid.Col sm={12} md={5}>
                    <SimpleGrid cols={2} spacing="md">
                      <Card
                        p="md"
                        radius="md"
                        sx={{
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                          textAlign: 'center',
                          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                        }}
                      >
                        <ThemeIcon size={40} radius="md" color={role.color} variant="light" mx="auto" mb="xs">
                          <IconDashboard size={20} />
                        </ThemeIcon>
                        <Text weight={700} size="sm">{t('roles.cardHighlights.c1Title')}</Text>
                        <Text size="xs" color="dimmed">{t('roles.cardHighlights.c1Desc')}</Text>
                      </Card>

                      <Card
                        p="md"
                        radius="md"
                        sx={{
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                          textAlign: 'center',
                          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                        }}
                      >
                        <ThemeIcon size={40} radius="md" color={role.color} variant="light" mx="auto" mb="xs">
                          <IconBook size={20} />
                        </ThemeIcon>
                        <Text weight={700} size="sm">{t('roles.cardHighlights.c2Title')}</Text>
                        <Text size="xs" color="dimmed">{t('roles.cardHighlights.c2Desc')}</Text>
                      </Card>

                      <Card
                        p="md"
                        radius="md"
                        sx={{
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                          textAlign: 'center',
                          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                        }}
                      >
                        <ThemeIcon size={40} radius="md" color={role.color} variant="light" mx="auto" mb="xs">
                          <IconCertificate size={20} />
                        </ThemeIcon>
                        <Text weight={700} size="sm">{t('roles.cardHighlights.c3Title')}</Text>
                        <Text size="xs" color="dimmed">{t('roles.cardHighlights.c3Desc')}</Text>
                      </Card>

                      <Card
                        p="md"
                        radius="md"
                        sx={{
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                          textAlign: 'center',
                          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                        }}
                      >
                        <ThemeIcon size={40} radius="md" color={role.color} variant="light" mx="auto" mb="xs">
                          <IconMessageDots size={20} />
                        </ThemeIcon>
                        <Text weight={700} size="sm">{t('roles.cardHighlights.c4Title')}</Text>
                        <Text size="xs" color="dimmed">{t('roles.cardHighlights.c4Desc')}</Text>
                      </Card>
                    </SimpleGrid>
                  </Grid.Col>
                </Grid>
              </Card>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>
    </section>
  )
}

export default SectionFour
