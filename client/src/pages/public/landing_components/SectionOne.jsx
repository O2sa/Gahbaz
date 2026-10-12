import React from 'react'
import {
  Text,
  Container,
  useMantineTheme,
  Title,
  SimpleGrid,
  Card,
  ThemeIcon,
  Stack,
  Box,
} from '@mantine/core'
import {
  IconBuildingSkyscraper,
  IconBook,
  IconCertificate,
  IconMessageDots,
} from '@tabler/icons-react'

const SectionOne = () => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const services = [
    {
      icon: IconBuildingSkyscraper,
      title: 'الهيكلة الأكاديمية الشاملة',
      desc: 'بناء وتنسيق الهيكل الجامعي من كليات وأقسام وتخصصات وفصول دراسية مع خطط أكاديمية مرنة.',
      gradient: { from: '#1e40af', to: '#3b82f6' },
    },
    {
      icon: IconBook,
      title: 'إدارة المساقات والمحاضرات',
      desc: 'تنظيم الوحدات الدراسية، رفع المحاضرات التفاعلية، وملفات الوسائط مع تجربة تصفح سريعة.',
      gradient: { from: '#2563eb', to: '#60a5fa' },
    },
    {
      icon: IconCertificate,
      title: 'رصد الدرجات وكشوف الطلاب',
      desc: 'نظام متقدم لرصد نتائج الاختبارات، تقييم الأنشطة، وتوليد كشوفات أكاديمية فورية ودقيقة.',
      gradient: { from: '#0284c7', to: '#38bdf8' },
    },
    {
      icon: IconMessageDots,
      title: 'التواصل الأكاديمي المباشر',
      desc: 'قاعات محادثة رقمية تفاعلية تجمع الأساتذة بطلابهم لتبادل المعرفة والاستفسارات لحظياً.',
      gradient: { from: '#4f46e5', to: '#818cf8' },
    },
  ]

  return (
    <section
      id="section-one"
      style={{
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Container size="lg">
        <Stack align="center" spacing="xs" mb={48} sx={{ textAlign: 'center' }}>
          <Text
            size="xs"
            weight={700}
            color="brand"
            sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            ركائز المنظومة
          </Text>
          <Title
            order={2}
            sx={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            حلول تعليمية متكاملة لبيئة أكاديمية ذكية
          </Title>
          <Text color="dimmed" size="md" sx={{ maxWidth: 600 }}>
            صُممت منصة جهبذ لتغطي كافة متطلبات المنظومة الجامعية بكفاءة عالية وأمان فائق
          </Text>
        </Stack>

        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 },
          ]}
          spacing="lg"
        >
          {services.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card
                key={idx}
                p="xl"
                radius="lg"
                sx={{
                  backgroundColor: isDark
                    ? 'rgba(37, 38, 43, 0.7)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${
                    isDark ? theme.colors.dark[4] : theme.colors.gray[2]
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: isDark
                      ? '0 12px 30px rgba(0, 0, 0, 0.5)'
                      : '0 12px 30px rgba(30, 64, 175, 0.12)',
                    borderColor: isDark ? theme.colors.brand[6] : theme.colors.brand[4],
                  },
                }}
              >
                <Box mb="md">
                  <ThemeIcon
                    size={52}
                    radius="md"
                    variant="gradient"
                    gradient={{ from: item.gradient.from, to: item.gradient.to, deg: 135 }}
                    sx={{
                      boxShadow: `0 4px 14px ${item.gradient.from}40`,
                    }}
                  >
                    <Icon size={28} stroke={1.7} />
                  </ThemeIcon>
                </Box>
                <Title
                  order={4}
                  mb="xs"
                  sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: isDark ? '#ffffff' : '#1e293b',
                  }}
                >
                  {item.title}
                </Title>
                <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
                  {item.desc}
                </Text>
              </Card>
            )
          })}
        </SimpleGrid>
      </Container>
    </section>
  )
}

export default SectionOne
