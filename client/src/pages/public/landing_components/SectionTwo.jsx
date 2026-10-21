import React from 'react'
import {
  Title,
  Text,
  Container,
  Grid,
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
  IconCloudCheck,
  IconShieldLock,
  IconBolt,
  IconArrowLeft,
} from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'

const SectionTwo = () => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <section
      id="section-two"
      style={{
        paddingTop: 70,
        paddingBottom: 70,
        backgroundColor: isDark
          ? 'rgba(26, 27, 30, 0.4)'
          : 'rgba(241, 245, 249, 0.6)',
      }}
    >
      <Container size="lg">
        <Grid gutter={40} align="center">
          <Grid.Col sm={12} md={7}>
            <Stack spacing="md">
              <Text
                size="xs"
                weight={700}
                color="brand"
                sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                البنية السحابية
              </Text>
              <Title
                order={2}
                sx={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: isDark ? '#ffffff' : '#0f172a',
                }}
              >
                بنية تحتية سحابية موثوقة تلائم متطلبات الجامعات
              </Title>
              <Text color="dimmed" size="md" sx={{ lineHeight: 1.7 }}>
                يعمل نظام جهبذ على خوادم سحابية ذات كفاءة تشغيلية مستمرة، مما يتيح للكوادر التعليمية والطلاب الوصول إلى المساقات وقاعات المحاضرات وسجلات التقييم من أي جهاز وفي أي وقت.
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
                <List.Item>استجابة فورية وزمن تحميل سريع للمحتوى والدروس</List.Item>
                <List.Item>تأمين مشدد للبيانات الحساسة وحفظ نسخ احتياطية دورية</List.Item>
                <List.Item>إمكانية التوسع لاستيعاب آلاف الطلاب المتزامنين دون انقطاع</List.Item>
              </List>

              <Box pt="xs">
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  variant="gradient"
                  gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
                  size="md"
                  radius="md"
                  leftIcon={<IconArrowLeft size={18} />}
                  sx={{ fontWeight: 700 }}
                >
                  استكشف لوحة التحكم
                </Button>
              </Box>
            </Stack>
          </Grid.Col>

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
                  <ThemeIcon size={38} radius="md" color="blue" variant="light" mb="xs">
                    <IconCloudCheck size={22} />
                  </ThemeIcon>
                  <Text weight={700} size="sm">مزامنة سحابية لحظية</Text>
                  <Text size="xs" color="dimmed">تحديث فوري لبيانات الطلاب والحضور والدرجات.</Text>
                </Paper>

                <Paper
                  p="md"
                  radius="md"
                  sx={{
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                  }}
                >
                  <ThemeIcon size={38} radius="md" color="teal" variant="light" mb="xs">
                    <IconShieldLock size={22} />
                  </ThemeIcon>
                  <Text weight={700} size="sm">حماية البيانات والأمان</Text>
                  <Text size="xs" color="dimmed">صلاحيات وصول دقيقة مبنية على الأدوار الأكاديمية.</Text>
                </Paper>

                <Paper
                  p="md"
                  radius="md"
                  sx={{
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                  }}
                >
                  <ThemeIcon size={38} radius="md" color="indigo" variant="light" mb="xs">
                    <IconBolt size={22} />
                  </ThemeIcon>
                  <Text weight={700} size="sm">كفاءة تشغيلية مستمرة</Text>
                  <Text size="xs" color="dimmed">مراقبة حية للموارد وأداء الخوادم على مدار الساعة.</Text>
                </Paper>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  )
}

export default SectionTwo
