import React from 'react'
import {
  Text,
  Container,
  Button,
  Title,
  Badge,
  Group,
  Stack,
  SimpleGrid,
  Paper,
  Box,
  useMantineTheme,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconLogin,
  IconUsers,
  IconBook,
  IconServer,
  IconDeviceMobile,
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'

const About = () => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const stats = [
    { icon: IconUsers, value: '+15,000', label: 'طالب وطالبة مسجلين' },
    { icon: IconBook, value: '+350', label: 'مقرر ومساق أكاديمي' },
    { icon: IconServer, value: '99.9%', label: 'جاهزية واستقرار سحابي' },
    { icon: IconDeviceMobile, value: '100%', label: 'توافق كامل مع الهواتف' },
  ]

  return (
    <section
      id="about"
      style={{
        paddingTop: 80,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container size="lg">
        <Stack align="center" spacing="xl" sx={{ textAlign: 'center' }}>
          {/* Top glowing badge */}
          <Badge
            size="lg"
            radius="xl"
            variant="gradient"
            gradient={{ from: '#1e40af', to: '#3b82f6', deg: 90 }}
            sx={{
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 700,
              boxShadow: isDark
                ? '0 0 20px rgba(59, 130, 246, 0.4)'
                : '0 4px 16px rgba(30, 64, 175, 0.2)',
            }}
          >
            ✨ المنظومة الأكاديمية الذكية الأولى
          </Badge>

          {/* Main Title */}
          <Title
            order={1}
            sx={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.25,
              maxWidth: 900,
              letterSpacing: '-0.5px',
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            منظومة رقمية رائدة لإدارة{' '}
            <Text
              component="span"
              inherit
              sx={{
                background: isDark
                  ? 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)'
                  : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              التعليم الجامعي
            </Text>{' '}
            بذكاء ومرونة
          </Title>

          {/* Subtitle */}
          <Text
            size="xl"
            color="dimmed"
            sx={{
              maxWidth: 720,
              lineHeight: 1.7,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 500,
            }}
          >
            منصة سحابية متكاملة تجمع إدارات الكليات، هيئة التدريس، والطلاب في فضاء تعليمي متطور يشمل إدارة المقررات، قاعات المحاضرات، رصد الدرجات، والتواصل الفوري.
          </Text>

          {/* Action Buttons */}
          <Group spacing="md" mt="sm">
            <Button
              component={RouterLink}
              to="/login"
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              leftIcon={<IconArrowLeft size={20} />}
              sx={{
                fontWeight: 700,
                padding: '0 28px',
                height: 52,
                boxShadow: isDark
                  ? '0 8px 24px rgba(59, 130, 246, 0.35)'
                  : '0 8px 24px rgba(30, 64, 175, 0.25)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              تجربة المنصة الآن
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              size="lg"
              radius="md"
              variant="default"
              leftIcon={<IconLogin size={20} />}
              sx={{
                fontWeight: 600,
                height: 52,
                padding: '0 24px',
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
                '&:hover': {
                  backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                },
              }}
            >
              بوابة تسجيل الدخول
            </Button>
          </Group>

          {/* Metric Stats Ribbon */}
          <Box mt={40} sx={{ width: '100%' }}>
            <SimpleGrid
              cols={4}
              breakpoints={[
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'xs', cols: 1 },
              ]}
              spacing="lg"
            >
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Paper
                    key={idx}
                    p="lg"
                    radius="md"
                    sx={{
                      backgroundColor: isDark
                        ? 'rgba(37, 38, 43, 0.6)'
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${
                        isDark ? theme.colors.dark[4] : theme.colors.gray[2]
                      }`,
                      textAlign: 'center',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: isDark ? theme.colors.brand[6] : theme.colors.brand[3],
                      },
                    }}
                  >
                    <Group position="center" mb={6}>
                      <Box
                        sx={{
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: isDark
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(30, 64, 175, 0.08)',
                          color: isDark ? '#93c5fd' : theme.colors.brand[7],
                        }}
                      >
                        <Icon size={24} stroke={1.6} />
                      </Box>
                    </Group>
                    <Text
                      weight={800}
                      size="xl"
                      sx={{
                        fontSize: 26,
                        color: isDark ? '#ffffff' : theme.colors.brand[9],
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text size="xs" color="dimmed" weight={600} mt={2}>
                      {stat.label}
                    </Text>
                  </Paper>
                )
              })}
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </section>
  )
}

export default About
