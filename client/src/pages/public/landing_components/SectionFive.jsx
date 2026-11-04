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
import { useTranslation } from 'react-i18next'

const SectionFive = () => {
  const { t } = useTranslation('landing')
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const faqs = [
    {
      value: 'colleges',
      icon: IconBuildingSkyscraper,
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      value: 'grades',
      icon: IconCertificate,
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      value: 'chat',
      icon: IconMessageDots,
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      value: 'devices',
      icon: IconDeviceMobile,
      question: t('faq.q4'),
      answer: t('faq.a4'),
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
            {t('faq.badge')}
          </Badge>
          <Title
            order={2}
            sx={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
              fontWeight: 800,
              color: isDark ? '#ffffff' : '#0f172a',
            }}
          >
            {t('faq.title')}
          </Title>
          <Text color="dimmed" size="md">
            {t('faq.subtitle')}
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