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
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'

const SectionThree = () => {
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
                  <Text weight={700} size="sm">الوضع الليلي والنهاري</Text>
                  <Text size="xs" color="dimmed">تبديل سلس ومريح للعين لتسهيل الدراسة والمطالعة ليلاً.</Text>
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
                  <Text weight={700} size="sm">تجاوب فائق مع الشاشات</Text>
                  <Text size="xs" color="dimmed">تصميم متكيف بدقة مع شاشات الحواسيب، الأجهزة اللوحية، والهواتف.</Text>
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
                  <Text weight={700} size="sm">طباعة عربية مريحة</Text>
                  <Text size="xs" color="dimmed">استخدام خط Cairo الأصيل مع مراعاة دقيقة لاتجاه القراءة العربي RTL.</Text>
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
                تجربة المستخدم
              </Text>
              <Title
                order={2}
                sx={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
              >
                واجهات عصرية صُممت لتسهيل التعلم والتدريس
              </Title>
              <Text color="dimmed" size="md" sx={{ lineHeight: 1.7 }}>
                نهتم بأدق التفاصيل البصرية والتفاعلية لنضمن ألا يقف التعقيد التقني عائقاً أمام التحصيل الأكاديمي. كل صفحة وأداة في النظام مصممة للوصول إليها بأقل عدد من النقرات.
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
                <List.Item>مؤشرات تقدم واضحة وكشوف درجات تفاعلية</List.Item>
                <List.Item>لوحة إشعارات وتنبيهات بأحدث المستجدات الأكاديمية</List.Item>
                <List.Item>فلاتر بحث سريعة لفرز المواد والمقررات والطلاب</List.Item>
              </List>

              <Box pt="xs">
                <Button
                  component={RouterLink}
                  to="/courses"
                  variant="outline"
                  size="md"
                  radius="md"
                  leftIcon={<IconArrowLeft size={18} />}
                  sx={{ fontWeight: 700 }}
                >
                  تصفح المساقات المتاحة
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