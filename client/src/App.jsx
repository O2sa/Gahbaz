import React, { Component, Suspense, createContext, useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import getRoutes from './routes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigation,
} from 'react-router-dom'
import { ModalsProvider } from '@mantine/modals'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useLocalStorage, useColorScheme } from '@mantine/hooks'
import { Notifications } from '@mantine/notifications'
import { getMantineTheme } from './theme/index.js'
import { rtlCache } from './theme/rtlCache.js'
import 'dayjs/locale/ar'
import dayjs from 'dayjs'

dayjs.locale('ar') // use loaded locale globally
import { DatesProvider } from '@mantine/dates'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

export const router = createBrowserRouter(getRoutes(queryClient))

function App() {
  // 1. Detect system preference reactively
  const systemColorScheme = useColorScheme(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  )

  // 2. Synchronous initialization: reads localStorage immediately on frame 0 without flash
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'gahbaz-color-scheme',
    defaultValue: systemColorScheme,
    getInitialValueInEffect: false,
  })

  // 3. If user has not explicitly locked a manual preference, follow OS theme changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gahbaz-color-scheme')
      if (!stored && systemColorScheme && systemColorScheme !== colorScheme) {
        setColorScheme(systemColorScheme)
      }
    } catch (e) {}
  }, [systemColorScheme, colorScheme, setColorScheme])

  // 4. Synchronize document root attributes and styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-color-scheme', colorScheme)
      document.documentElement.style.colorScheme = colorScheme
      document.documentElement.style.backgroundColor =
        colorScheme === 'dark' ? '#141517' : '#f8fafc'
    }
  }, [colorScheme])

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={rtlCache}
          theme={getMantineTheme(colorScheme)}
        >
          <DatesProvider settings={{ locale: 'ar', firstDayOfWeek: 6, weekendDays: [4, 5] }}>
            <ModalsProvider labels={{ confirm: 'حفظ', cancel: 'إلغاء' }}>
              <Suspense fallback={loading}>
                <RouterProvider router={router} />
              </Suspense>
            </ModalsProvider>
          </DatesProvider>
          <Notifications />
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  )
}

export default App
