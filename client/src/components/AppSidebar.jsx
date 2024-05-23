import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from '../assets/brand/logo-negative'
import { sygnet } from '../assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import getNavs from '../_nav'
import { useDashboardContext } from '../layout/DefaultLayout'
// import { updateSidebarState } from 'src/dataLogic/CollageManagementSlice.js'

const AppSidebar = ({sidebarShow, stateChange}) => {
  const { user } = useDashboardContext()


  return (
    <CSidebar
    style={{zIndex: 100}} 
    color='dark'
      position="fixed"
      unfoldable={sidebarShow.sidebarUnfoldable}
      visible={sidebarShow.sidebarShow}
      onVisibleChange={(visible) => {
        stateChange({sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={getNavs(user)} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => stateChange({  sidebarUnfoldable: !sidebarShow.sidebarUnfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
