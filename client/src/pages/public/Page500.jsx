import React from 'react'
import { Container, Title, Text, Button, Group, Center, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconHome, IconRefresh } from '@tabler/icons-react'

export default function Page500() {
  return (
    <Container size="md" py={80}>
      <Center>
        <Stack align="center" spacing="md" sx={{ textAlign: 'center' }}>
          <Title
            sx={(theme) => ({
              fontSize: 100,
              fontWeight: 900,
              color: theme.colors.red[6],
              lineHeight: 1,
            })}
          >
            500
          </Title>
          <Title order={2}>حدث خطأ غير متوقع في الخادم</Title>
          <Text color="dimmed" size="lg" sx={{ maxWidth: 500 }}>
            نواجه مشكلة في معالجة طلبك حالياً. تم تسجيل الخطأ وجاري العمل على حله.
          </Text>
          <Group position="center" mt="md">
            <Button
              size="md"
              variant="outline"
              color="gray"
              leftIcon={<IconRefresh size={18} />}
              onClick={() => window.location.reload()}
            >
              إعادة تحميل الصفحة
            </Button>
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
