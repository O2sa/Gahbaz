// src/utils/analytics.js

import ReactGA from 'react-ga4'

// Disable Google Analytics in development unless explicitly forced via VITE_ENABLE_GA=true
const isDev = import.meta.env.DEV && import.meta.env.VITE_ENABLE_GA !== 'true'

export const initGA = (measurementId) => {
  if (isDev) {
    return
  }
  if (!measurementId) return
  ReactGA.initialize(measurementId)
}

export const logPageView = (pageName, search = '') => {
  if (isDev) {
    return
  }
  ReactGA.send({ hitType: 'pageview', page: pageName + search })
}

