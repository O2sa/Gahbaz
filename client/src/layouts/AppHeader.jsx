import React from 'react'
import {
  Header,
  Group,
  Burger,
  Text,
  ActionIcon,
  Indicator,
  Box,
  MediaQuery,
} from '@mantine/core'
import { IconBell, IconSchool } from '@tabler/icons-react'
import UserMenu from './UserMenu.jsx'

export default function AppHeader({ opened, setOpened, user }) {
  return (
    <Header height={64} p="xs" px="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Group spacing="sm">
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              mr="xl"
            />
          </MediaQuery>

          <Group spacing="xs">
            <ActionIcon
              size={36}
              radius="md"
              variant="gradient"
              gradient={{ from: 'brand', to: 'violet', deg: 45 }}
            >
              <IconSchool size={22} color="white" />
            </ActionIcon>
            <Box>
              <Text weight={700} size="md" sx={{ lineHeight: 1.2 }}>
                منصة جَهْبَذ
              </Text>
              <Text size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
                النظام الأكاديمي الذكي
              </Text>
            </Box>
          </Group>
        </Group>

        <Group spacing="md">
          <Indicator inline size={9} offset={4} position="top-end" color="red">
            <ActionIcon variant="subtle" size="lg" radius="md">
              <IconBell size={20} stroke={1.5} />
            </ActionIcon>
          </Indicator>

          <UserMenu user={user} />
        </Group>
      </div>
    </Header>
  )
}
