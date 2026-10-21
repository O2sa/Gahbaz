import React from 'react'
import { Container, Title, Text, Button, Group, Center, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconHome, IconError404 } from '@tabler/icons-react'

export default function Page404() {
  return (
    <Container size="md" py={80}>
      <Center>
        <Stack align="center" spacing="md" sx={{ textAlign: 'center' }}>
          <Title
            sx={(theme) => ({
              fontSize: 100,
              fontWeight: 900,
              color: theme.colors.brand[6],
              lineHeight: 1,
            })}
          >
            404
          </Title>
          <Title order={2}>الصفحة المطلوبة غير موجودة</Title>
          <Text color="dimmed" size="lg" sx={{ maxWidth: 500 }}>
            ربما تم نقل الصفحة أو حذفها، أو أن الرابط الذي اتبعته غير صحيح.
          </Text>
          <Group position="center" mt="md">
            <Button
              component={Link}
              to="/"
              size="md"
              color="brand"
              leftIcon={<IconHome size={18} />}
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  )
}
