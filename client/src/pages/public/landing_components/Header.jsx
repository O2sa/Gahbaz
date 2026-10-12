import React, { useState } from 'react'
import {
  Header as MantineHeader,
  Container,
  Group,
  Button,
  Burger,
  Drawer,
  Text,
  ActionIcon,
  Box,
  useMantineTheme,
  Stack,
  Divider,
} from '@mantine/core'
import { IconSchool, IconArrowLeft, IconLogin } from '@tabler/icons-react'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  const [opened, setOpened] = useState(false)
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  const scrollTo = (id) => {
    setOpened(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <MantineHeader
      height={72}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: isDark
          ? 'rgba(26, 27, 30, 0.88)'
          : 'rgba(255, 255, 255, 0.88)',
        borderBottom: `1px solid ${
          isDark ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      }}
    >
      <Container size="xl" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Group spacing="xs" component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
          <ActionIcon
            size={40}
            radius="md"
            variant="gradient"
            gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
            sx={{
              boxShadow: isDark
                ? '0 0 16px rgba(59, 130, 246, 0.35)'
                : '0 4px 12px rgba(30, 64, 175, 0.25)',
            }}
          >
            <IconSchool size={24} color="white" />
          </ActionIcon>
          <Box>
            <Text
              weight={800}
              size="lg"
              sx={{
                lineHeight: 1.2,
                background: isDark
                  ? 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              منصة جَهْبَذ
            </Text>
            <Text size={10} color="dimmed" weight={600} sx={{ lineHeight: 1 }}>
              المنظومة الأكاديمية الذكية
            </Text>
          </Box>
        </Group>

        {/* Desktop Nav */}
        <Group spacing="xl" sx={{ '@media (max-width: 860px)': { display: 'none' } }}>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('about')} sx={{ fontWeight: 600 }}>
            عن المنصة
          </Button>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('section-one')} sx={{ fontWeight: 600 }}>
            الخدمات
          </Button>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('section-four')} sx={{ fontWeight: 600 }}>
            الميزات
          </Button>
          <Button variant="subtle" color="gray" onClick={() => scrollTo('section-five')} sx={{ fontWeight: 600 }}>
            الأسئلة الشائعة
          </Button>
        </Group>

        {/* CTA Buttons */}
        <Group spacing="sm" sx={{ '@media (max-width: 860px)': { display: 'none' } }}>
          <Button
            component={RouterLink}
            to="/login"
            variant="default"
            radius="md"
            leftIcon={<IconLogin size={16} />}
            sx={{ fontWeight: 600 }}
          >
            تسجيل الدخول
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="gradient"
            gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
            radius="md"
            leftIcon={<IconArrowLeft size={16} />}
            sx={{ fontWeight: 700 }}
          >
            إنشاء حساب
          </Button>
        </Group>

        {/* Mobile Burger */}
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          size="sm"
          sx={{ '@media (min-width: 861px)': { display: 'none' } }}
        />

        {/* Mobile Drawer */}
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          padding="lg"
          position="right"
          size="xs"
          title={
            <Group spacing="xs">
              <ActionIcon size={32} radius="md" variant="gradient" gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}>
                <IconSchool size={18} color="white" />
              </ActionIcon>
              <Text weight={700}>منصة جَهْبَذ</Text>
            </Group>
          }
        >
          <Stack spacing="md" mt="md">
            <Button variant="light" onClick={() => scrollTo('about')} fullWidth>
              عن المنصة
            </Button>
            <Button variant="light" onClick={() => scrollTo('section-one')} fullWidth>
              الخدمات
            </Button>
            <Button variant="light" onClick={() => scrollTo('section-four')} fullWidth>
              الميزات
            </Button>
            <Button variant="light" onClick={() => scrollTo('section-five')} fullWidth>
              الأسئلة الشائعة
            </Button>

            <Divider my="sm" />

            <Button component={RouterLink} to="/login" variant="default" fullWidth>
              تسجيل الدخول
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="gradient"
              gradient={{ from: '#1e40af', to: '#3b82f6', deg: 135 }}
              fullWidth
            >
              إنشاء حساب جديد
            </Button>
          </Stack>
        </Drawer>
      </Container>
    </MantineHeader>
  )
}

export default Header
