import React from 'react'
import { Container, Title, Text, Button, Group, Center, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'
import { IconHome, IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export default function Page500() {
  const { t } = useTranslation('common')

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
          <Title order={2}>{t('errorPages.serverErrorTitle')}</Title>
          <Text color="dimmed" size="lg" sx={{ maxWidth: 500 }}>
            {t('errorPages.serverErrorDesc')}
          </Text>
          <Group position="center" mt="md">
            <Button
              size="md"
              variant="outline"
              color="gray"
              leftIcon={<IconRefresh size={18} />}
              onClick={() => window.location.reload()}
            >
              {t('actions.reload')}
            </Button>
            <Button
              component={Link}
              to="/"
              size="md"
              color="brand"
              leftIcon={<IconHome size={18} />}
            >
              {t('actions.backToHome')}
            </Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  )
}
