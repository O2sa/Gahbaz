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
  IconDashboard,
  IconBook,
  IconCertificate,
  IconMessageDots,
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'

const SectionFour = () => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const roles = [
    {
      value: 'admin',
      label: 'إداريو النظام والجامعة',
      icon: IconShieldCheck,
      badge: 'إدارة متكاملة',
      title: 'تحكم شامل في البنية الأكاديمية والعمليات',
      desc: 'تمكّن لوحة تحكم المسؤول من إدارة شجرة الكليات، الفصول الدراسية، وصلاحيات المستخدمين، ومراقبة أداء الخوادم في الوقت الفعلي.',
      features: [
        'إدارة وتنسيق الكليات والأقسام والتخصصات الأكاديمية',
        'مراقبة فورية لأداء النظام (المعالج، الذاكرة، وحركة الشبكة)',
        'إدارة حسابات الطلاب وأعضاء هيئة التدريس والإداريين',
        'جدولة الفصول والخطط الدراسية بمرونة فائقة',
      ],
      cta: 'دخول المسؤولين',
      color: 'violet',
    },
    {
      value: 'teacher',
      label: 'أعضاء هيئة التدريس',
      icon: IconUserCheck,
      badge: 'تعليم تفاعلي',
      title: 'أدوات قوية لإعداد وتدريس المساقات الجامعية',
      desc: 'بيئة عمل تمكّن الأساتذة من بناء المقررات وتقسيمها إلى وحدات ودروس تفاعلية، ورصد الدرجات والتقييمات بكل سلاسة.',
      features: [
        'إنشاء وتحديث محتوى المقررات والوحدات والدروس',
        'رفع المحاضرات المرئية والملفات التعليمية المتنوعة',
        'رصد درجات الاختبارات والأنشطة في كشوفات منظمة',
        'التواصل المباشر مع طلاب المساق عبر غرف الدردشة',
      ],
      cta: 'دخول هيئة التدريس',
      color: 'blue',
    },
    {
      value: 'student',
      label: 'الطلاب والدارسون',
      icon: IconSchool,
      badge: 'تجربة طالب ذكية',
      title: 'مساحة رقمية محفزة للتعلم والمتابعة الأكاديمية',
      desc: 'يحصل الطالب على تجربة سلسة تمكنه من الوصول إلى محاضراته، متابعة واجباته، واستعراض درجاته أولاً بأول.',
      features: [
        'استعراض المحاضرات والدروس الرقمية في أي وقت ومن أي جهاز',
        'الاطلاع على كشوف الدرجات والمعدل الأكاديمي بشكل فوري',
        'المشاركة في النقاشات الأكاديمية مع المعلمين والزملاء',
        'واجهة مريحة تدعم الوضع الليلي والنهاري للمذاكرة',
      ],
      cta: 'بوابة الطلاب',
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
            الأدوار الأكاديمية
          </Text>
          <Title
            order={2}
            sx={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            مصمم خصيصاً لتلبية احتياجات جميع أطراف التعليم
          </Title>
          <Text color="dimmed" size="md" sx={{ maxWidth: 640 }}>
            تمنح جهبذ كلاً من الإداريين والأساتذة والطلاب تجربة مخصصة بأدوات متطورة تتناسب مع مسؤولياتهم
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
                          leftIcon={<IconArrowLeft size={16} />}
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
                        <Text weight={700} size="sm">تحكم مرن</Text>
                        <Text size="xs" color="dimmed">واجهة سهلة وسريعة</Text>
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
                        <Text weight={700} size="sm">محتوى رقمي</Text>
                        <Text size="xs" color="dimmed">تنظيم متسلسل للدروس</Text>
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
                        <Text weight={700} size="sm">رصد دقيق</Text>
                        <Text size="xs" color="dimmed">حساب فوري للمعدلات</Text>
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
                        <Text weight={700} size="sm">تواصل لحظي</Text>
                        <Text size="xs" color="dimmed">محادثات فورية آمنة</Text>
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
