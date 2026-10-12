import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Box, Grid, Tabs, Text } from '@mantine/core'

export const TabsLinks = ({ tabs = [] }) => {
  if (!tabs.length) return <Outlet />

  return (
    <Box bg="white" sx={{ minHeight: '80vh' }}>
      <Tabs defaultValue={tabs[0]?.name}>
        <Grid grow gutter="xs" sx={{ gap: 0 }}>
          {tabs.map((tab) => (
            <Grid.Col key={tab.to || tab.name} span="auto">
              <Link to={tab.to} style={{ textDecoration: 'none' }}>
                <Tabs.Tab
                  w="100%"
                  icon={tab.icon ? <tab.icon size="1.25rem" /> : null}
                  value={tab.name}
                >
                  <Text size="md">{tab.name}</Text>
                </Tabs.Tab>
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </Tabs>
      <Box p="md">
        <Outlet />
      </Box>
    </Box>
  )
}

export default TabsLinks
