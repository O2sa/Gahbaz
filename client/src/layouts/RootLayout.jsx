import React, { createContext, useState, useEffect, useContext } from 'react'
import { Outlet, matchRoutes, useLocation } from 'react-router-dom'
import getRoutes from '../routes'
import { initGA, logPageView } from '../utils/analytics'

const AppContext = createContext({
  breadcrumbs: [],
})

export const RootLayout = () => {
  const location = useLocation()
  const [breadcrumbs, setBreadcrumbs] = useState([])

  useEffect(() => {
    initGA('G-P7SYZGRE0X')
  }, [])

  useEffect(() => {
    try {
      const routes = getRoutes()
      if (routes && location) {
        const matches = matchRoutes(routes, location) || []
        const brs = matches.reduce((acc, match) => {
          const route = match.route
          const path = match.pathname
          if (route?.name && !acc.find((b) => b.path === path)) {
            acc.push({ name: route.name, path })
          }
          return acc
        }, [])
        setBreadcrumbs(brs)
        const currentTitle = brs.length > 0 ? brs[brs.length - 1].name : ''
        logPageView(currentTitle, location.search)
      }
    } catch (e) {
      // ignore route matching errors during fast navigation
    }
  }, [location])

  return (
    <AppContext.Provider value={{ breadcrumbs }}>
      <Outlet />
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
export default RootLayout
