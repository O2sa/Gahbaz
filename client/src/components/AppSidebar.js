import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import getNavs from '../_nav'
import { updateSidebarState } from 'src/dataLogic/CollageManagementSlice.mjs'

const AppSidebar = ({sidebarShow, stateChange}) => {
  // const dispatch = useDispatch()
  // const sidebarShow = useSelector((state) => state.sidebarStates.sidebarShow)
  // console.log(getNavs())

  return (
    <CSidebar
      position="fixed"
      unfoldable={sidebarShow.sidebarUnfoldable}
      visible={sidebarShow.sidebarShow}
      onVisibleChange={(visible) => {
        stateChange({sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={getNavs()} />
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
