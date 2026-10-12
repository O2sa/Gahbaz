import React from 'react'
import { Container, Title, Text, Button, Center, Stack, ThemeIcon } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export default function Error() {
  const navigate = useNavigate()

  return (
    <Container size="sm" py={80}>
      <Center>
        <Stack align="center" spacing="md" sx={{ textAlign: 'center' }}>
          <ThemeIcon size={80} radius="xl" color="red" variant="light">
            <IconAlertTriangle size={48} />
          </ThemeIcon>

          <Title order={2}>حدث خطأ غير متوقع</Title>

          <Text color="dimmed" size="md" sx={{ maxWidth: 450 }}>
            نعتذر، حدث خطأ أثناء معالجة طلبك. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
          </Text>

          <Button
            size="md"
            mt="md"
            onClick={() => navigate('/')}
            variant="filled"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </Stack>
      </Center>
    </Container>
  )
}