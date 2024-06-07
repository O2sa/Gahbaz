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
import { Center, Image } from '@mantine/core'
// import { updateSidebarState } from 'src/dataLogic/CollageManagementSlice.js'
import logo from '../assets/brand/Logo.svg'
const AppSidebar = ({ sidebarShow, stateChange }) => {

  return (
    <CSidebar
      style={{ zIndex: 99 }}
      color="dark"
      position="fixed"
      unfoldable={sidebarShow.sidebarUnfoldable}
      visible={sidebarShow.sidebarShow}
      onVisibleChange={(visible) => {
        stateChange({ sidebarShow: visible })
      }}
    >
      <CSidebarBrand className=" bg-white " to="/">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
        <Center>
          <Image src={logo} />
        </Center>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={getNavs()} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => stateChange({ sidebarUnfoldable: !sidebarShow.sidebarUnfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
