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
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { mantineTheme } from './theme/index.js'
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
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={rtlCache}
        theme={mantineTheme}
      >
          <DatesProvider settings={{ locale: 'ar', firstDayOfWeek: 6, weekendDays: [4, 5] }}>
            <ModalsProvider labels={{ confirm: 'حفظ', cancel: 'إلغاء' }}>
              <Suspense fallback={loading}>
                <RouterProvider router={router} />
              </Suspense>{' '}
            </ModalsProvider>
          </DatesProvider>
          <Notifications />
        </MantineProvider>
        {/* </CloudinaryContext> */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
  )
}

export default App
