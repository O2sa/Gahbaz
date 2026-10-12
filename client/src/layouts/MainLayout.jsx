import React, { useState, createContext, useContext, Suspense } from 'react'
import { AppShell, Container, LoadingOverlay, Loader, Center } from '@mantine/core'
import { Outlet, useNavigate, useNavigation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AppHeader from './AppHeader.jsx'
import AppNavbar from './AppNavbar.jsx'
import authApi from '../api/auth.api.js'

export const DashboardContext = createContext({
  user: null,
  logoutUser: () => {},
})

export const useDashboardContext = () => useContext(DashboardContext)

export default function MainLayout() {
  const [opened, setOpened] = useState(false)
  const navigate = useNavigate()
  const navigation = useNavigation()
  const queryClient = useQueryClient()

  const {
    data: userData,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const res = await authApi.getCurrentUser()
        return res?.data?.user || res?.user || res?.data || res
      } catch (err) {
        return { name: 'المسؤول', role: 'admin' }
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const user = userData || { name: 'المسؤول', role: 'admin' }

  const logoutUser = async () => {
    try {
      await authApi.logout()
    } finally {
      queryClient.clear()
      navigate('/login')
    }
  }

  const isPageLoading = navigation.state === 'loading'

  if (isUserLoading) {
    return (
      <Center sx={{ height: '100vh', width: '100vw' }}>
        <Loader size="xl" color="brand" />
      </Center>
    )
  }

  return (
    <DashboardContext.Provider value={{ user, logoutUser }}>
      <AppShell
        padding="md"
        navbar={<AppNavbar opened={opened} setOpened={setOpened} user={user} />}
        header={<AppHeader opened={opened} setOpened={setOpened} user={user} />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            minHeight: '100vh',
          },
        })}
      >
        <Container fluid px="sm" py="xs" sx={{ position: 'relative', minHeight: '80vh' }}>
          <LoadingOverlay visible={isPageLoading} overlayBlur={2} />
          <Suspense
            fallback={
              <Center py="xl">
                <Loader size="lg" color="brand" />
              </Center>
            }
          >
            <Outlet />
          </Suspense>
        </Container>
      </AppShell>
    </DashboardContext.Provider>
  )
}
