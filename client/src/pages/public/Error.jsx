import React from 'react'
import { Container, Title, Text, Button, Center, Stack, ThemeIcon } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Error() {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  return (
    <Container size="sm" py={80}>
      <Center>
        <Stack align="center" spacing="md" sx={{ textAlign: 'center' }}>
          <ThemeIcon size={80} radius="xl" color="red" variant="light">
            <IconAlertTriangle size={48} />
          </ThemeIcon>

          <Title order={2}>{t('errorPages.unexpectedTitle')}</Title>

          <Text color="dimmed" size="md" sx={{ maxWidth: 450 }}>
            {t('errorPages.unexpectedDesc')}
          </Text>

          <Button
            size="md"
            mt="md"
            onClick={() => navigate('/')}
            variant="filled"
          >
            {t('actions.backToHome')}
          </Button>
        </Stack>
      </Center>
    </Container>
  )
}