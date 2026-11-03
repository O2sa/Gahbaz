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
import { getEmotionCache } from './theme/emotionCache.js'
import './i18n/index.js'
import { useTranslation } from 'react-i18next'
import 'dayjs/locale/ar'
import 'dayjs/locale/en'
import dayjs from 'dayjs'
import { DatesProvider } from '@mantine/dates'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})

export const router = createBrowserRouter(getRoutes(queryClient))

function App() {
  const { i18n, t } = useTranslation()
  const isRtl = !i18n.language?.startsWith('en')
  const dir = isRtl ? 'rtl' : 'ltr'

  // Synchronize dayjs locale with active language
  useEffect(() => {
    dayjs.locale(isRtl ? 'ar' : 'en')
  }, [isRtl])

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
      document.documentElement.setAttribute('dir', dir)
      document.documentElement.setAttribute('lang', isRtl ? 'ar' : 'en')
      document.documentElement.style.colorScheme = colorScheme
      document.documentElement.style.backgroundColor =
        colorScheme === 'dark' ? '#141517' : '#f8fafc'
    }
  }, [colorScheme, dir, isRtl])

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={getEmotionCache(isRtl)}
          theme={{
            ...getMantineTheme(colorScheme),
            dir,
            fontFamily: isRtl
              ? 'Cairo, -apple-system, BlinkMacSystemFont, sans-serif'
              : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <DatesProvider
            settings={{
              locale: isRtl ? 'ar' : 'en',
              firstDayOfWeek: isRtl ? 6 : 0,
              weekendDays: isRtl ? [4, 5] : [0, 6],
            }}
          >
            <ModalsProvider
              labels={{
                confirm: t('actions.save', { defaultValue: 'حفظ' }),
                cancel: t('actions.cancel', { defaultValue: 'إلغاء' }),
              }}
            >
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

