// src/utils/analytics.js

import ReactGA from 'react-ga4'

export const initGA = (measurementId) => {
  ReactGA.initialize(measurementId)
}

export const logPageView = (pageName, search) => {
  console.log('pageName', pageName)
  ReactGA.send({ hitType: 'pageview', page: pageName + search })
}
