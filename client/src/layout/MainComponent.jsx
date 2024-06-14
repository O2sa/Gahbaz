import React, { createContext, useState, useEffect, useContext } from 'react'
import { Outlet, matchRoutes, useLocation } from 'react-router-dom'
import getRoutes from '../routes'
import { initGA, logPageView } from '../utils/analytics'

const AppContext = createContext()

export const MainLayout = ({ children }) => {
  const location = useLocation()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  useEffect(() => {
    initGA('G-P7SYZGRE0X')
  }, [])

  useEffect(() => {
    console.log('Current location:', location.pathname)

    createBreadCrumbs(location)
    logPageView(
      breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : '',
      location.search,
    )

    // Perform actions based on location change here
  }, [location])

  // const location = useLocation()

  const createBreadCrumbs = (location) => {
    const matches = matchRoutes(getRoutes(), location)
    const brs = matches.reduce((acc, match, index) => {
      const route = match.route
      const path = match.pathname

      // Avoid duplicate paths
      if (!acc.find((b) => b.path === path)) {
        acc.push({ name: route.name, path })
      }

      return acc
    }, [])

    setBreadcrumbs(brs)
  }

  return (
    <AppContext.Provider
      value={{
        breadcrumbs,
      }}
    >
      <Outlet />
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
