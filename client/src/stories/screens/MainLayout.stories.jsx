import { MainLayout } from './MainLayout'
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Collages from './Collages'
import CollageInfo from './CollageInfo'
import DefaultLayout from 'src/layout/DefaultLayout'

export default {
  component: MainLayout,
  title: 'Screens/MainLayout',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}
