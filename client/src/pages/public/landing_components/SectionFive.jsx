import React from 'react'
import {
  Accordion,
  Text,
  Container,
  Title,
  Badge,
  Stack,
  useMantineTheme,
  Paper,
} from '@mantine/core'
import {
  IconBuildingSkyscraper,
  IconCertificate,
  IconMessageDots,
  IconDeviceMobile,
} from '@tabler/icons-react'

const SectionFive = () => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const faqs = [
    {
      value: 'colleges',
      icon: IconBuildingSkyscraper,
      question: 'هل تتيح المنصة تنظيم كليات وأقسام متعددة تحت مظلة جامعية واحدة؟',
      answer:
        'نعم بكل تأكيد. تتيح جهبذ إنشاء وإدارة شجرة أكاديمية متكاملة تضم الكليات، الأقسام، التخصصات، وخطط الفصول الدراسية مع إسناد الصلاحيات بدقة عالية لكل قسم.',
    },
    {
      value: 'grades',
      icon: IconCertificate,
      question: 'كيف يتم رصد درجات الطلاب واحتساب المعدلات الأكاديمية؟',
      answer:
        'يرصد أعضاء هيئة التدريس الدرجات مباشرة عبر كشوف رقمية منظمة لكل مقرر دراسي، ويتم احتساب التقديرات والمعدلات الفردية تلقائياً وحفظها في قاعدة بيانات مشفرة.',
    },
    {
      value: 'chat',
      icon: IconMessageDots,
      question: 'هل تدعم المنصة التواصل المباشر بين الطلاب والأساتذة؟',
      answer:
        'نعم، تحتوي المنصة على نظام محادثات تفاعلية لحظية مدعومة بتقنية WebSockets، تتيح للطلاب التفاعل مع أساتذة المساقات وطرح الأسئلة واستلام الإشعارات بصورة فورية.',
    },
    {
      value: 'devices',
      icon: IconDeviceMobile,
      question: 'هل تعمل المنصة بسلاسة على الهواتف والأجهزة الذكية؟',
      answer:
        'نعم، صُممت كافة واجهات جهبذ لتكون متجاوبة 100% مع شاشات الهواتف المحمولة والأجهزة اللوحية، مع دعم أصيل للغة العربية والوضعين النهاري والليلي لراحة العين.',
    },
  ]

  return (
    <section
      id="section-five"
      style={{
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Container size="md">
        <Stack align="center" spacing="xs" mb={40} sx={{ textAlign: 'center' }}>
          <Badge
            size="md"
            radius="xl"
            variant="light"
            color="brand"
            sx={{ fontWeight: 700 }}
          >
            الأسئلة المتكررة
          </Badge>
          <Title
            order={2}
            sx={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            كل ما تود معرفته عن منصة جهبذ
          </Title>
          <Text color="dimmed" size="md">
            إجابات واضحة لأبرز التساؤلات المتعلقة بالنظام الأكاديمي وإدارته
          </Text>
        </Stack>

        <Accordion
          variant="separated"
          radius="md"
          styles={{
            item: {
              backgroundColor: isDark
                ? 'rgba(37, 38, 43, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${
                isDark ? theme.colors.dark[4] : theme.colors.gray[2]
              }`,
              marginBottom: 12,
            },
            control: {
              padding: '16px 20px',
              fontSize: 15,
              fontWeight: 700,
              '&:hover': {
                backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            },
            content: {
              padding: '0 20px 20px 20px',
              fontSize: 14,
              color: isDark ? theme.colors.gray[4] : theme.colors.gray[7],
              lineHeight: 1.7,
            },
          }}
        >
          {faqs.map((faq) => {
            const Icon = faq.icon
            return (
              <Accordion.Item key={faq.value} value={faq.value}>
                <Accordion.Control
                  icon={
                    <Icon
                      size={20}
                      color={isDark ? theme.colors.brand[4] : theme.colors.brand[7]}
                    />
                  }
                >
                  {faq.question}
                </Accordion.Control>
                <Accordion.Panel>{faq.answer}</Accordion.Panel>
              </Accordion.Item>
            )
          })}
        </Accordion>
      </Container>
    </section>
  )
}

export default SectionFive