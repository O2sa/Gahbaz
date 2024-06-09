import React, { useEffect, Suspense, useState, createContext, useContext } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Navigate, Route, Routes, useNavigate, Outlet, useNavigation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'

// routes config
import getRoutes from '../routes'
import customFetch from '../utils/customFetch'
import { useGetElements } from '../pages/crud'
import { useQuery } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getNotfication } from '../pages/notfications'

const TRACKING_ID = 'G-P7SYZGRE0X' // Replace with your actual tracking ID

ReactGA.initialize(TRACKING_ID)

const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search)
  }, [location])
}

export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(useGetElements(['users', 'current-user']))
  } catch (error) {
    return redirect('/')
  }
}

const DashboardContext = createContext()

const DefaultLayout = ({ queryClient }) => {
  const location = useLocation()
  usePageTracking()

  const {
    data: user = [],
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['users', 'current-user']))

  const navigate = useNavigate()
  const navigation = useNavigation()
  const [isAuthError, setIsAuthError] = useState(false)

  const isPageLoading = navigation.state === 'loading'

  // Define an array of paths that represent lessons
  const lessonPaths = ['/lesson', '/study'] // Example paths for lessons

  // Check if the current path is a lesson path
  const isCurrentPathLesson = lessonPaths.some((path) => location.pathname.includes(path))

  const [sidebarState, setSidebarState] = useState({
    sidebarShow: true,
    sidebarUnfoldable: false,
  })

  const routes = getRoutes()
  const stateChange = (state) => {
    setSidebarState((prev) => ({ ...prev, ...state }))
  }

  const logoutUser = async () => {
    navigate('/landing')
    await customFetch.get('/auth/logout')
    queryClient.invalidateQueries()
    notifications.show({
      id: 'collage-created',
      title: 'Success!',
      message: 'loggin out!',
      variant: 'success',
      autoClose: 5000,
    })
  }

  customFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log(error?.response?.status)
      if (error?.response?.status === 401) {
        setIsAuthError(true)
      } else if (error?.response?.status === 400 || error?.response?.status === 403) {
        console.log('error', error?.response?.data?.msg)
        // getNotfication(false,  error?.response?.data?.msg)
        // navigate('/')
      }
      return Promise.reject(error)
    },
  )

  useEffect(() => {
    if (!isAuthError) return
    logoutUser()
  }, [isAuthError])

  if (isFetchingTeachers) {
    return <CSpinner color="primary" />
  }
  return (
    <DashboardContext.Provider
      value={{
        user,
        logoutUser,
      }}
    >
      <div>
        <AppSidebar sidebarShow={sidebarState} stateChange={stateChange} />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader sidebarShow={sidebarState} stateChange={stateChange} />
          <div className="body flex-grow-1 px-3">
            <CContainer
              fluid={isCurrentPathLesson ? true : false}
              lg={!isCurrentPathLesson ? true : false}
            >
              <Suspense fallback={<CSpinner color="primary" />}>
                {isPageLoading ? <CSpinner color="primary" /> : <Outlet />}{' '}
              </Suspense>
            </CContainer>{' '}
          </div>
          {/* <AppFooter /> */}
        </div>
      </div>
    </DashboardContext.Provider>
  )
}
export const useDashboardContext = () => useContext(DashboardContext)

export default DefaultLayout
